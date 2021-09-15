const { Db } = require('mongodb')

require('dotenv').config()
const http = require( 'http' ),
      fs   = require( 'fs' ),
      mongodbclient = require( './services/mongodb-service.js' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const server = http.createServer( function( request,response ) {
  if ( request.method === 'GET' ) {
    handleGet( request, response )    
  } else if ( request.method === 'POST' ) {
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  } else if ( request.url === '/api/lostitems') {
    mongodbclient.getLostItems()
    .then(e => {
      sendData(response, e)
    })
  } else if ( request.url === '/api/founditems') {
    mongodbclient.getFoundItems()
    .then(e => {
      sendData(response, e)
    })
  } else {
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    let data = JSON.parse( dataString )
    if (request.url === '/api/login') {
      handleLogin(data, response)
    } else if (request.url === '/api/create') {
      handleCreate(data, response)
    } else if (request.url === '/api/delete') {
      handleDelete(data, response)
    } else if (request.url === '/api/update') {
      handleEdit(data, response)
    } else {
      response.writeHead( 404, "Invalid API endpoint", {'Content-Type': 'text/plain' })
      response.end()  
    }
  })
}

const login = function ( credentials ) {
  return true;
}

const handleEdit = (data, response) => {
  mongodbclient.update(data)
  .then(e => {
    if (dt === undefined) {
      response.writeHead( 404, "Invalid UID", {'Content-Type': 'text/plain' })
      response.end()  
    } else {
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end()  
    }
  })
}

const handleLogin = (data, response) => {
  if (login(data)) {
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end()    
  } else {
    response.writeHead( 403, "Invalid login", {'Content-Type': 'text/plain' })
    response.end()  
  }
}

const handleCreate = (data, response) => {
  let filtered = {
    'item' : data.item,
    'when' : data.when,
    'where' : data.where,
    'description' : data.description,
    'photo' : data.photo,
    'emailme' : data.emailme,
    'timestamp' : Date.now()
  }
  if (data.lost === true) {
    collection = "lostItems"
  } else if (data.found === true) {
    collection = "foundItems"
  }
  console.log("Adding to " + collection)
  mongodbclient.create(collection, filtered)
  .then(e => {
    if (e) {
      response.writeHeader( 200 )
      response.end()
    } else {
      response.writeHeader( 404 )
      response.end()
    }  
  })
}

const handleDelete = (data, response) => {
  mongodbclient.delete(data._id)
  .then((e) => {
    if (e) {
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end()    
    } else {
      response.writeHead( 404, "UID not found", {'Content-Type': 'text/plain' })
      response.end()  
    }
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     } else {

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

const sendData = function( response, data ) {
  response.writeHeader( 200, { 'Content-Type': 'application/json' })
  for (let i = 0; i < data.length; i++) {
    let timestampDate = new Date(data[i].timestamp)
    let elapsed = ((Date.now() - timestampDate) / (24 * 60 * 60 * 1000));
    data[i].created = Math.round(elapsed)
  }
  response.end(JSON.stringify(data))
}

server.listen( process.env.PORT || port )
