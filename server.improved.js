const express = require( 'express' ),
      bodyParser   = require( 'body-parser' ),
      app = express(),
      cookie = require('cookie-session'),
      cookieParser = require('cookie-parser'),
      GitHibStrategy = require('passport-github2').Strategy,
      passport = require('passport')

app.use( express.static( 'public' ))

const { response, request } = require('express');
const { cp } = require('fs');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let collection = null;
const uri = "mongodb+srv://tester:tester123@cluster0.upfeg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  collection = client.db("datatest").collection("test");
});

app.use( express.urlencoded({ extended:true }))
app.use(cookieParser())

app.use( cookie({
  name:'session',
  keys:[process.env.KEY1, process.env.KEY2]
}))

passport.serializeUser(function(user, done){
  done(null, user)
})

passport.deserializeUser(function(user, done){
  done(null, user)
})

passport.use( new GitHubStrategy({
  clientID: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: "http://127.0.0.1:3000/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile)
}
))

app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/error', (request, response) => response.send("Unknown Error"))
app.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/error'}),
function(request, response) {
  response.redirect('/response?id=' + request.user.id)
})

app.get('/response', (request, response) => {
  request.session.id = request.query.id
  response.redirect("main.html")
})

app.get('/', (request,response) => {
  response.sendFile( 'public/index.html' )
})

app.post('/login', (request, response) => {
  const user = {'username': request.body.username, 'password': request.body.password}
  collection.findOne(user)
  .then(user => {
    response.cookie('login', true)
    response.cookie('userid', user._id)
    response.cookie('username', user.username)
    response.redirect( 'public/main.html')
  })
})

app.get('/logout', (request, response) => {
  response.cookie('login', false)
  response.cookie('userid', "")
  response.cookie('username', "")
  response.sendFile( 'public/index.html' )
})

app.get('/getData', (request, response) => {
  if(collection != null) {
    collection.find({ }).toArray().then( result => { response.json( result )})
  }
})

app.post('/submit', bodyParser.json(), (request, response) => {
  if(collection != null) {
    collection.insertOne(request.body)
  .then( result => {
     response.json(result)})}
})

app.post('/delete', bodyParser.json(), (request, response) => {
  if(collection != null) {
    collection.deleteOne({ _id: mongodb.ObjectId(request.body.id) })
  .then( insert => {
   console.log(insert)
     response.json(insert)})}
})

app.post('/update', bodyParser.json(), (request, response) => {
  if(collection != null) {
    collection.updateOne({ _id: mongodb.ObjectId(request.body.id) },
    {$set:{ name:request.body.name,
    element:request.body.element,
  level:request.body.level}})
  .then( insert => {
   console.log(insert)
     response.json(insert)})}
})


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

app.listen( process.env.PORT || 3000 )
