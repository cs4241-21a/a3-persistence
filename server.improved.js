//require('dotenv').config()
const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      cookie = require('cookie-session'),
      app = express(),
      bodyParser = require('body-parser'),
      slash   = require('express-slash')
      favicon = require('serve-favicon'),
      path = require('path')
      fs = require('fs')
      morgan = require('morgan')

  require('dotenv').config()

app.use( express.static('public') )
app.use( express.json() )
app.use(express.urlencoded({extended:true}))
app.use(favicon(path.join(__dirname, 'public', 'images/bmi.png')))

var newid = 0
var currentid = 0
const uri = 'mongodb+srv://test:test123@cluster0.0qmyh.mongodb.net/'

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

// serve up static files in the directory public
app.use( express.static('public') )
app.enable('strict routing')

var router = express.Router({
  caseSensitive: app.get('case sensitive routing'),
  strict       : app.get('strict routing')
})

app.use(router)
app.use(slash())

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))


client.connect()
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
  .then( console.log )
  
app.use(cookie({
  name: 'session',
  keys: ['a', 'b']
}))

// app.post('/createUser', (req, res) => {
//   collection.insertOne(req.body).then(result => res.json(result))
// })


app.post('/login', (req,res)=>{
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body )

  // else{
  //   fetch('/createUser', {
  //     method:'POST',
  //     body: JSON.stringify(req.body),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   .then(response => response.json())
  // }
  
  
  // below is *just a simple authentication example* 
  // for A3, you should check username / password combos in your database
  if(collection !== null){
    collection.find({username: req.body.username}).toArray()
    .then(result => {
      if(result.length === 0){
        collection.insertOne(req.body)
        const query = {'username': req.body.username}
        const update = {
        "$push": {
        "userid": newid
         }
        }
        const options = {"upsert": false}
         collection.updateOne(query, update, options)
        currentid = newid
        req.session.login = true
        //window.alert('New account created')
        res.redirect( 'bmicalculator.html' )

      }
      else{
        if(req.body.password === result[0].password){
          req.session.login = true
          currentid = result[0].userid[0]
          res.redirect( 'bmicalculator.html' )
        }
        else{
          req.session.login = false
          res.sendFile( __dirname + '/public/index.html' )
          
          currentid = result[0].userid[0]
        }
      }
    })
    //.catch(err => console.log(err))
  }
  /* if( req.body.password ===  'test') {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true
    
    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    res.redirect( 'bmicalculator.html' )
  }else{
    // password incorrect, redirect back to login page
    res.sendFile( __dirname + '/public/index.html' )
  } */
  newid++
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/index.html' )
})

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

// route to get all docs
app.post( '/entries', bodyParser.json(), (req,res) => {
  if( collection !== null ) {
    // get array and pass to res.json
    collection.find({"docid": currentid}).toArray().then( result => res.json( result ) )
  }
})

app.post( '/add', (req,res) => {
  // assumes only one object to insert
  collection.insertOne( req.body ).then( 
    result => {
    const query = req.body
    const update = {
      "$push": {
        "docid": currentid
      }
    }
    const options = {"upsert": false}
    collection.updateOne(query, update, options)
    res.json( result )
  })
  
})

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post( '/remove', (req,res) => {
  collection
    .deleteOne({ _id:mongodb.ObjectId( req.body._id ) })
    .then( result => res.json( result ) )
})

app.post( '/update', (req,res) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectId( req.body._id ) },
      { $set:{ docid: currentid, yourname:req.body.yourname, feet: req.body.feet, inches: req.body.inches, weight: req.body.weight, bmi: req.body.bmi, status: req.body.status} 
    }
    )
    .then( result => res.json( result ) )
})
  
app.get('/', function (req, res) {
  res.redirect('/login')
  res.send('hello, world!')
})

router.get('/login', function (req, res) {
  res.redirect('index.html' )
});

router.get('/home', function (req, res) {
  res.redirect('index.html' )
});

app.listen(process.env.PORT || 3000 )
