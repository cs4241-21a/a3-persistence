// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
//
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//
// var app = express();
//
// //Middleware
// //serve-favicon, helmet, compression, json, and static are a good starting list of 5
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;
//

/**
 * This Works
 */

// console.log("Starting Server")
// const express = require( 'express' ),
//     mongodb = require( 'mongodb' ),
//     app = express()
//
// app.use( express.static('public') )
// app.use( express.json() )
//
// const uri = process.env.PASS_PATH //'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
//
// console.log("Creating DB Client")
// const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
// let collection = null
//
// console.log("Connection to DB")
// client.connect()
//     .then( () => {
//       // will only create collection if it doesn't exist
//       return client.db( 'testForMe' ).collection( 'PleaseWork' )
//     })
//     .then( __collection => {
//       // store reference to collection
//       collection = __collection
//       // blank query returns all documents
//       return collection.find({ }).toArray()
//     })
//     .then( console.log )
//
// // route to get all docs
// app.get( '/', (req,res) => {
//     console.log("Homepage was requested")
//   if( collection !== null ) {
//     // get array and pass to res.json
//     collection.find({ }).toArray().then( result => res.json( result ) )
//   }else {
//       res.send("Broken I guess")
//   }
// })
//
// app.listen(3000)


/**
 * Main Server Config
 */
//Set constants
const { MongoClient } = require('mongodb');
const credentials = process.env.CERT_PATH
const client = new MongoClient(process.env.DB_PATH, {
    sslKey: credentials,
    sslCert: credentials
});

//Set variables
var express = require( 'express' )
require('dotenv').config()

var app = express()

app.use( express.static('public') )
app.use( express.json() )
app.use( function( req, res, next ) {
  console.log( 'url:', req.url )
  next()
})



/**
 * getAllData()
 * Test to get all data
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function getAllData(req, res) {
  try {
    console.log("Connecting from client")
    await client.connect();
    console.log("Connected. Getting DB")
    const database = client.db("testForMe");
    console.log("Got DB. Getting collection")
    let collection2 = database.collection("PleaseWork");
    console.log("Got collection. Getting all docs")
    const result = await collection2.find({}).toArray()
    console.log("Got all docs. Logging results:")
    console.log(result)
    console.log("Returning results to web client")
    res.json(result)
  } catch (err){
    res.send("Error Happened")
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

/**
 * Application Routes
 */

// route to get all docs
app.get( '/docs', (req,res) => {
  getAllData(req, res).then(r => {
      console.log(r)
      res.send(r)
  })
})

app.post( '/add', (req,res) => {
  // assumes only one object to insert
  collection.insertOne( req.body ).then( result => res.json( result ) )
})

app.get('/log', function (req, res){
  console.log("Hello server")
  res.send("Log posted")
})

app.get( '/', function (req, res) {
  res.send( 'Hello World!' )
})

/**
 * Set app to listen to port
 */
app.listen(3000)