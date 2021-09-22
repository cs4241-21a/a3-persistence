const express    = require('express'),
      app        = express(),
      bodyparser = require( 'body-parser' ),
      dreams     = []

// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use( express.static( 'public' ) )

// get json when appropriate
app.use( bodyparser.json() )

// even with our static file handler, we still
// need to explicitly handle the domain name alone...
app.get('/', function(request, response) {
  response.sendFile( __dirname + '/public/index.html' )
})

app.post( '/submit', function( request, response ) {
  dreams.push( request.body.newdream )
  response.writeHead( 200, { 'Content-Type': 'application/json'})
  response.end( JSON.stringify( dreams ) )
})

app.listen( 3000 )