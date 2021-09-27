// server.js
// where your node app starts

require('dotenv').config()

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
// const express = require("express");
// const app = express();
const express    = require('express'),
      mongodb = require( 'mongodb' ),
      refleftmd = require( 'reflect-metadata' ),
      bodyparser = require( 'body-parser' ),
      app        = express(),
      port = 3000,
      mime = require( 'mime' )
      // dreams     = []

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

var appdata = []

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// get json when appropriate
app.use( express.json() )

const uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'RateYourBooks' ).collection( 'Books' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/add', (req,res) => {
  // assumes only one object to insert
  collection.insertOne( req.body ).then( result => res.json( result ) )
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/remove', (req,res) => {
  collection
    .deleteOne({ _id:mongodb.ObjectId( req.body._id ) })
    .then( result => res.json( result ) )
})

app.post( '/update', (req,res) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
    )
    .then( result => res.json( result ) )
})

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/login", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.post( '/submit', bodyparser.json(), function( request, response ) {
  dreams.push( request.body.newdream )
  response.writeHead( 200, { 'Content-Type': 'application/json'})
  response.end( JSON.stringify( dreams ) )
})

app.post( '/submit-book', bodyparser.json(), function( request, response ) {
  console.log(`submit-book post request: ${request}`);
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const json = JSON.parse( dataString )
    appdata.push(json)
    appdata.sort(function ( a, b ) {
      if ( a.rating < b.rating ){
        return 1;
      }
      if ( a.rating > b.rating ){
        return -1;
      }
      if( a.year < b.year){
        return 1;
      }
      if ( a.year > b.year){
        return -1;
      }
      return 0;
    })
    for(var i = 0; i < appdata.length; i++){
      appdata[i].rank = i+1
    }

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  })
})

// send the default array of dreams to the webpage
app.get("/books", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(appdata);
});

// listen for requests :)
const listener = app.listen(process.env.PORT || port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
