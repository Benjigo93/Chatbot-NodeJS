const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(web.process.PORT, function () {
  console.log('Example app listening on port 3000!')
})