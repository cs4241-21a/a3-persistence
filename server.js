const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      bodyparser = require('body-parser'),
      dotenv = require('dotenv').config(),
      app = express();

app.use( express.static('public') )
app.use( express.json() )

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'dataset' ).collection( 'test' )
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
    // get array and pass to res.json
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})

app.post("/submit", bodyparser.json(), function(req,res) {
    console.log('body: ', req.body)

      //req.body['username'] = user

      collection.insertOne( req.body )
      .then( insertResponse => collection.findOne( insertResponse.insertedId ) ) 
      .then( findResponse   => res.json( findResponse ) )
    })


//Add a route to remove a todo
app.post( '/remove', (req,res) => {
    collection
      .deleteOne({ _id:mongodb.ObjectId( req.body._id ) })
      .then( result => res.json( result ) )
})

//Add a route to update a document
app.post( '/update', (req,res) => {
    collection
      .updateOne(
        { _id:mongodb.ObjectId( req.body._id ) },
        { $set:{ name:req.body.name } }
      )
      .then( result => res.json( result ) )
})

app.listen( 3000 )