const http = require( 'http' ),
    fs   = require( 'fs' ),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library used in the following line of code
    mime = require( 'mime' ),
    dir  = 'public/',
    port = 3000

let appdata = []

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
    switch(request.url){
      case '/submit':
      {
        appdata.push(dataString)
        response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
        console.log(JSON.stringify(appdata));
        response.end(JSON.stringify(appdata));
      } break;

      case '/delete':
      {
        /* whatever record you are sending */
        const json = JSON.parse(dataString);
        appdata.splice(+json.index,1);
        response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
        response.end(JSON.stringify(appdata));
      } break;

      case '/reveal':
      {
        response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
        response.end(JSON.stringify(appdata));
      }
        /*
        add more cases here if you want to edit or delete and handle them accordingly
        */
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

    }else{

      // file not found, error code 404
      response.writeHeader( 404 )
      response.end( '404 Error: File Not Found' )

    }
  })
}

server.listen( process.env.PORT || port )