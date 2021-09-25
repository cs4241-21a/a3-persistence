const fs   = require( 'fs' ),
      mime = require( 'mime' ),
      express = require('express'),
      body_parser = require('body-parser'),
      morgan = require('morgan'),
      app     = express(),
      dir  = 'public/',
      port = 3001

app.use(express.static(dir));
app.use(morgan(':method :url :status - :response-time ms'));

app.get('/', function(_req, response) {
  response.sendFile( __dirname + '/views/index.html' )
});

let appdata = [];

app.get('/get', function(_req, response) {
  response.writeHead( 200, "OK", {'Content-Type': 'application/json' });
  response.write(JSON.stringify(appdata));
  response.end();
});

app.post( '/submit', body_parser.json(), function( request, response ) {
  console.log(request.body);
  const data = request.body;
  switch(data.action) {
    case "add":
      // copying the fields manually is more secure than blindly copying the whole object
      appdata.push({
        task: data.payload.task,
        priority: data.payload.priority,
        creationDate: data.payload.creationDate,
        deadline: calcDeadline(data.payload),
      });
      break;
    case "modify":
      appdata[data.index].task = data.payload.task;
      appdata[data.index].priority = data.payload.priority;
      appdata[data.index].deadline = calcDeadline(appdata[data.index]);
      break;
    case "delete":
      appdata.splice(data.index, 1);
      break;
    default:
      // invalid POST request
      response.writeHead(400);
      response.end();
      return;
  }

  response.writeHead( 200, "OK", {'Content-Type': 'application/json' });
  response.write(JSON.stringify(appdata));
  response.end();
})

app.listen(process.env.PORT || port);

const calcDeadline = function(data) {
  let date = new Date(data.creationDate);
  date.setDate(date.getDate() + { low: 10, medium: 7, high: 4 }[data.priority]);
  return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
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
