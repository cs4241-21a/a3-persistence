const port = 3001
let express = require('express');
let bodyParser = require('body-parser');
let cookie_parser=require('cookie-parser')
let cookie  = require( 'cookie-session' )
let app = express();
app.use(cookie_parser('1234'))
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))
let currUser = null;
let currPass = null;
app.use( express.static('public') )
app.use( express.json() )
app.use( express.urlencoded({ extended:true }) )
const appdata = []
let playerCount = 0;
const { MongoClient } = require('mongodb');
const mongodb = require("mongodb");
const uri = "mongodb+srv://uginghostdragon:hotwheels73@cluster0.cdzfh.mongodb.net/testing?retryWrites=true&w=majority";

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
    .then( () => {
      // will only create collection if it doesn't exist
      return client.db( 'testing' ).collection( 'testval' )
    })
    .then( __collection => {
      // store reference to collection
      collection = __collection
      // blank query returns all documents
      return collection.find({ }).toArray()
    })

app.get( '/', (req,res) => {
  if( collection !== null ) {
    debugger
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})
app.post('/signup', (req, res) => {
  res.redirect('signup.html');
})
app.post( '/login', async (req, res) => {
  let data = req.body;
  currUser = data.username;
  let test1 = await collection.findOne({"username": currUser});
  if(currUser === null){
    res.redirect('failedlogin.html');
  }
  if (data.password === test1.password) {
    req.session.login = true
    res.redirect('main.html');
  } else {
    res.redirect('failedlogin.html');
  }
})
app.post( '/add', (req,res) => {
  // assumes only one object to insert
  collection.insertOne( req.body ).then( result => res.json( result ) )
})
app.post('/display', async (req, res) => {
  let test1 = await collection.findOne({"username": currUser});
  res.end(JSON.stringify(test1));
})
app.post('/update' , (req, res) => {
  let dataString = ''

  req.on( 'data', function( data ) {
    dataString += data
  })

  req.on( 'end', async function () {
    let data = JSON.parse(dataString);
    let test1 = await collection.findOne({"username": currUser});
    console.log(test1);
    console.log(await collection.findOneAndDelete({"username": currUser}));
    data.username = currUser;
    collection.insertOne(data);
    test1 = await collection.findOne({"username": currUser});
    console.log(test1);
    res.writeHead(200, "OK", {'Content-Type': 'application/json'})
    res.end(JSON.stringify(test1));
  })
})
app.post('/delete', async (req, res) => {
  req.session.login = false
  currUser = null;
  currPass = null;
  res.redirect('signup.html');
})
app.post('/submit', (req, res)=> {
  let dataString = ''

  req.on('data', function (data) {
    dataString += data
  })
  req.on('end', async function () {
    let data = JSON.parse(dataString);
    playerCount++;
    if (playerCount % 5 === 0) {
      appdata.forEach((element) => {
        element.makeTeam = "Yes"
      });
      data.makeTeam = "Yes"
    } else {
      data.makeTeam = "No"
    }
    collection.insertOne(data);
    appdata.push(data);
    currUser = data.username;
    let test1 = await collection.findOne({"username": currUser});
    req.session.login = true
    res.writeHead(200, "OK", {'Content-Type': 'application/json'})
    res.end(JSON.stringify(test1));
  })
})
app.listen( process.env.PORT || port )