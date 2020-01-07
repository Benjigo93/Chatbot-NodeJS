// Require all the dependencies

const express = require('express')
const app = express()
let encoding = require("encoding");
let fs = require('fs')

// Use json middleware to deal with json data
app.use(express.json());


// Define endpoints and responses
// GET '/'
app.get('/', function (req, res) {
  res.send('Hello World')
})


// GET '/hello'
app.get('/hello', (req, res) => {

  if (req.query.nom === undefined) {
    res.send('Quel est votre nom ?')
  } else {
    res.send('Bonjour, ' + req.query.nom + ' !')
  }
})

// POST '/chat'
app.post('/chat', (req, res) => {
  let message = encoding.convert(req.body.msg, 'utf8', 'Latin_1');
  if (req.body.msg === "ville") {
    res.send("Nous sommes à Paris");
  } else if (message == "mýtýo") {
    res.send("Il fait beau");
  } else if (req.body.msg !== undefined) {
    let resultat = parseData(req.body.msg)
    let JSONdata = getJSON()
    if (req.body.msg.includes("=")) {
      writeJSON(resultat)
      res.send("Merci pour cette information !")
    } else if (resultat[0] in JSONdata) {
      res.send(resultat[0] + ":" + JSONdata[resultat[0]])
    } else {
      res.send("Je ne connais pas " + resultat[0] + "...")
    }
  }
});

// Define PORT 
app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})

// Function to trim and to split the message which contents data for response.json and return it into an array
function parseData(data) {
  let message = data.split("=")
  let array = message.map(s => s.trim());
  return array
}

// Function to write into reponses.json
function writeJSON(array) {
  let rawdata = fs.readFileSync('reponses.json');
  let jsonData = JSON.parse(rawdata);
  let newJson = {}
  newJson[array[0]] = array[1]
  let finalJson = { ...jsonData, ...newJson }
  let data = JSON.stringify(finalJson, null, 2);
  fs.writeFileSync('reponses.json', data);
}

// Function to get data from reponses.json
function getJSON() {
  let rawdata = fs.readFileSync('reponses.json');
  let reponses = JSON.parse(rawdata);
  return reponses
}