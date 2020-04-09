const PORT = process.env.PORT || 3000;
const FICHIER_REPONSES = "réponses.json";

const fs = require("fs");
const express = require("express");
const app = express();

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
  let data
  try {
    data = await promesseReponses;
  } catch (err) {
    console.error("echec de lecture du fichier:", err);
    process.exit();
  }

  var reponses = JSON.parse(data);

  app.use(express.json()); // to support JSON-encoded bodies

  app.get("/", function (req, res) {
    res.send("Hello World");
  });

  app.get("/hello", function (req, res) {
    if (req.query.nom === undefined) {
      res.send("Quel est votre nom ?");
    } else {
      res.send("Bonjour, " + req.query.nom + " !");
    }
  });

  app.post("/chat", async function (req, res) {
    if (req.body.msg === "ville") {
      res.send("Nous sommes à Paris");
    } else if (req.body.msg === "météo") {
      res.send("Il fait beau");
    } else if (req.body.msg.indexOf(" = ") !== -1) {
      const [mot, definition] = req.body.msg.split(" = ");
      reponses[mot] = definition;
      try {
        await writeFileAsPromised(FICHIER_REPONSES, JSON.stringify(reponses))
        res.send("Merci pour cette information !");
      } catch (err) {
        console.error(err);
        res.send("Erreur... Reessayez plus tard.");
      }
    } else if (reponses[req.body.msg] !== undefined) {
      const definition = reponses[req.body.msg];
      res.send(`${req.body.msg}: ${definition}`);
    } else {
      res.send(`Je ne connais pas ${req.body.msg}...`);
    }
  });

  app.listen(PORT, function () {
    console.log("The server is listening on port", PORT);
  });
})();