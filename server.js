const express = require('express')
const cookie = require('cookie-session')
const app = express()
const path = require('path')
const router = express.Router()
const bodyParser = require("body-parser")
let currentUser
let currentPunt = 0

const publicDirectoryPath = path.join(__dirname, 'public')
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use( express.urlencoded({ extended:true }))
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.post( '/handle', function( request, response ) {
    dreams.push(request.body)
    response.writeHead( 200, { 'Content-Type': 'application/json'})
    response.end( JSON.stringify( dreams ) )
    console.log(dreams)
})

app.post( '/login', async (req,res)=> {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body )
  const existUsername = await collection.findOne({ username: req.body.username});
  let correctPassword = false
  if (existUsername) {
    if (existUsername.password === req.body.password) {
      correctPassword = true
    }
  }
  
  if(existUsername && correctPassword) {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true
    req.session.currentUser = existUsername.username
    console.log(req.session.currentUser)
    //currentUser = existUsername.username
    
    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    res.redirect(301, '/homePage')
    console.log(`Signed in as ${req.session.currentUser}`)
  }else{
    // password incorrect, redirect back to login page
    res.sendFile( __dirname + '/public/index.html' )
    console.log(`failed ${req.body.password}`)
  }
})

app.post('/logout', (req, res) => {
  req.session.login = false
  req.session.currentUser = null
  res.redirect(301, '/loginPage')
  console.log("logged out")
})

app.get('/homePage', (req, res) => {
  if (req.session.login) {
    res.sendFile(__dirname + '/protected/main.html')
  }
  else {
    res.redirect(301, '/loginPage')
  }
})
app.get('/loginPage', (req, res) => res.sendFile(__dirname + '/public/index.html'))

app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/index.html' )
})

// app.use("/", router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');

app.post( '/currentUser', async (request, response) => {
  console.log(request.session.currentUser)
  const existUsername = await collection.findOne({ username: request.session.currentUser });
  if (existUsername) {
    response.status(200).json(existUsername);
  }
  else {
    console.log("current user error")
    response.status(401)
  }
})

/** 
 * MongoDB 
 * */

const mongodb = require('mongodb')
const { addAbortSignal } = require('stream')
const { Console } = require('console')
const { request } = require('http')
const uri = "mongodb+srv://lorendiloreto:SuGTEtUd1y4ePrGZ@a3.xyxng.mongodb.net/a3?retryWrites=true&w=majority"
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db('test').collection('devices')
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/addUser', async (req,res) => {
  // assumes only one object to insert
  // if (collection.find({ username: req.body.username })) {
  //   console.log()
  //   return
  // }
  console.log(`username: ${req.body.username} \npassword: ${req.body.password}`)
  const existUsername = await collection.findOne({ username: req.body.username});
  if (existUsername) {
    console.log('username taken');
    return
  }
  collection.insertOne( req.body ).then( result => {
    req.session.login = true
    req.session.currentUser = req.body.username
    res.redirect(301, '/homePage')
  })
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/remove', (req,res) => {
  collection
    .deleteOne({ username: req.body.username })
    .then( result => res.json( result ) )
})

app.post( '/update', (req,res) => {
  collection
    .updateOne(
      { username: req.session.currentUser },
      { $set:{ 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        organization: req.body.organization,
        password: req.body.password
       }
      }
    )
    .then( result => {
      req.session.currentUser = req.body.username
      res.json( result )
    })
})

app.post( '/delete', (req, res) => {
  collection.deleteOne({ "username": req.session.currentUser })
  res.redirect(301, '/loginPage')
  req.session.login = false
})

app.post( '/addPunt', (req, res) => {
  console.log("adding to database " + req.body)
  
  collection.
    updateOne(
      { username: req.session.currentUser },
      { $push:{ punts: req.body }}
    )
    .then(
      res.end("added to database")
      )
})

app.post( '/getPunt', async (req, res) => {
  currentPunt = req.body.selected
  const existUsername = await collection.findOne({ username: req.session.currentUser})
  if (existUsername) {
    console.log(existUsername.punts[req.body.selected])
    res.json(existUsername.punts[req.body.selected])
  }
})

app.post( '/updatePunt', (req,res) => {
  let n = {}
  n["punts." + currentPunt] = req.body
  collection
    .updateOne(
      { username: req.session.currentUser },
      { $set:
        n
      }
    )
    .then( result => {
      res.json( result )
    })
})

app.post( '/deletePunt', async (req,res) => {
  const existUsername = await collection.findOne({ username: req.session.currentUser})
  existUsername.punts.splice(currentPunt, 1)
  console.log("DELETING")
  collection
    .updateOne(
      { username: req.session.currentUser },
        { $set: {
          punts: existUsername.punts
        } 
      })
      .then( result => {
        res.end("deleted")
      })
})