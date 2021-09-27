const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      cookie  = require( 'cookie-session' ),
      app = express(),
      mime = require( 'mime' ),
      bodyparser = require( 'body-parser'),
      slash   = require('express-slash'),
      responsetime = require('response-time'),
      compression = require('compression')

var StatsD = require('node-statsd')
// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

app.use( bodyparser.json() )
app.use( express.json() )

var stats = new StatsD()
app.use(responsetime(function (req, res, time) {
  var stat = (req.method + req.url).toLowerCase()
    .replace(/[:.]/g, '')
    .replace(/\//g, '_')
  stats.timing(stat, time)
}))

app.use(compression())

var theusername = ""

//Express slash middleware
app.enable('strict routing')
// Create the router using the same routing options as the app.
var router = express.Router({
    caseSensitive: app.get('case sensitive routing'),
    strict       : app.get('strict routing')
});
// Add the `slash()` middleware after your app's `router`, optionally specify
// an HTTP status code to use when redirecting (defaults to 301).
app.use(router);
app.use(slash());
router.get('/', function (req, res) {
    res.redirect('login.html');
});

//Mongodb
const uri = 'mongodb+srv://tester:tester123@cluster0.hkv0v.mongodb.net/'
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'Database1' ).collection( 'Collection1' )
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
    // get array and pass to res.json
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})



app.post( '/add', bodyparser.json(), (req,res) => {
  collection.updateOne({'username': theusername}, { $push: {'entries':req.body}})
    .then(insertResponse => { 
      collection.findOne({'username': theusername})
      .then(foundResponse => {
        res.json(foundResponse.entries)
      })
    }) 
})

app.post( '/deletefunct', bodyparser.json(), (req,res) => {
  collection.updateOne({'username': theusername}, { $pull: {'entries':req.body}})
    .then(insertResponse => { 
      collection.findOne({'username': theusername})
      .then(foundResponse => {
        res.json(foundResponse.entries)
      })
    }) 
})


//LOG-IN
// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['thekey1', 'thekey2']
}))

app.post( '/login', (req,res)=> {

  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body )
  
  collection.findOne({"username": req.body.username})
  .then(findResponse => {
    //if there isnt this username add it
    if (findResponse === null){
      collection.insertOne({"username":req.body.username,"password":req.body.password,"entries":[]})
      
      // define a variable that we can check in other middleware
      // the session object is added to our requests by the cookie-session middleware
      req.session.login = true
      theusername = req.body.username
      // since login was successful, send the user to the main content
      // use redirect to avoid authentication problems when refreshing
      // the page or using the back button, for details see:
      // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern
      res.redirect( 'index.html' )
    } 
    //check username and password match
    else {
      if(req.body.password === findResponse.password) {
        req.session.login = true
        theusername = req.body.username
        res.redirect( 'index.html' )
      } else {
        // password incorrect, redirect back to login page
        res.sendFile( __dirname + '/public/login.html' )
      }
    }
  })
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/login.html' )
})




// serve up static files in the directory public
app.use( express.static('public') )
app.listen(process.env.PORT || 3000)

