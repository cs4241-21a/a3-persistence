// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyparser = require('body-parser')

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://AstroSeer:${process.env.DBPASSWORD}@cluster0.ajrtr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let collection = null
client.connect(err => {
  collection = client.db("data").collection("thedata");
  // perform actions on the collection object
});

app.post( '/add', bodyparser.json(), function ( req, res ) {
  console.log( 'body:', req.body )
  collection.insertOne( req.body ).then( dbresponse => {
    console.log( dbresponse )
    res.json( dbresponse.ops[0] )
  })
})