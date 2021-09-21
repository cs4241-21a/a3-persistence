const express = require('express'),
      mongodb = require('mongodb'),
      serveStatic = require('serve-static'),
      bodyParser = require('body-parser')
      app = express(),
      cookie  = require( 'cookie-session' ),
      dir  = 'public/',
      port = 3000

require('dotenv').config();

const appdata = [{"name":"admin","message":"this is dummy appdata","nameowo":owoify("admin"),"messageowo":owoify("this is dummy appdata")}];
const faces = ["(・`ω´・)",";;w;;","owo","UwU",">w<","^w^","(･.◤)","^̮^","(>人<)","( ﾟヮﾟ)","(▰˘◡˘▰)"]

const uri = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'assignment_3' ).collection( 'appdata' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )


app.use(serveStatic('public'))
app.use( express.urlencoded({ extended:true }) )

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.get('/', function(req, res) {
  res.sendFile(`${__dirname}/public/login.html`)
});

app.post('/login', function(req, res) {
  console.log( req.body )
  
  if( req.body.pass === 'test' ) {
    console.log('test pw')
    req.session.login = true
    res.redirect( `/message_board.html` )
  }else{
    // password incorrect, redirect back to login page
    res.sendFile( __dirname + '/public/login.html' )
  }
});

app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/login.html' )
});

app.get('/getAppdata', function(req, res) {
  console.log("getappdata req")
  res.send(JSON.stringify(appdata))
});

app.post('/submit', bodyParser.json(), function(req, res) {
  let obj = {
    name: req.body.name,
    message: req.body.message,
    nameowo: owoify(req.body.name),
    messageowo: owoify(req.body.message)
  }
  appdata.push(obj);
  res.send(JSON.stringify(obj))
});

function owoify(text) {
  //console.log(text)
  let v = text.replace(/[lr]/g, 'w').replace(/[LR]/g, 'W').replace(/n[aeiou]/g, 'ny').replace(/N[aeiou]/g, 'Ny').replace(/N[AEIOU]/g, 'NY');
  let numExclaimations = (v.match(/!/g)||[]).length;
  for(let i = 0; i < numExclaimations; i++) {
    v = v.replace('!'," " + faces[getRandomInt(0, faces.length)] + " ");
  }
  return v;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

app.listen(process.env.PORT || port)
