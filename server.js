const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      path = require('path'),
      cookie  = require( 'cookie-session' ),
      app = express()
      

app.use(express.static('public')) // middleware allow access to files in public
app.use(express.json()) // middleware that handles JSON data
app.use( express.urlencoded({ extended:true }) ) // use express.urlencoded to get data sent by defaut form actions
app.use( cookie({
  name: 'session',
  keys: ['kumar1', 'kumar2']
})) // cookie middleware

// Setup for mongodb

const uri = "mongodb+srv://akumar6:test1234@cluster0.hcqic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let creds_collection = null;

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db('credentials').collection('creds')
  })
  .then( __collection => {
    creds_collection = __collection;
    return  __collection.find({ }).toArray()
  })

/*
// route to get all docs
app.get( '/data', (req,res) => {
  if( collection !== null ) {
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})
*/

// ------------------------------- Requests for index.html ----------------------------------

// Landing page should be login page
app.get( '/login', (req,res)=> {
  res.sendFile(__dirname + '/public/views/index.html');
})

// main domain redirects to login page
app.get( '/', (req,res)=> {
  res.redirect('/login')
})

// Once logged in, go to main page
app.get( '/main', (req,res) => {
  // use cookies to ensure users cannot bypass login
  if( req.session.login === true ) {
    console.log(`${req.session.user} has logged in successfully`);
    res.sendFile(__dirname + '/public/views/main.html');
  }
  else {
    req.session.login = false;
    res.redirect('login');
  }
})

// Login POST request
app.post( '/login', (req,res)=> {
  creds_collection.find({ }).toArray().then( creds => {
    // validate correct credentials
    let valid = creds.some(cred => cred.username === req.body.username && cred.password === req.body.password);
    if(valid) {
      req.session.login = true;
      req.session.user = req.body.username;
      res.redirect( '/main' )
    }else{
      // password incorrect, redirect back to login page
      req.session.login = false
      res.sendFile( __dirname + '/public/views/index_failed.html' )
    }
  })
})

// Signup POST request
app.post('/signup', (req,res) => {
  creds_collection.insertOne( req.body )
    .then( function() {
      req.session.login = true;
      req.session.user = req.body.username;
      res.redirect('/main')
    })
})

// Remember POST request (for forgotten passwords)
app.post('/remember', (req,res) => {
  creds_collection.find({ }).toArray().then( creds => {
    // assume 
    let password = "";
    let found = false;
    // look for user object with matching username
    let account = creds.find(cred => {
      return cred.username === req.body.username
    })
    // account will either be undefined or object
    if(account) {
      password = account.password;
      found = true;
    }
    res.json({"found":found, "password": password})
  })
})

// -------------------- Request on main.html -----------------------------------
let data_collection = null;

// add POST request
app.post( '/add', (req,res) => {
  // assumes only one object to insert
  data_collection.insertOne(req.body)
    .then( insertResponse => data_collection.findOne(insertResponse.insertedId)) 
    .then( findResponse   => res.json(findResponse))
})

// delete POST request
app.post( '/delete', (req,res) => {
  // delete by id
  data_collection.deleteOne({"_id": mongodb.ObjectId(req.body._id)})
    .then( deleteResponse  => res.json(deleteResponse))
})

/*
app.post('/edit'), (req,res) => {
  //edit by id
  collection.updateOne(
      { _id:mongodb.ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
    )
    .then( result => res.json( result ) )
}
*/

// update GET request --> get latest info from database
app.get('/update', (req, res) => {
  client.connect()
  .then( () => {
    return client.db('userdata').collection(req.session.user)
  })
  .then( __collection => {
    data_collection = __collection;
    return  __collection.find({ }).toArray()
  })
  .then(result => res.json(result))
})

// logout POST request
app.post('/logout', (req,res) => {
  console.log(`${req.session.user} has logged out`);
  req.session.login = false;
  res.redirect('/login');
})

// run on given port
app.listen( 3000 )
