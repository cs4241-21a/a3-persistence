

// // our default array of dreams
// const dreams = [
//   "Find and count some sheep",
//   "Climb a really tall mountain",
//   "Wash the dishes"
// ];

// // send the default array of dreams to the webpage
// app.get("/dreams", (request, response) => {
//   // express helps us take JS objects and send them as JSON
//   response.json(dreams);
// });

// add new data to the server
// app.post


// update data in server
// app.update

// delete data from server
// app.delete










const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      bodyParser = require('body-parser'),
      app = express()

app.use( express.static('public') )
app.use( express.json() )

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'test' ).collection( 'musictest' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    // console.log('connect collection', collection.find({ }).toArray())
    return collection.find({ }).toArray()
  })
  // .then( console.log )
  
// route to get all docs
app.get( '/', (req,res) => {
  res.sendFile(__dirname + "/views/index.html");
})

app.get('/history', (req, res) => {
  // console.log('history')
  if( collection !== null ) {
    debugger
    // get array and pass to res.json
    // console.log('collection', collection)
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})


// middleware to check connection
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

// add a route to insert data
app.post( '/add', (req,res) => {
  // assumes only one object to insert
  console.log( 'new request', req.body )
  collection.insertOne( req.body ).then( result => res.json( result ) )
})


// listen for requests :)
const listener = app.listen(process.env.PORT || 3001, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
  
// app.listen( 3000 )

