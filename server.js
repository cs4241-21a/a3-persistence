const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  { 'name': 'AAA', 'score': 43, 'game': 'Mario Bros.', 'highscore': true, 'id': 0},
  { 'name': 'ABC', 'score': 67, 'game': 'Donkey Kong', 'highscore': true, 'id': 1},
  { 'name': 'ZZZ', 'score': 168, 'game': 'Street Racing', 'highscore': true, 'id': 2},
  { 'name': 'E', 'score': 2, 'game': 'Mario', 'highscore': false, 'id': 3}
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response );
  }else if( request.method === 'POST' ){
    handlePost( request, response );
  }
})

// Handle GET requests (don't touch this you fool, you moron)
const handleGet = function( request, response ) {
  console.log(request.url);
  const filename = dir + request.url.slice( 1 );

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' );
  } else {
    sendFile( response, filename );
  }
}

// Handle POST requests
const handlePost = function( request, response ) {
  console.log("POST Request received");

  // Create a string based on the data that comes with the POST request
  let dataString = '';
  request.on( 'data', function( data ) {
      dataString += data; 
  });

  // Continue with the POST request
  request.on( 'end', function() {

    if(request.url === '/update') { // Update request, nothing in the dataString, send appdata
      console.log("Running update request");
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
      response.end(JSON.stringify(appdata));
      return;
    }

    // Take the string and create a JSON object
    console.log("Received data");
    const json = JSON.parse(dataString);
    console.log(json);

    if(request.url === '/delete') { // Delete request
      console.log("Running delete");
      for(let i = 0; i < appdata.length; i++) {
        if(appdata[i].id === json.id) { // ID Matches
          appdata.splice(i, 1);
          console.log("Deletion complete");
          break;
        }
      }
      /*if(json.highscore === true) { // Highscore Update
        let high = -1;
        let score = 0;
        for(let i = 0; i < appdata.length; i++) {
          if(appdata[i].game === json.game && appdata[i].score > score) {
            high = i;
            score = appdata[i].score;
          }
        }
        if(high !== -1) { // New Highscore
          appdata[high].highscore = true;
        }
      }*/

    } else if(request.url === '/submit') { // Handle modify case as well
      console.log("Running submit request");
      let high = -1;
      for(let i = 0; i < appdata.length; i++) { // Highscore Update
        if(appdata[i].game === json.game && appdata[i].score < json.score) {
          high = i;
          appdata.highscore = false;
          json.highscore = true;
        } else if(appdata[i].game === json.game && appdata[i].score > json.score) {
          json.highscore = false;
          break;
        }
      }
      if(high === -1) {
        json.highscore = true;
      }
      appdata.push(json);
    }

    //response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
    //response.end(JSON.stringify(appdata));
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

console.log("Server running");
server.listen( process.env.PORT || port );