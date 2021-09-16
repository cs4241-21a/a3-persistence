const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      serveFavicon = require( 'serve-favicon' ),
      cookie = require( 'cookie-session' ),
      dir = 'public',
      app = express(),
      dbclient = new mongodb.MongoClient( process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology:true })

app.use( express.static( dir ) )
app.use( express.json() )

app.use( express.urlencoded() )

app.use( express.cookieSession() )

// send signed out users to the login page
app.use( function( request, response, next ) {
  if( request.session.loggedIn === true )
    next()
  else
    response.sendFile( dir + '/index.html' )
})

// app.get( '/', function( request, response ) {
//   response.sendFile( dir + '/index.html' )
// })

app.post( '/add|/edit|/remove|/update', ( request, response) => {
  let json = request.body
  console.log( "received json: " + json )
  console.log( "with url: " + request.url )
  switch( request.url ) {
    case '/add': addTask( json.name, json.period, json.deadline ); break
    case '/edit': editTask( json.id, json.name, json.period, json.deadline ); break
    case '/remove': removeTask( json.id ); break
    case '/update': login( json.username, json.password ); break
    default: break
  }

  response.writeHead( 200, "OK", { 'Content-Type': 'application/json' } )
  response.end( JSON.stringify( userdata ) )
})

app.listen( process.env.PORT || 3000 )

const userdata = []

let highestId = 2

/*let collection = null

//test database connection
dbclient.connect()
  .then( () => {
    console.log( "connected with client" )
    // will only create collection if it doesn't exist
    return dbclient.db( 'userdata' ).collection( 'testuser' )
  })
  .then( collection => {
    console.log( "fetched collection" )
    // store reference to collection
    userdata.splice( 0, userdata.length )
    collection.find({ }).toArray().then( tasks => {
      tasks.forEach( ( task ) => userdata.push( task ) )
    })
    // blank query returns all documents
    return userdata
  })
  .then( console.log )
  .then( dbclient.close() )*/

const addTask = function( name, period, deadline ) {
  let id = highestId + 1
  highestId++;

  let ms = 60 * 60 * 1000 // number of milliseconds in an hour
  deadline = Math.round( deadline / ms ) * ms

  console.log( "in addTask: " )
  console.log( "id: " + id + "name: " + name + "start: " + Date.parse( Date() ) + "period: " + period + "deadline: " + deadline )

  let dataEntry = { 'id': id, 'name': name, 'start': Date.parse( Date() ), 'period': period, 'deadline': deadline }
  userdata.push(dataEntry)

  recalculateStarts()
}

const editTask = function( id, name, period, deadline ) {
  let i = userdata.findIndex( ( entry ) => entry.id === id )

  let ms = 60 * 60 * 1000 // number of milliseconds in an hour
  deadline = Math.round( deadline / ms ) * ms

  console.log( "in editTask: " )
  console.log( "id: " + id + "name: " + name + "period: " + period + "deadline: " + deadline )

  userdata[i].name = name
  userdata[i].period = period
  userdata[i].deadline = deadline

  recalculateStarts()
}

const removeTask = function( id ) {
  let i = userdata.findIndex( ( entry ) => entry.id === id )

  console.log( "in removeTask: " )
  console.log( "id: " + id )

  userdata.splice(i, 1)

  //update highestId to next lowest id if necessary
  if (id === highestId){
    highestId = 0
    userdata.forEach(entry => {
      if ( id > highestId ) {
        highestId = id
      }
    });
  }

  recalculateStarts()
}

const recalculateStarts = function() {
  // calculate latest starts based on deadlines and periods

  // sort by latest deadline first
  userdata.sort( function( entry1, entry2 ) {
    return entry2.deadline - entry1.deadline
  })

  // calculate time to start
  const interval = 60 * 60 * 1000 // one hour in milliseconds
  if ( userdata.length > 0 ) {
    let effectiveDeadline = userdata[0].deadline

    userdata.forEach( ( task ) => {
      if ( task.deadline < effectiveDeadline ) {
        effectiveDeadline = task.deadline
      }
      task.start = effectiveDeadline - ( task.period * interval )
      effectiveDeadline = task.start
    })
  }

  // sort by earliest start first by reversing array
  userdata.reverse()
}
