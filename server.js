const { count } = require('console')

const http = require( 'http' ),
      cookie  = require( 'cookie-session' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

//const {user, pass} = require('./env.js')
const user = process.env.username
const pass = process.env.password

const express = require('express');
const app = express();
const mongodb = require('mongodb');
const bodyparser = require('body-parser');
const { env } = require('process');

app.use(express.static("public"));
app.use(express.json());

app.use( express.urlencoded({ extended:true }) )

app.use( cookie({
  name: 'session',
  keys: ['key1','key2']
}))

const MongoClient = mongodb.MongoClient;
const uri =`mongodb+srv://${user}:${pass}@cluster0.kt8ex.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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
//.then(console.log)

app.post( '/login', function(req,res) {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered

  collection.find({'username':req.body.username}).toArray()
    .then(dbresponse => {

      let newUser = false

      if(dbresponse.length === 0){

        collection.insertOne(req.body)

         newUser = true
      }

      //console.log('aaa', req.body.password)
      //console.log('bbb', dbresponse[0].password)

    if( req.body.password === dbresponse[0].password || newUser === true ) {
      req.session.login = true
      req.session.user = req.body.username

      // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
      // make redirect
      res.sendFile( __dirname + '/views/index.html' )

    }else{
        // password incorrect, redirect back to login page
        res.sendFile( __dirname + '/views/login.html' )
      }
  })
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/views/login.html' )
})

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
})

app.post('/submit', bodyparser.json(),function(req, res){

  collection.insertOne(req.body)
  .then(dbresponse => {
    return collection.find({'_id':dbresponse.insertedId}).toArray()
  })
    .then(dbresponse =>{
      collection.updateOne({'_id':mongodb.ObjectId(req.body._id)},
      {$set:{ user:req.session.user} })
        .then( dbresponse=>{
          res.json(dbresponse)
         // console.log(dbresponse)
        })
  })
})

app.post('/delete', bodyparser.json(),function(req, res){
  
  collection.deleteOne({'_id':mongodb.ObjectId(req.body._id)}) 
  .then(dbresponse =>{
     res.json(dbresponse)
   })
 })

 app.post('/update', bodyparser.json(),function(req, res){

  collection.updateOne({'_id':mongodb.ObjectId(req.body._id)},
  {$set:{ todo:req.body.todo } })

  collection.updateOne({'_id':mongodb.ObjectId(req.body._id)},
  {$set:{ day:req.body.day } })

  collection.updateOne({'_id':mongodb.ObjectId(req.body._id)},
  {$set:{ difficulty:req.body.difficulty } })
      .then(dbresponse =>{
      res.json(dbresponse)
    })
})

app.post('/loadTable', bodyparser.json(),function(req, res){
  collection.find({}).toArray()
  .then(dbresponse =>{
    dbresponse.unshift(req.session.user)
  res.json(dbresponse)
  })
})

const sendFile = function( response, filename ) {
   //const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       // response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}
//app.listen(3000)
app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
})