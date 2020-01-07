const express = require('express')
const app = express()
let encoding = require("encoding");

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/hello', (req, res)=>{
  if(req.query.nom === undefined){
    res.send('Quel est votre nom ?')
  } else {
    res.send('Bonjour, ' + req.query.nom + ' !' )
  }

})

app.use(express.json());

app.post('/chat', (req, res)=>{
  let message = encoding.convert(req.body.msg, 'utf8', 'Latin_1');
  console.log(req.body)
  if(req.body.msg === "ville"){
    res.send("Nous sommes à Paris");  
  } else if (message == "mýtýo") {
    res.send("Il fait beau"); 
  }
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
}) 