//require('dotenv').config()
const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      app = express()
      bodyParser = require('body-parser')

app.use( express.static('public') )
app.use( express.json() )

const uri = 'mongodb+srv://test:test123@cluster0.0qmyh.mongodb.net/'

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

const jsonParser = bodyParser.json()

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
app.post( '/', (req,res) => {
  if( collection !== null ) {
    // get array and pass to res.json
    collection.find({ }).toArray().then( result => res.json( result ) )
    //console.log(res.json(result))
  }
})

app.post( '/add', (req,res) => {
  // assumes only one object to insert
  collection.insertOne( req.body ).then( result => res.json( result ) )
  //console.log(req.body._id)
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
      { $set:{ name:req.body.name} }
    )
    .then( result => res.json( result ) )
})
  
app.listen( 3000 )

//curl.exe --user test --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "move", "params": ["acc-1", "acc-2", 6, 5, "happy birthday!"] }' -H 'content-type: application/json;' http://localhost:3000/add
