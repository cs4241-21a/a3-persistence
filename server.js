// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express"),
 app = express(),
 bodyparser = require('body-parser'),
 cookie = require('cookie-session')


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://dbUser:${process.env.DBPASSWORD}@cluster0.brsyg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let collection = null
client.connect(err => {
  collection = client.db("database").collection("entries");
});

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/add', bodyparser.json(), function(req,res) {
  // assumes only one object to insert
    console.log('body', req.body)
    collection.insertOne( req.body )
      .then(  dbresponse => { 
      console.log( dbresponse)
      res.json(dbresponse.ops[0])
})
})

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.post( '/login', (req,res)=> {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body )
  
  // below is *just a simple authentication example* 
  // for A3, you should check username / password combos in your database
  if( req.body.password === 'test' ) {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true
      console.log( "hey" )
    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    res.redirect( '/views/index.html' )
  }else{
    // password incorrect, redirect back to login page
    res.sendFile( __dirname + '/views/login.html' )
  }
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
    if(req.url.includes('.html') || req.url === '/') {
        if (req.session.login === true) {
            next()
        } else {
            res.sendFile(__dirname + '/views/index.html')
        }
    }
    else {
        next()
    }
})






// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/delete', bodyparser.json(), function(req,res) {
  collection
    .deleteOne({ _id:mongodb.ObjectId( req.body.id ) })
    .then( result => res.json( result ) )
})

/*
app.post( '/update', (req,res) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
    )
    .then( result => res.json( result ) )
})

*/


