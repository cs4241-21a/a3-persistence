const express = require( 'express' ),
      // bodyparser = require( 'body-parser' )
      app = express(),
      history = []

app.use( express.static('public') )
app.use( express.json() )

app.use( function( req, res, next ) {
  console.log( 'url:', req.url )
  next()
})

app.get( '/', function (req, res) {
  // res.send( 'Hello World!' )
  res.sendFile(__dirname + "/public/index.html");
})

app.get( '/getHistory', function (req, res) {
  // res.send( 'Hello World!' )
  // res.sendFile(__dirname + "/public/index.html");
  res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  res.end(JSON.stringify(history))
})

// for example only: routes for handling the post request
app.use( function( request, response, next ) {
  let dataString = ''

  request.on( 'data', function( data ) {
    dataString += data 
  })

  request.on( 'end', function() {
    const json = JSON.parse( dataString )

    // derived field: volume
    let rain_volume
    switch (json.rain_level) {
      case "light_rain":
        // console.log('light rain')
        rain_volume = 0.8
        break;
      case "rain":
        // console.log('rain')
        rain_volume = 0.5
        break
      case "heavy_rain":
        // console.log('heavy rain')
        rain_volume = 0.7
        break
      default:
        break;
    }
    // make rain quieter if there's lofi music
    if (json.lofi === "lofi_on") {
      rain_volume -= 0.2
    }
    json.rain_volume = rain_volume.toFixed(1)
    console.log('response', json )

    history.push( json )
    // add a 'json' field to our request object
    request.json = JSON.stringify( json )
    next()
  })
})


app.post( '/submit', function( request, response ) {
  // our request object now has a 'json' field in it from our
  // previous middleware
  // history.push( request.body.newmix)
  // console.log('response', response)
  // debugger
  console.log('submit', request.json)
  response.writeHead( 200, { 'Content-Type': 'application/json'})
  // console.log('submit response', request.json )
  response.end( JSON.stringify(request.json ))
})

const listener = app.listen( process.env.PORT || 3000, function() {
  console.log( 'Your app is listening on port ' + listener.address().port )
})