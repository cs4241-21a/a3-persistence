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
 * Express Template
 */
var express = require( 'express' ),
    mongodb = require('mongodb')
var app = express()

app.use( express.static('public') )
app.use( express.json() )
app.use( function( req, res, next ) {
  console.log( 'url:', req.url )
  next()
})

//////////

const { MongoClient } = require('mongodb');
const fs = require('fs');

// const filePath = path.join(__dirname, 'mongoAccess.pem')
// const credentials = fs.readFileSync(filePath, 'utf-8');
const credentials = "./mongoAccess.pem"

const client = new MongoClient('mongodb+srv://liadaviscs4241a3.pt3ux.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  sslKey: credentials,
  sslCert: credentials
});

let collection = null

async function run() {
  try {
    await client.connect();
    const database = client.db("sample_airbnb");
    collection = database.collection("listingsAndReviews");
    const docCount = await collection.countDocuments({});
    console.log(docCount);
    // perform actions using client
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);


//////////

// const uri = 'mongodb+srv://tester:tester123@cluster0.f9zkh.mongodb.net/'
// const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
//
//
// client.connect()
//     .then( () => {
//       // will only create collection if it doesn't exist
//       return client.db( 'datatest' ).collection( 'test' )
//     })
//     .then( __collection => {
//       // store reference to collection
//       collection = __collection
//       // blank query returns all documents
//       return collection.find({ }).toArray()
//     })
//     .then( console.log )

// route to get all docs
app.get( '/', (req,res) => {
  if( collection !== null ) {
    debugger
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})

app.post( '/add', (req,res) => {
  // assumes only one object to insert
  collection.insertOne( req.body ).then( result => res.json( result ) )
})

// app.get( '/', function (req, res) {
//   res.send( 'Hello World!' )
// })

app.listen(3000)



//
// //Code from Class:
//
// // const express = require( 'express' ),
// //     mongodb = require( 'mongodb' ),
// //     app = express()
// //
// // app.use( express.static('public') )
// // app.use( express.json() )
// //
// // // make sure to substitute your username / password for tester:tester123 below!!!
// // const uri = 'mongodb+srv://tester:tester123@cluster0.f9zkh.mongodb.net/'
// //
// // const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
// // let collection = null
// //
// // client.connect()
// //     .then( () => {
// //       // will only create collection if it doesn't exist
// //       return client.db( 'datatest' ).collection( 'test' )
// //     })
// //     .then( __collection => {
// //       // store reference to collection
// //       collection = __collection
// //       // blank query returns all documents
// //       return collection.find({ }).toArray()
// //     })
// //     .then( console.log )
// //
// // // route to get all docs
// // app.get( '/', (req,res) => {
// //   if( collection !== null ) {
// //     debugger
// //     collection.find({ }).toArray().then( result => res.json( result ) )
// //   }
// // })
// //
// // app.post( '/add', (req,res) => {
// //   // assumes only one object to insert
// //   collection.insertOne( req.body ).then( result => res.json( result ) )
// // })
// //
// // app.listen( 3000 )