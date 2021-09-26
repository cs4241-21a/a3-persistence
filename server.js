console.log("hello!!!")
const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      cookie  = require( 'cookie-session' ),
      bodyparser = require( 'body-parser' ),
      session = require('express-session'),
      errorhandler = require("errorhandler"),
      responseTime = require("response-time"),
      app = express()

app.use( express.static('public') )
app.use( express.json() )
app.use( express.urlencoded({ extended:true }) )
//app.use(errorhandler())
app.use(responseTime())

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

const client = new mongodb.MongoClient( process.env.DBuri, { useNewUrlParser: true, useUnifiedTopology:true })
let user_collection = null
let collection = null
let username = null

console.log("get it!")

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'datatest' ).collection( 'users' )
  })
  .then( __collection => {
    // store reference to collection
    user_collection = __collection
    // blank query returns all documents
    return user_collection.find({ }).toArray()
  })
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

// app.get('/main.html', (req, res) =>{
//   console.log("real " + req.session.username)
//   res.sendFile(__dirname + '/public/main.html')
// })

// app.get('/index.html', (req, res) =>{
//   res.sendFile(__dirname + '/public/index.html')
// })

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post( '/login', bodyparser.json(), function(req,res){
  console.log("logging in!")
  user_collection.find({
    "username":req.body.username
  }).toArray().then(dbresponse => {
    if (dbresponse.length === 0){
      console.log("didnt find user!")
      res.end(JSON.stringify("The account does not exist"))
    }
    else {
      let password = dbresponse[0].password
      const pass = req.body.password
      if (pass === password){
        req.session.username = req.body.username
        username = req.body.username
        console.log(req.session.username)
        res.redirect('/main.html')
      }
      else {
        res.send("Error: Authorization failed")
      }
    }
  })
})

app.use( function( req,res,next) {
  if( req.session.login === true || req.method === "POST" ){
    next()
  }
  else{
    res.sendFile( __dirname + '/public/index.html' )
  }

})

app.post('/create', bodyparser.json(), function(req,res){
  user_collection.find({
    "username":req.body.username
  }).toArray().then(dbresponse => {
    console.log(dbresponse.length)
    if (dbresponse.length === 0){
      user_collection.insertOne(req.body)
      res.end(JSON.stringify("Successfully created a new account!"))
    }
    else {
      res.end(JSON.stringify("Account already exists"))
    }
  })
})

// add some middleware that always sends unauthenicaetd users to the login page
app.post( '/getdata', (req,res) => {
  // assumes only one object to insert
  if( collection !== null ) {
    // get array and pass to res.json
    console.log(req.session.username)
    collection.find({ "username":req.session.username }).toArray().then( result => {res.json(result)} )
  }
})

app.post( '/add', (req,res) => {
  // assumes only one object to insert
  const json = req.body
  json.username = username
  collection.insertOne( json ).then( result => res.json( result ) )
})

app.post( '/delete', (req,res) => {
  collection
    .deleteOne({ _id:mongodb.ObjectId( req.body.id ) })
    .then( result => res.json( result ) )
})

app.post( '/update', (req,res) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectId( req.body.id ) },
      { $set:{ servantname:req.body.servantname } }
    )
    .then( result => res.json( result ) )
})

app.listen( 3000 )