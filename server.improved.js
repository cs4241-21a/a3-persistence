const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      cookie = require( 'cookie-session' ),
      dir = 'public',
      app = express(),
      dbclient = new mongodb.MongoClient( process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology:true })

let users
let userdata
const tasklist = []

//connect to users collection
dbclient.connect()
  .then( () => {
    console.log( "connected with client" )
    // will only create collection if it doesn't exist
    return dbclient.db( 'userdata' ).collection( 'userinfo' )
  })
  .then( collection => {
    console.log( "fetched collection" )
    users = collection
    return users.find( { } ).toArray().then( console.log )
  })

app.use( express.json() )

app.use( express.urlencoded( { extended: true } ) )

app.use( cookie({
  name: "session",
  keys: [ process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2 ]
}) )

app.post( '/login', ( request, response ) => {
  let json = request.body
  console.log( "received json: " + JSON.stringify( json ) )
  console.log( "with url: " + request.url )

  if( request.body.username === "testuser") {
    request.session.username = "testuser"
    console.log( "logged in as testuser" )
    console.log( "tasks.html" )
    response.redirect( "/tasks.html" )
  }
  else {
    console.log( "not logged in" )
    response.redirect( "/index.html" )
  }
})

app.get( '/logout', ( request, response ) => {
  request.session.username = ""
  response.redirect( "/index.html" )
})

// send signed out users to the login page
app.use( function( request, response, next ) {
  console.log( request.session.username )
  console.log( "url: " + request.url + "username: " + request.session.username)
  // if logged in, or logging in, or fetching the login page or a non html file, do nothing
  if( ( !request.url.endsWith( ".html" ) && request.method === "GET" ) ||
        request.session.username === "testuser" || request.url.endsWith( "/index.html" ) || request.url.endsWith( "/login" ) ) {
    next()
    console.log( "logged in as testuser" )
  }
  // if loading an html file other than the login page, or using a non login post request and not logged in, redirect to the login page
  else {
    response.redirect( "/index.html" )
    console.log( "not logged in" )
  }
})

app.use( express.static( dir ) )

app.post( '/add|/edit|/remove|/update', ( request, response) => {
  // get user's tasks from database
  dbclient.db( 'userdata' ).collection( request.session.username )
  .then( collection => {
    console.log( "fetched collection" )
    userdata = collection
    return userdata.find( { } ).toArray().then( console.log )
  })
  
  // check for failed connection
  if( userdata === null ) {
    response.status( 503 ).send()
    return
  }

  let json = request.body
  console.log( "received json: " + json )
  console.log( "with url: " + request.url )

  // round given deadline to nearest hour
  if ( 'deadline' in json ) {
    const ms = 60 * 60 * 1000 // number of milliseconds in an hour
    json.deadline = Math.round( deadline / ms ) * ms
  }
  switch( request.url ) {
    case '/add': addTask( json ); break
    case '/edit': editTask( json.id, json.name, json.period, json.deadline ); break
    case '/remove': removeTask( json.id ); break
    case '/update': recalculateStarts(); break
    default: break
  }

  response.writeHead( 200, "OK", { 'Content-Type': 'application/json' } )
  response.end( JSON.stringify( tasklist ) )
})

app.listen( process.env.PORT || 3000 )

const addTask = function( json ) {
  console.log( "in addTask: " )
  console.log( "name: " + json.name + "start: " + Date.parse( Date() ) + "period: " + json.period + "deadline: " + json.deadline )

  json.start = Date.parse( Date() )
  userdata.insertOne( json ).then( () => recalculateStarts() )
}

const editTask = function( json ) {
  console.log( "in editTask: " )
  console.log( "_id: " + json._id + "name: " + json.name + "period: " + json.period + "deadline: " + json.deadline )

  userdata
    .updateOne(
      { _id: mongodb.ObjectId( json._id ) },
      { $set: { name: json.name, period: json.period, deadline: json.deadline } },
    )
    .then( () => recalculateStarts() )
}

const removeTask = function( id ) {
  console.log( "in removeTask: " )
  console.log( "id: " + id )

  userdata.deleteOne( { _id: mongodb.ObjectId( json._id ) } )
    .then( () => recalculateStarts() )
}

// calculate latest starts based on deadlines and periods
const recalculateStarts = function() {
  // get array from collection
  tasklist = userdata.find( { } ).toArray()

  // sort by latest deadline first
  tasklist.sort( function( entry1, entry2 ) {
    return entry2.deadline - entry1.deadline
  })

  // calculate time to start for each task
  const interval = 60 * 60 * 1000 // one hour in milliseconds
  if ( tasklist.length > 0 ) {
    let effectiveDeadline = tasklist[0].deadline

    tasklist.forEach( ( task ) => {
      if ( task.deadline < effectiveDeadline ) {
        effectiveDeadline = task.deadline
      }
      task.start = effectiveDeadline - ( task.period * interval )
      effectiveDeadline = task.start
    })
  }

  // sort by earliest start first by reversing array
  tasklist.reverse()

  // update database with tasklist start data
  tasklist.forEach( task => {
    userdata.updateOne(
      { _id: task._id},
      { $set: { start: task.start } }
    )
  })
}
