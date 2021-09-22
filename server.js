const express = require( 'express' ),
      // bodyparser = require( 'body-parser' )
      mongodb = require( 'mongodb' )
      app = express()
      cookie = require('cookie-session')

app.use( express.json() )
// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended: true }) )

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
let users_collection = null

client.connect()
.then( () => {
  // will only create collection if it doesn't exist
  return client.db( db_name ).collection( db_music_col)
})
.then( __collection => {
  // store reference to collection
  collection = __collection
  // blank query returns all documents
  // return collection.find({ }).toArray()
  return client.db( db_name ).collection( db_user_col)
})
.then( __users_collection => {
  // store reference to collection
  users_collection = __users_collection
  // blank query returns all documents
  return users_collection.find({ }).toArray()
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
 *                  COOKIES
 *---------------------------------------------**/
// cookie middleware!
app.use( cookie({
  name: 'session',
  keys: ['psjuCsIfexaASL7EXMrd', '3hxRqrLbTUJku362ry82h6eMv']
}))

/**--------------------------------------------
 *               EXPRESS ROUTES
 *---------------------------------------------**/
 app.post( '/login', async (req,res, next)=> {
  let users = []
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body )
  
  // get the list of users from the database
  if( users_collection !== null ) {
    await users_collection.find({ }).toArray()
    // .then(result => JSON.parse(result))
    .then( jsonArr => {
      users = jsonArr
    })
  }

  console.log('users')
  console.log(users)
  console.log(typeof(users))

  // check if the username is in the database
  users.forEach(function(user) { 
    console.log(user.username)
    // check if username is in the database
    if (req.body.username === user.username) {
      // username found, check if passwords match
      if (req.body.password === user.password) {
        // define a variable that we can check in other middleware
        // the session object is added to our requests by the cookie-session middleware
        req.session.login = true
        
        // since login was successful, send the user to the main content
        // use redirect to avoid authentication problems when refreshing
        // the page or using the back button, for details see:
        // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
        // next()
        res.redirect( '/' )
      } else {
        // password incorrect, redirect back to login page
        res.sendFile( __dirname + '/public/views/login.html' )
        // todo show message: incorrect password
        console.log('incorrect password!')
        req.session.login = false
      }
    } 
    // else {
    //   // username not found, make new user
    //   debugger
    //   next()
    //   // todo message: signed up successfully
    //   console.log('signed up successfully!')
    // }
  })

  if (req.session.login === false) {
    debugger
    next()
    // todo message: signed up successfully
    console.log('signed up successfully!')
    req.session.login = true
  }

  // console.log('users')
  // console.log(users)
  // console.log(users.find())

  // if( req.body.password === 'test' ) {
  
  //   // define a variable that we can check in other middleware
  //   // the session object is added to our requests by the cookie-session middleware
  //   req.session.login = true
    
  //   // since login was successful, send the user to the main content
  //   // use redirect to avoid authentication problems when refreshing
  //   // the page or using the back button, for details see:
  //   // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
  //   // next()
  //   res.redirect( '/' )
  // }else{
  //   // password incorrect, redirect back to login page
  //   res.sendFile( __dirname + '/public/views/login.html' )
  // }
})

app.post('/signup', async function(req, res, next) {
  console.log('in use function')
  let dataString = ''

  req.on( 'data', function( data ) {
    dataString += data 
  })

  req.on( 'end', function() {
    const json = JSON.parse( dataString )
    console.log('response', json )

    collection.insertOne( json )//.then( result => response.json( result ) )
    // add a 'json' field to our request object
    req.json = JSON.stringify( json )
    next()
  })
})

app.post( '/signup', function( request, response ) {
  // our request object now has a 'json' field in it from our
  // previous middleware
  // history.push( request.body.newmix)
  // console.log('response', response)
  // debugger
  console.log('sign up', request.json)
  response.writeHead( 200, { 'Content-Type': 'application/json'})
  // console.log('submit response', request.json )
  response.end( JSON.stringify(request.json ))
})


app.use( function( req, res, next ) {
  console.log( 'url:', req.url )
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/views/login.html' )
})

app.use( express.static('public') )

app.get('/', function(req, res) {
  debugger
  res.sendFile( __dirname + '/public/views/index.html' )
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

app.get( '/getUsers', function (req, res) {
  res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  if( users_collection !== null ) {
    // get array and pass to res.json
    users_collection.find({ }).toArray()
    .then(result => res.end( JSON.stringify(result)))
    .then( json => {
      return json
    })
  }
})


// routes for handling the post request
app.use('/submit',  function( request, response, next ) {
  console.log('in use function')
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

app.post( '/remove', express.json(), function (req,res) {
  if( collection !== null ) {
    try {
      collection.deleteOne( { "_id" : mongodb.ObjectId(req.body._id )})
      .then( result => res.json( result ) )
   } catch (e) {
      console.log(e);
   }
  }
})



const listener = app.listen( process.env.PORT || 3000, function() {
  console.log( 'Your app is listening on port ' + listener.address().port )
})