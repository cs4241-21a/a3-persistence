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
    return client.db( 'SleepDataset' ).collection( 'SleepData' )
  })
  .then( __collection => {
    collection = __collection
    return collection.find({ }).toArray()
  })
  .then( console.log )
  
// route to get all docs
app.get( '/', (req,res) => {
  res.sendFile(__dirname + "/views/index.html");
})

//New//

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
      .deleteOne({ _id:mongodb.ObjectId( req.body.idElement) })
      .then( result => res.json( result ) )
})

//Add a route to update a document
app.post( '/update', (req,res) => {
    collection
      .updateOne(
        { _id:mongodb.ObjectId( req.body.id ) },
        { $set:{ 
          yourname:req.body.yourname,
          major:req.body.major,
          hours:req.body.hours,
          advice:req.body.advice
         } }
      )
      .then( result => res.json( result ) )
})
//logout button prevents adding to table for some reason
app.listen( 3000 )