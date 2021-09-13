const express    = require('express'),
      mongodb = require( "mongodb" ),
      app        = express(),
      dotenv     = require("dotenv");

dotenv.config();

// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use( express.static( 'public' ) )

// get json when appropriate
app.use( express.json() )

const uri = "mongodb+srv://tester:tester123@cluster0.qxfom.mongodb.net/FoodStorageManager?retryWrites=true&w=majority"

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'datatest' ).collection( 'test' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )
  
// route to get all docs
app.get( '/', (req,res) => {
  if( collection !== null ) {
    debugger
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})

app.post( '/add', (req,res) => {
  // assumes only one object to insert
  collection.insertOne( req.body ).then( result => res.json( result ) )
})
  
app.listen( 3000 )