const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      bodyparser = require('body-parser'),
      dotenv = require('dotenv').config(),
      app = express();

app.use( express.static('public') );
app.use( express.json() );

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
let userAccount = "";

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/login.html");
});

app.get("/login.html", (request, response) => {
  response.sendFile(__dirname + "/public/login.html");
});

app.get("/index.html", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

app.get('/logout', function(request, response) {
  //request.logout
  response.ok = true;
  return response.end();
})

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'SleepDataset' ).collection( 'SleepData' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )

app.post("/submit", bodyparser.json(), function(req,res) {
    console.log('body: ', req.body)
    console.log("username: ", req.body.USER)
      //req.body['username'] = user

      collection.insertOne( req.body )
      .then( insertResponse => collection.findOne( insertResponse.insertedId ) ) 
      .then( findResponse   => res.json( findResponse ) )
    })

//Add a route to remove a todo
app.post( '/remove', bodyparser.json(), function (req,res) {
    collection
      .deleteOne({ _id:mongodb.ObjectId( req.body.idElement ) })
      .then( result => res.json( result ) )
})

//Add a route to update a document
app.post( '/update', bodyparser.json(), function (req,res) {
    collection
      .updateOne(
        { _id:mongodb.ObjectId( req.body.id ) },
        { $set:{ 
          name:req.body.yourname,
          major:req.body.major,
          hours:req.body.hours,
          advice:req.body.advice } }
      )
      .then( result => res.json( result ) )
})

//Login
let loginCollection = null;

app.post('/login', bodyparser.json(), function(req,res) {

let userData = req.body
console.log("userData: ", userData);

let username = userData.username;
let password = userData.password;

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const loginCollection = client.db("UserDataset").collection("UserData");
  // perform actions on the collection object
  //client.close();
});
})

app.listen( 3000 )

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});