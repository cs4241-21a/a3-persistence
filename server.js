// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv =  require('dotenv');
// importing routes
const authRoute = require('./routes/authO');
const cookie  = require( 'cookie-session' );
// const JWT = require('jsonwebtoken');
const userNameOfU = '';

// make all the files in 'views' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("views"));
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
dotenv.config();

//Connecting to db
mongoose.connect(
  process.env.DB_CON,
  () => console.log('succefully connected to db!')
);

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )
authRoute.use( express.urlencoded({ extended:true }) )
authRoute.use(express.static('./'))

//Middleware
app.use(express.json());
var bodyParser = require('body-parser')




// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'sessionLog',
  sameSite: "none",
  keys: ['123', '456']
}))

//Route Middleware
app.use('/api/user', authRoute);


// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/views/index.html' )
})

// // send the default array of dreams to the webpage
// app.get("/dreams", (request, response) => {
//   // express helps us take JS objects and send them as JSON
//   response.json(dreams);
// });



// listen for requests :)
app.listen(process.env.port || 3000)

