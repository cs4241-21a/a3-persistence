const express = require('express');
const bodyParser = require('body-parser');
const app = express()

app.use(function(req, res, next) {
    console.log(req.url)
    next()
})

app.use(express.static('./'))


app.post("/add", bodyParser.json(),  (request, response) => {
    console.log( request.body)
})

app.listen(3000)