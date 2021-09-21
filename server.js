const { count } = require('console')

const http = require( 'http' ),
      cookie  = require( 'cookie-session' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const {user, pass} = require('./env.js')
const express = require('express');
const app = express();
const mongodb = require('mongodb');
const bodyparser = require('body-parser');

app.use(express.static("public"));
app.use(express.json());

app.use( express.urlencoded({ extended:true }) )



app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
})

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

const MongoClient = mongodb.MongoClient;
const uri =`mongodb+srv://${user}:${pass}@cluster0.kt8ex.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });
let collection = null

client.connect()
.then(() => {
  return client.db('data').collection('data')
})
.then(_collection => {
  collection = _collection
  return collection.find({ }).toArray()
})
//.then(console.log)


app.post( '/login', function(req,res) {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body )
  
  // below is *just a simple authentication example* 
  // for A3, you should check username / password combos in your database
  if( req.body.password === 'test' ) {
    // define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    req.session.login = true

    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    // make redirect
    res.sendFile( __dirname + '/views/index.html' )
  }else{
    // password incorrect, redirect back to login page
    res.sendFile( __dirname + '/views/login.html' )
  }
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/views/login.html' )
})

app.post('/submit', bodyparser.json(),function(req, res){
 // console.log('aaaaaaa', req.body)
  collection.insertOne(req.body)
  .then(dbresponse => {
    return collection.find({'_id':dbresponse.insertedId}).toArray()
  })
    .then(dbresponse =>{
    res.json(dbresponse)
    console.log(dbresponse)
  })
})

app.post('/loadTable', bodyparser.json(),function(req, res){
  collection.find({}).toArray()
  .then(dbresponse =>{
  res.json(dbresponse)
  console.log(dbresponse)
  })
})


/*

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'views/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  console.log(request.url)
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    dataString = JSON.parse( dataString )
    console.log( dataString )

    appdata.push(dataString)

    for(let count = 0; count < appdata.length; count++){
      
      if(appdata[count].day === 'Sunday'){
        appdata[count].difficulty = appdata[count].priority * 5
      }
      else if(appdata[count].day === 'Monday'){
        appdata[count].difficulty = appdata[count].priority * 10
      }
      else if(appdata[count].day === 'Tuesday'){
        appdata[count].difficulty = appdata[count].priority * 7
      }
      else if(appdata[count].day === 'Wednesday'){
        appdata[count].difficulty = appdata[count].priority * 6
      }
      else if(appdata[count].day === 'Thursday'){
        appdata[count].difficulty = appdata[count].priority * 10
      }
      else if(appdata[count].day === 'Friday'){
        appdata[count].difficulty = appdata[count].priority * 6
      }
      else if(appdata[count].day === 'Saturday'){
        appdata[count].difficulty = appdata[count].priority * 5
      }
    }

  console.log(appdata)

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.write(JSON.stringify(appdata))
    response.end()
  })
}
*/

const sendFile = function( response, filename ) {
   //const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       // response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}
app.listen(3000)
//server.listen( process.env.PORT || port )
