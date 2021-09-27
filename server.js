// server.js
// where your node app starts

const cookieSession = require('cookie-session');

require('dotenv').config()

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
// const express = require("express");
// const app = express();
const express    = require('express'),
      cookie  = require( 'cookie-session' ),
      mongodb = require( 'mongodb' ),
      refleftmd = require( 'reflect-metadata' ),
      bodyparser = require( 'body-parser' ),
      app        = express(),
      port = 3000,
      mime = require( 'mime' )
      // dreams     = []

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

var userData = new Map();

var appdata = []

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// get json when appropriate
app.use( express.json() )

// const uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST

// const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
// let collection = null

// client.connect()
//   .then( () => {
//     // will only create collection if it doesn't exist
//     return client.db( 'RateYourBooks' ).collection( 'Books' )
//   })
//   .then( __collection => {
//     // store reference to collection
//     collection = __collection
//     // blank query returns all documents
//     return collection.find({ }).toArray()
//   })
//   .then( console.log )

// app.use( (req,res,next) => {
//   if( collection !== null ) {
//     next()
//   }else{
//     res.status( 503 ).send()
//   }
// })

// app.post( '/add', (req,res) => {
//   // assumes only one object to insert
//   collection.insertOne( req.body ).then( result => res.json( result ) )
// })

// // assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
// app.post( '/remove', (req,res) => {
//   collection
//     .deleteOne({ _id:mongodb.ObjectId( req.body._id ) })
//     .then( result => res.json( result ) )
// })

// app.post( '/update', (req,res) => {
//   collection
//     .updateOne(
//       { _id:mongodb.ObjectId( req.body._id ) },
//       { $set:{ name:req.body.name } }
//     )
//     .then( result => res.json( result ) )
// })

//For cookies

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.post( '/login', (req,res)=> {
  // express.urlencoded()
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body );
  console.log(req.body.username);
  console.log(req.body.password);

  //user already exists
  if(userData.has(req.body.username) && (userData.get(req.body.username) === req.body.password)){
    req.session.login = true;
    res.sendFile( __dirname + '/views/index.html' );
  } else if(!(userData.has(req.body.username))){ // new user
    userData.set(req.body.username, req.body.password);
    req.session.login = true;
    res.sendFile( __dirname + '/views/index.html' );
  } else{
    // password incorrect, redirect back to login page
    res.sendFile( __dirname + '/views/login.html' )
  }
  // below is *just a simple authentication example* 
  // for A3, you should check username / password combos in your database
  // else if( req.body.password === 'test' ) {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    // req.session.login = true
    
    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    // res.redirect( '/views/index.html' )
  // else{
  //   // password incorrect, redirect back to login page
  //   res.sendFile( __dirname + '/views/login.html' )
  // }
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/views/login.html' )
})

// serve up static files in the directory public
app.use( express.static('public') )

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get("/index", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// app.post( '/submit', bodyparser.json(), function( request, response ) {
//   console.log("In /submit");
//   dreams.push( request.body.newdream )
//   response.writeHead( 200, { 'Content-Type': 'application/json'})
//   response.end( JSON.stringify( dreams ) )
// })

app.post( '/submit-book', bodyparser.json(), function( request, response ) {
  console.log(`submit-book post request: ${request}`);
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const json = JSON.parse( dataString )
    appdata.push(json)
    appdata.sort(function ( a, b ) {
      if ( a.rating < b.rating ){
        return 1;
      }
      if ( a.rating > b.rating ){
        return -1;
      }
      if( a.year < b.year){
        return 1;
      }
      if ( a.year > b.year){
        return -1;
      }
      return 0;
    })
    for(var i = 0; i < appdata.length; i++){
      appdata[i].rank = i+1
    }

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  })
})

app.post( '/delete-book', bodyparser.json(), function( request, response ) {
  console.log(`delete-book post request: ${request}`);
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const json = JSON.parse( dataString )
    console.log('app data in delete-book1:')
    console.log(appdata)
    appdata.splice(json.delete-1, 1)
    for(var i = 0; i < appdata.length; i++){
      appdata[i].rank = i+1
    }
    console.log('app data in delete-book2:')
    console.log(appdata)
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  })
})

// send the default array of books to the webpage
app.get("/books", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(appdata);
});

// listen for requests :)
const listener = app.listen(process.env.PORT || port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
