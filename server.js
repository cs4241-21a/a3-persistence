// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
// const express = require("express");
// const app = express();
const express    = require('express'),
      app        = express(),
      bodyparser = require( 'body-parser' ),
      port = 3000,
      mime = require( 'mime' )
      // dreams     = []

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

var appdata = []

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// get json when appropriate
app.use( bodyparser.json() )

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/login", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.post( '/submit', bodyparser.json(), function( request, response ) {
  dreams.push( request.body.newdream )
  response.writeHead( 200, { 'Content-Type': 'application/json'})
  response.end( JSON.stringify( dreams ) )
})

app.post( '/submit-book', bodyparser.json(), function( request, response ) {
  console.log(`submit-book post request: ${request}`);
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const json = JSON.parse( dataString )
    appdata.push(json)
    appdata.sort(function ( a, b ) {
      if ( a.rating < b.rating ){
        return 1;
      }
      if ( a.rating > b.rating ){
        return -1;
      }
      if( a.year < b.year){
        return 1;
      }
      if ( a.year > b.year){
        return -1;
      }
      return 0;
    })
    for(var i = 0; i < appdata.length; i++){
      appdata[i].rank = i+1
    }

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end(JSON.stringify(appdata))
  })
})

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT || port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
