const express    = require('express'),
      bodyParser = require( 'body-parser' ),
      app        = express()

app.use( express.static( 'public' ) )



const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let collection= null
const uri = `mongodb+srv://dbUser:Michael1@csweb.0knbq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  collection = client.db("contactApp").collection("userData");
});


app.get('/', function(request, response) {
  response.sendFile( __dirname + '/index.html' )
})

app.post( '/submit', bodyParser.json(), function( request, response ) {
  collection.insertOne( request.body )
    .then( insertResponse => collection.findOne( insertResponse.insertedId ) ) 
    .then( findResponse   => response.json( findResponse ) )
  .catch(err => console.log(err)) 
})

app.get('/getData', function(request, response) {
  if( collection !== null ) {
    collection.find({ }).toArray().then( result => { response.json( result ) } )
  }
})

app.post('/getItem',  bodyParser.json(), function(request, response) {
  if( collection !== null ) {
    collection.findOne( { _id:mongodb.ObjectId( request.body.id ) } )
      .then( result => { response.json( result ) })
  }
})

app.post('/delete', bodyParser.json(), function(request, response) {
  collection
    .deleteOne({ _id:mongodb.ObjectId( request.body.id ) })
    .then( result => response.json( result ) )
})

app.post('/update', bodyParser.json(), function(request, response) {
 
  collection
    .updateOne(
      { _id:mongodb.ObjectId( request.body.modifyInput ) },
      { $set:{ name:request.body.name,
               email:request.body.email,
               number:request.body.number,
               age:request.body.age,
               occupation:request.body.occupation,
               age_group:request.body.age_group,
               education_level:request.body.education_level,
               notes:request.body.notes
              } }
    )
    .then( result => response.json( result ) )
})




const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

