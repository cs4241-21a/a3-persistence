const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      bodyparser = require('body-parser'),
      dotenv = require('dotenv').config(),
      app = express();

app.use( express.static('public') );
app.use( express.json() );

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = null;

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get("/login.html", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get("/index.html", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

client.connect()
  .then( () => {
    return client.db( 'SleepDataset' ).collection( 'SleepData' )
  })
  .then( __collection => {
    collection = __collection
    return collection.find({ }).toArray()
  })
  .then( console.log )

  app.get("/sleep", (req, res) => {
    if (collection !== null) {
      collection
        .find({username:user})
        .toArray()
        .then(result => res.json(result));
    }
  });

  app.post("/submit", bodyparser.json(), function(req,res) {
    console.log('body: ', req.body)
      //req.body['username'] = user

      collection.insertOne( req.body )
      .then( insertResponse => collection.findOne( insertResponse.insertedId ) ) 
      .then( findResponse   => res.json( findResponse ) )
    })

  app.post("/remove", bodyparser.json(), function(req, res) {
    collection
      .deleteOne({ _id: mongodb.ObjectId(req.body.idElement) })
      .then(result => res.json(result));
  });

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

  
  client.connect().then(() => {
  collection = client.db("SleepDataset").collection("UserData");
});

let user = null;
app.post("/login", bodyparser.json(), function(req, res) {
  collection
    .find({ username: req.body.username, password: req.body.password })
    .toArray()
    .then(result => res.json(result));
  user = req.body.username;
});

/*app.post("/logout", bodyparser.json(), function(req, res) {
  user = null;
  console.log("pop")
});*/

app.listen( 3000 )

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});