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





// /**
//  * Main Server Config
//  */
// //Set constants
// const { MongoClient } = require('mongodb');
// const credentials = process.env.CERT_PATH
// const client = new MongoClient(process.env.DB_PATH, {
//     sslKey: credentials,
//     sslCert: credentials
// });
//
// //Set variables
// var express = require( 'express' )
require('dotenv').config()
//
// var app = express()
//

// app.use( express.json() )
// app.use( function( req, res, next ) {
//   console.log( 'url:', req.url )
//   next()
// })
//
//
//
// /**
//  * getAllData()
//  * Test to get all data
//  * @param req
//  * @param res
//  * @returns {Promise<void>}
//  */
// async function getAllData(req, res) {
//   try {
//     console.log("Connecting from client")
//     await client.connect();
//     console.log("Connected. Getting DB")
//     const database = client.db("testForMe");
//     console.log("Got DB. Getting collection")
//     let collection2 = database.collection("PleaseWork");
//     console.log("Got collection. Getting all docs")
//     const result = await collection2.find({}).toArray()
//     console.log("Got all docs. Logging results:")
//     console.log(result)
//     console.log("Returning results to web client")
//     res.json(result)
//   } catch (err){
//     res.send("Error Happened")
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
//
// /**
//  * Application Routes
//  */
//
// // route to get all docs
// app.get( '/docs', (req,res) => {
//   getAllData(req, res).then(r => {
//       console.log(r)
//       res.send(r)
//   })
// })
//
// app.post( '/add', (req,res) => {
//   // assumes only one object to insert
//   collection.insertOne( req.body ).then( result => res.json( result ) )
// })
//
// app.get('/log', function (req, res){
//   console.log("Hello server")
//   res.send("Log posted")
// })
//
// app.get( '/', function (req, res) {
//   res.send( 'Hello World!' )
// })
//
// /**
//  * Set app to listen to port
//  */
// app.listen(3000)


/**
 * Copyright (c) Microsoft Corporation
 *  All Rights Reserved
 *  MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the 'Software'), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
 * OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

/******************************************************************************
 * Module dependencies.
 *****************************************************************************/

var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var bunyan = require('bunyan');
var morgan = require('morgan');

var config = require('./config');

// set up database for express session
var MongoStore = require('connect-mongo')(expressSession);
var mongoose = require('mongoose');
const fs = require("fs"),
    mime = require( 'mime' );

// Start QuickStart here

var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

var log = bunyan.createLogger({
  name: 'Microsoft OIDC Example Web Application'
});

/******************************************************************************
 * Set up passport in the app
 ******************************************************************************/

//-----------------------------------------------------------------------------
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session.  Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
//-----------------------------------------------------------------------------
passport.serializeUser(function(user, done) {
  done(null, user.oid);
});

passport.deserializeUser(function(oid, done) {
  findByOid(oid, function (err, user) {
    done(err, user);
  });
});

// array to hold logged in users
var users = [];

var findByOid = function(oid, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    log.info('we are using user: ', user);
    if (user.oid === oid) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

//-----------------------------------------------------------------------------
// Use the OIDCStrategy within Passport.
//
// Strategies in passport require a `verify` function, which accepts credentials
// (in this case, the `oid` claim in id_token), and invoke a callback to find
// the corresponding user object.
//
// The following are the accepted prototypes for the `verify` function
// (1) function(iss, sub, done)
// (2) function(iss, sub, profile, done)
// (3) function(iss, sub, profile, access_token, refresh_token, done)
// (4) function(iss, sub, profile, access_token, refresh_token, params, done)
// (5) function(iss, sub, profile, jwtClaims, access_token, refresh_token, params, done)
// (6) prototype (1)-(5) with an additional `req` parameter as the first parameter
//
// To do prototype (6), passReqToCallback must be set to true in the config.
//-----------------------------------------------------------------------------
passport.use(new OIDCStrategy({
      identityMetadata: config.creds.identityMetadata,
      clientID: config.creds.clientID,
      responseType: config.creds.responseType,
      responseMode: config.creds.responseMode,
      redirectUrl: config.creds.redirectUrl,
      allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
      clientSecret: config.creds.clientSecret,
      validateIssuer: config.creds.validateIssuer,
      isB2C: config.creds.isB2C,
      issuer: config.creds.issuer,
      passReqToCallback: config.creds.passReqToCallback,
      scope: config.creds.scope,
      loggingLevel: config.creds.loggingLevel,
      nonceLifetime: config.creds.nonceLifetime,
      nonceMaxAmount: config.creds.nonceMaxAmount,
      useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
      cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
      clockSkew: config.creds.clockSkew,
    },
    function(iss, sub, profile, accessToken, refreshToken, done) {
      if (!profile.oid) {
        return done(new Error("No oid found"), null);
      }
      // asynchronous verification, for effect...
      process.nextTick(function () {
        findByOid(profile.oid, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            // "Auto-registration"
            users.push(profile); //TODO: Add database commit here?
            return done(null, profile);
          }
          return done(null, user);
        });
      });
    }
));


/**-----------------------------------------------------------------------------
// Config the app, include middlewares
//-----------------------------------------------------------------------------*/
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(cookieParser());


const credentials = process.env.CERT_PATH
var options = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
};

options.server.ssl = true;
options.server.sslCert = fs.readFileSync(credentials);
options.server.sslKey = fs.readFileSync(credentials);
options.server.sslCA = fs.readFileSync(credentials);
options.server.sslValidate = false;

// set up session middleware
if (config.useMongoDBSessionStore) {
  mongoose.connect(config.databaseUri, options);
  app.use(expressSession({ //TODO: Extrapolate cookie usage
    secret: 'secret',
    cookie: {maxAge: config.mongoDBSessionMaxAge * 1000},
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      clear_interval: config.mongoDBSessionMaxAge
    })
  }));
} else {
  app.use(expressSession({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: false }));
}

app.use(express.urlencoded({ extended : true }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use( express.static('public') )

/**-----------------------------------------------------------------------------
// Set up the route controller
//
// 1. For 'login' route and 'returnURL' route, use `passport.authenticate`.
// This way the passport middleware can redirect the user to login page, receive
// id_token etc from returnURL.
//
// 2. For the routes you want to check if user is already logged in, use
// `ensureAuthenticated`. It checks if there is an user stored in session, if not
// it will call `passport.authenticate` to ask for user to log in.
//-----------------------------------------------------------------------------*/
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

function sendMessages(response) {
    response.writeHead(200, "OK", {'Content-Type': 'text/plain'})
    response.end(JSON.stringify(appdata))
}

app.get('/', function(req, res) {
    console.log("REQ.USER::::::::::::::", req.user)
  res.render('index', { user: req.user });
});

// '/account' is only available to logged in user
app.get('/account', ensureAuthenticated, function(req, res) {
  console.log(req.user);
  res.render('account', { user: req.user });
});

app.get('/messages', ensureAuthenticated, function (req, res){
    sendMessages(res)
})

app.get('/login',
    function(req, res, next) {
      passport.authenticate('azuread-openidconnect',
          {
            response: res,                      // required
            resourceURL: config.resourceURL,    // optional. Provide a value if you want to specify the resource.
            customState: 'my_state',            // optional. Provide a value if you want to provide custom state value.
            failureRedirect: '/'
          }
      )(req, res, next);
    },
    function(req, res) {
      log.info('Login was called');
      res.redirect('/');
    });

// 'GET returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// query (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
app.get('/auth/openid/return',
    function(req, res, next) {
      passport.authenticate('azuread-openidconnect',
          {
            response: res,    // required
            failureRedirect: '/'
          }
      )(req, res, next);
    },
    function(req, res) {
      log.info('We received a return from AzureAD.');
      res.redirect('/');
    });

// 'POST returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// body (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
app.post('/auth/openid/return',
    function(req, res, next) {
      passport.authenticate('azuread-openidconnect',
          {
            response: res,    // required
            failureRedirect: '/'
          }
      )(req, res, next);
    },
    function(req, res) {
      log.info('We received a return from AzureAD.');
      res.redirect('/');
    });

app.post('/submit'), function (req, res, next) {
    const json = JSON.parse( dataString )
    console.log("Received datastring to /submit: " + dataString)

    //Derived field
    json.message = json.name + " says \"" + json.message + "\""

    appdata.push(json)

    res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    res.end(JSON.stringify(appdata))
}

// 'logout' route, logout from passport, and destroy the session with AAD.
app.get('/logout', function(req, res){
  req.session.destroy(function(err) {
    req.logOut();
    res.redirect(config.destroySessionUrl);
  });
});


/**
 * sendFile
 *
 * Sends the requested file back to the client, if the file exists. If not, it returns 404
 * @param response
 * @param filename
 */
const sendFile = function( response, filename ) {
    const type = mime.getType( filename )

    fs.readFile( filename, function( err, content ) {

        // if the error = null, then we've loaded the file successfully
        if( err === null ) {

            // status code: https://httpstatuses.com
            response.writeHeader( 200, { 'Content-Type': type })
            response.end( content )

        }else{

            // file not found, error code 404
            response.writeHeader( 404 )
            response.end( '404 Error: File Not Found' )

        }
    })
}

app.listen(3000);

