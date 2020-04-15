const PORT = process.env.PORT || 3000;
const dotenv = require('dotenv')
const FICHIER_REPONSES = "réponses.json";
const MongoClient = require('mongodb').MongoClient;
const fs = require("fs");
const express = require("express");
const app = express();

dotenv.config()
console.log("Lecture des réponses depuis", FICHIER_REPONSES);

function readFileAsPromised(file, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(FICHIER_REPONSES, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function writeFileAsPromised(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

const promesseReponses = readFileAsPromised(FICHIER_REPONSES, "utf8");

(async () => {
  const uri = "mongodb+srv://"+ process.env.DB_USER +":"+ process.env.DB_PASSWORD +"@"+ process.env.DB_URL;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const dbName = 'chat-bot';

  try {
    // Use connect method to connect to the Server
    await client.connect();
    const db = client.db(dbName);
    const colMsg = db.collection('messages')
    let data

    try {
      data = await promesseReponses;
    } catch (err) {
      console.error("echec de lecture du fichier:", err);
      process.exit();
    }

    var reponses = JSON.parse(data);
    app.use(express.json()); // to support JSON-encoded bodies

    app.get("/", async function (req, res) {
      let add = await colMsg.insertOne({from: 'bot', msg: 'Hello World'})
      res.send("Hello World");
    });

    app.get("/hello", async function (req, res) {
      if (req.query.nom === undefined) {
        let add = await colMsg.insertOne({from: 'bot', msg: 'Quel est votre nom ?'})
        res.send("Quel est votre nom ?");
      } else {
        let add = await colMsg.insertOne({from: 'user', msg: req.query.nom})
        let addAnswer = await colMsg.insertOne({from: 'bot', msg: "Bonjour, " + req.query.nom + " !"})
        res.send("Bonjour, " + req.query.nom + " !");
      }
    });

    app.post("/chat", async function (req, res) {
      if (req.body.msg === "ville") {
        let add = await colMsg.insertOne({from: 'user', msg: req.body.msg})
        let addAnswer = await colMsg.insertOne({from: 'bot', msg: "Nous sommes à Paris"})
        res.send("Nous sommes à Paris");
      } else if (req.body.msg === "météo") {
        let add = await colMsg.insertOne({from: 'user', msg: req.body.msg})
        let addAnswer = await colMsg.insertOne({from: 'bot', msg: "Il fait beau"})
        res.send("Il fait beau");
      } else if (req.body.msg.indexOf(" = ") !== -1) {
        const [mot, definition] = req.body.msg.split(" = ");
        reponses[mot] = definition;
        try {
          await writeFileAsPromised(FICHIER_REPONSES, JSON.stringify(reponses))
          let add = await colMsg.insertOne({from: 'user', msg: req.body.msg})
          let addAnswer = await colMsg.insertOne({from: 'bot', msg: "Merci pour cette information !"})
          res.send("Merci pour cette information !");
        } catch (err) {
          let add = await colMsg.insertOne({from: 'user', msg: "Erreur... Reessayez plus tard."})
          res.send("Erreur... Reessayez plus tard.");
        }
      } else if (reponses[req.body.msg] !== undefined) {
        let add = await colMsg.insertOne({from: 'user', msg: req.body.msg})
        const definition = reponses[req.body.msg];
        let addAnswer = await colMsg.insertOne({from: 'bot', msg: `${req.body.msg}: ${definition}`})
        res.send(`${req.body.msg}: ${definition}`);
      } else {
        let add = await colMsg.insertOne({from: 'user', msg: req.body.msg})
        let addAnswer = await colMsg.insertOne({from: 'bot', msg: `Je ne connais pas ${req.body.msg}...`})
        res.send(`Je ne connais pas ${req.body.msg}...`);
      }
    });

    app.get("/messages/all", async function (req, res) {
      const messages = await colMsg.find({}).toArray();
      res.send(messages)
    })

    app.delete("/messages/last", async function (req, res) {
      const all = await colMsg.find({}).sort({ _id: -1 }).toArray()
      if(all.length > 1){
        let userMsgId, botMsgId, userIndex
        all.some((message, i)=>{
          userMsgId = message._id
          userIndex = i
          return message.from == 'user'
        })
        botMsgId = all[userIndex-1]._id
        const deleteMsg = await colMsg.deleteMany({_id: {$in: [userMsgId, botMsgId]}})
        res.send('La dernière conversation a bien été supprimée')
      } else {
        res.send("Il n'y a aucune conversation à supprimer")
      }
    })

    app.listen(PORT, function () {
      console.log("The server is listening on port", PORT);
    });

  } catch (err) {
    console.log(err.stack);
  }
})();