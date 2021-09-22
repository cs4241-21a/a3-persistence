//questions:
//- how do I put a file like a favicon in public?


// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const mongodb = require("mongodb");
const request = require("request");
const favicon = require("serve-favicon");
const path = require('path');

const app = express();


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

//add favicon
app.use(favicon('https://cdn.glitch.com/85d44434-d6e1-4f6b-993e-b11e0d695501%2Ffavicon.ico?v=1632321063750'))


// code from https://github.com/cs4241-21a/cs4241-21a.github.io/blob/main/using_mongo.md
app.use( express.json() )

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null


client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'webware-a3' ).collection( 'webware-a3-collection' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( /*console.log */)
  
app.listen( 3000 )

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
app.get("/homepage.html", (request, response) => {
  response.sendFile(__dirname + "/views/homepage.html");
});

// send the data from mongodb to the webpage
app.get("/data", (request, response) => {
  // express helps us take JS objects and send them as JSON
  collection.find({ }).toArray()
  .then(data =>{
    response.json(data);
    //console.log(data);
    //console.log("request: data");
  })
});

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

// listen for requests :)
/*
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
*/
