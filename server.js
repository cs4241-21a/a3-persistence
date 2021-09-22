const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      cookie  = require( 'cookie-session' ),
      bodyParser = require('body-parser'),
      slash   = require('express-slash'),
      compression = require('compression'),
      responseTime = require('response-time'),
      app = express()
app.use(compression())
app.use( express.urlencoded({ extended:true }) )

app.use(responseTime())
app.use(responseTime(function (req, res, time) {
  console.log("Response time " + time + " milliseconds")
}))

//Slash middle ware 
app.enable('strict routing');
var router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict       : app.get('strict routing')
});
app.use(router);
app.use(slash());
router.get('/', function (req, res) {
  res.redirect( 'login.html' )
});

let curUser = ""

//Cookie middleware 
app.use( cookie({
  name: 'session',
  keys: ['testKey1', 'testKey2']
}))

//TODO switch to env when moving to glitch
const uri = "mongodb+srv://Test:Testing123@cluster0.yfsjf.mongodb.net/"
//const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null
client.connect()
  .then( () => {
    //Only create collection if it doesn't exist
    return client.db( 'DataA3' ).collection( 'DA3' )
  })
  .then( __collection => {
    //Store reference to collection
    collection = __collection
    //Blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )

//Route to get all docs
app.get( '/', (req,res) => {
  if( collection !== null ) {
    debugger
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})

app.post( '/login', (req,res)=> {
  //Look for that username 
  collection.findOne({"username": req.body.username}) 
  .then(findResponse => {
    if (findResponse === null){
      collection.insertOne({"username":req.body.username,"password":req.body.password,"entries":[]})

      //Define a variable that we can check in other middleware
      //The session object is added to our requests by the cookie-session middleware
      req.session.login = true
    
      curUser = req.body.username

      //Login now successful (use redirect to avoid authentication problems)
      res.redirect( 'index.html' )
    }
    else{
      //Check password part of login
      if (req.body.password === findResponse.password){
        //Define a variable that we can check in other middleware
        //The session object is added to our requests by the cookie-session middleware
        req.session.login = true
    
        curUser = req.body.username

        //Login successful (use redirect to avoid authentication problems)
        res.redirect( 'index.html' )
      }
      else {
        //Password incorrect so redirect  back to login page
        res.sendFile( __dirname + '/public/login.html' )
      }
    }
  })
})

app.post( '/getUserContacts', (req,res) => {
  if( collection !== null ) {
    collection.findOne({username:curUser})
    .then(findResponse => {
      if(findResponse !== null){
      let obj_ids = findResponse.entries.map(function(id) { return mongodb.ObjectId(id)})
      collection.find({_id: {$in: obj_ids}}).toArray().then( result => res.json( result ) )
      }
    })
  }
}) 

app.post( '/submit', bodyParser.json(), (req,res) => {
  // assumes only one object to insert
  entry = req.body

  if (entry.rowName !== ''){
    collection.deleteOne({ _id:mongodb.ObjectId(entry.rowName)})
    .then(response => {
      collection.updateOne({'username':curUser},{ $pull: { 'entries':entry.rowName} })
    })
  }
  
  let id = ""
  collection.insertOne( req.body )
    .then( insertResponse => {
      id = insertResponse.insertedId 
      collection.updateOne({'username':curUser},{ $push: { 'entries':id.toString()} })
    })
    .then(response => {
      return collection.findOne(id ) 
    })
    .then( findResponse => {

      return res.json(findResponse)
    })
})

app.post( '/deleteEntry', bodyParser.json(), (req,res) => {
  entry = req.body
  collection.deleteOne({ _id:mongodb.ObjectId(entry.nameToRemove)})
  .then(response => {
    collection.updateOne({'username':curUser},{ $pull: { 'entries':entry.nameToRemove} })
  })
})

//Middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/login.html' )
})
  
//Serve up static files in the directory public
app.use( express.static('public') )

app.listen(process.env.PORT || 3000);