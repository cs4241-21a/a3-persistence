// server1.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const mongodb = require('mongodb');
const bodyparser = require('body-parser');

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json());

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


const MongoClient = mongodb.MongoClient;
const uri = 'mongodb+srv://admin:admin@cluster0.kt8ex.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });
let collection = null

client.connect()
.then(() => {
  return client.db('data').collection('data')
})
.then(_collection => {
  collection = _collection
  return collection.find({ }).toArray()
})
.then(console.log)

app.post('/getData', function(req, res){
  collection.find({ }).toArray()
  .then((data) => {res.json(data) 
  console.log(data)
  })
})


app.post('/add', bodyparser.json(),function(req, res){
  console.log('body:', req.body)
  collection.insertOne(req.body)
  .then(dbresponse => {
    return collection.find({'_id':dbresponse.insertedId}).toArray()
  })
  .then(dbresponse =>{
  res.json(dbresponse[0])
  console.log(dbresponse[0])
  })
})

app.post('/delete',bodyparser.json(), function(req, res){
  collection.deleteOne({_id:mongodb.ObjectID(req.body.id)})
  .then( result => res.json( result ) )
})

app.listen(3000)