// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const mongodb = require( 'mongodb' );
const cookie = require( 'cookie-session' );
const timeout = require('connect-timeout');
const morgan = require('morgan');

const app = express();

app.use( express.static('public') )
app.use( express.json() )


app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

const uri = 'mongodb+srv://newuser12:newuser12@cluster0.kwfpd.mongodb.net/'

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null


client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'A3Database' ).collection( 'A3Collection' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )


app.get("/", (request, response, next) => {
  response.sendFile(__dirname + "/views/index.html");
});

  
//route to get all docs
app.get( '/userdata', (req,res) => {
  if( collection !== null ) {
    // get array and pass to res.json
    collection.find({}).toArray().then( result => res.json( result ) )
  }
  console.log("userdata")
})

//Logs in, if invalid then creates a new account
app.post( '/login', (req,res) => {
  if( collection !== null ) {
    
    console.log("login")

    
    const user = req.body.username;
    const pass = req.body.password;
    console.log(user)
    console.log(pass)
    
    let login = 0
        
    collection.find({}).toArray()
    .then((data) => {
      data.forEach((item) => {
        if (item.username === user && item.password === pass) {
          req.session.login = true
          login = 1
          console.log("logged in")
          collection.find({'username':user}).toArray().then( result => res.json(result ) )
        }
      });
    })
    .then((data2) => {
          console.log(login)
          if(login == 0){
                collection.insertOne( req.body ).then( result => res.json( result ) )
          }
    })
    

    
  }
})

app.post( '/add', (req,res) => {
  // assumes only one object to insert
  console.log("post")
  console.log(req.body)
  collection.insertOne( req.body ).then( result => res.json( result ) )
  .then(result => {
    
    console.log("add")

  })
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
