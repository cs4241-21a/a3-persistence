const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      app = express()

app.use( express.static('public') )
app.use( express.json() )

// make sure to substitute your username / password for tester:tester123 below!!! 
const uri = "mongodb+srv://testUser:testing123@cluster0.gieka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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
  collection.insertOne( req.body )
  .then( insertResponse => collection.findOne(insertResponse.insertedId) )
  .then( findResponse => res.json( findResponse))
})

app.get('/data', (req, res) => {
  if (collection !== null) {
    collection.find({ }).toArray().then(result => res.json(result));
  }
});

  
app.listen( 3000 )
