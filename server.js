const { count } = require('console')

const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const express = require("express");
const app = express();
const mongodb = require('mongodb');
const bodyparser = require('body-parser');

let appdata = [ 
]

const MongoClient = mongodb.MongoClient;
const uri = 'mongodb+srv://admin:admin@cluster0.kt8ex.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
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
.then(console.log)

app.post('/add', bodyparser.json(),function(req, res){
  console.log('body:', req.body)
  collection.insertOne(req.body)
  .then(dbresponse => {
    return collection.find({'_id':dbresponse.insertedId}).toArray()
  })
  .then(dbresponse =>{
  res.json(dbresponse[0])
  console.log(dbresponse[0])
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

server.listen( process.env.PORT || port )
