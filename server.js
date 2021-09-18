const express = require( 'express' ),
      // bodyparser = require( 'body-parser' )
      mongodb = require( 'mongodb' )
      app = express()

app.use( express.static('public') )
app.use( express.json() )

require('dotenv').config()


/**--------------------------------------------
 *               MONGODB
 *---------------------------------------------**/
const db_name = 'test',
      db_music_col = 'musictest',
      db_user_col = 'usertest'

const uri = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
.then( () => {
  // will only create collection if it doesn't exist
  return client.db( db_name ).collection( db_music_col)
})
.then( __collection => {
  // store reference to collection
  collection = __collection
  // blank query returns all documents
  return collection.find({ }).toArray()
})
.then( console.log('connected to database') )

// check connection
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

/**--------------------------------------------
 *               EXPRESS ROUTES
 *---------------------------------------------**/
app.use( function( req, res, next ) {
  console.log( 'url:', req.url )
  next()
})

app.get( '/', function (req, res) {
  // res.send( 'Hello World!' )
  res.sendFile(__dirname + "/public/index.html");
})

app.get( '/getHistory', function (req, res) {
  res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  if( collection !== null ) {
    // get array and pass to res.json
    collection.find({ }).toArray()
    .then(result => res.end( JSON.stringify(result)))
    .then( json => {
      return json
    })
  }
})

// routes for handling the post request
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

    // history.push( json )
    // debugger
    collection.insertOne( json )//.then( result => response.json( result ) )
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

app.post( '/update', (req,res) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
    )
    .then( result => res.json( result ) )
})

app.post( '/remove', (req,res) => {
  console.log('remove function')
  console.log('removing', mongodb.ObjectId( req.body._id ))
  debugger
  collection
    // .remove({ _id:mongodb.ObjectId( req.body._id ) })
    .deleteOne({ _id:mongodb.ObjectId( req.body._id ) })
    // .then( result => res.json( result ) )
    .then(result => res.end( JSON.stringify(result)))
    .then( json => {
      console.log('removing', json)
      return json
    })
})

const listener = app.listen( process.env.PORT || 3000, function() {
  console.log( 'Your app is listening on port ' + listener.address().port )
})