const http = require( 'http' ),
      fs   = require( 'fs' ),
      express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      cookie  = require( 'cookie-session' ),
      app = express(),
      mime = require( 'mime' ),
      dir  = 'public/',
      bodyparser = require( 'body-parser')

app.use( express.static('public') )
app.use( bodyparser.json() )
app.use( express.json() )

const uri = 'mongodb+srv://tester:tester123@cluster0.hkv0v.mongodb.net/'

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'Database1' ).collection( 'Collection1' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )
  
  
// route to get all docs
app.get( '/', (req,res) => {
  if( collection !== null ) {
    // get array and pass to res.json
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})

//a2 info
//let homeworkdata = []

//const server = http.createServer( function( request,response ) {
//  if( request.method === 'GET' ) {
//    handleGet( request, response )    
 // }else if( request.method === 'POST' ){
 //   handlePost( request, response ) 
//  }
//})

/*const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    //console.log( JSON.parse( dataString ) )

    // ... do something with the data here!!!
    let jsonDS = JSON.parse( dataString )
    
    //Calculates days left
    let currentDate = new Date()
    let dueDate = new Date(jsonDS.date)
    jsonDS.calculated = Math.round((dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60* 24)) + 1
    
    //Modify assignments when complete field changed
    modifyCompletion(jsonDS)
    
    jsonDS.homework = homeworkdata;
    
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(jsonDS))
  })
}

function modifyCompletion(theobject) {
  console.log("In modifyCompletion")
  for (let i = 0; i < homeworkdata.length; i++) {
    console.log(homeworkdata[i].yourassignment, theobject.yourassignment)
    if(homeworkdata[i].yourassignment == theobject.yourassignment) {
      console.log("they were equal")
      homeworkdata[i].complete = theobject.complete
      return
    }
  }
  let homework = {
    yourclass: theobject.yourclass,
    yourassignment: theobject.yourassignment,
    complete: theobject.complete,
    date: theobject.date,
    calculated: theobject.calculated
  }
  homeworkdata.push(homework)
}

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
}*/



/*
//cookies info for login
app.post( '/add', (req,res) => {
  // assumes only one object to insert
  collection.insertOne( req.body )
    .then( insertResponse => collection.findOne( insertResponse.insertedId ) ) 
    .then( findResponse   => res.json( findResponse ) )
})


// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.post( '/login', (req,res)=> {
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
    
    // since login was successful, send the user to the main content
    // use redirect to avoid authentication problems when refreshing
    // the page or using the back button, for details see:
    // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
    res.redirect( 'index.html' )
  }else{
    // password incorrect, redirect back to login page
    res.sendFile( __dirname + '/public/login.html' )
  }
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/login.html' )
})
*/

// serve up static files in the directory public
app.use( express.static('public') )
  
app.listen( 3000 )

