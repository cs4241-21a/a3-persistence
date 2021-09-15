const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      bodyparser = require( 'body-parser' ),
      dir = 'public'
      app = express(),
      dbclient = new mongodb.MongoClient( process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology:true })

app.use( express.static( dir ) )
app.use( bodyparser.json() )

app.get( '/', function( request, response ) {
  response.sendFile( dir + '/index.html' )
})

app.post( '/add', ( request, response ) => {
  addTask( json.name, json.period, json.deadline )
  sendResponse( response )
})

app.post( '/edit', ( request, response ) => {
  editTask( json.id, json.name, json.period, json.deadline )
  sendResponse( response )
})

app.post( '/remove', ( request, response ) => {
  removeTask( json.id )
  sendResponse( response )
})

app.post( '/update', ( request, response ) => {
  sendResponse( reponse )
})

const sendResponse = function( response ) {
  response.writeHead( 200, "OK", { 'Content-Type': 'application/json' } )
  response.end( JSON.stringify( userdata ) )
}

app.listen( process.env.PORT || 3000 )

const userdata = []

let highestId = 2

let collection = null

dbclient.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'userdata' ).collection( 'testuser' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )
  .then( dbclient.close() )

const addTask = function( name, period, deadline ) {
  let id = highestId + 1
  highestId++;

  let ms = 60 * 60 * 1000 // number of milliseconds in an hour
  deadline = Math.round( deadline / ms ) * ms

  let dataEntry = { 'id': id, 'name': name, 'start': Date.parse( Date() ), 'period': period, 'deadline': deadline }
  userdata.push(dataEntry)

  recalculateStarts()
}

const editTask = function( id, name, period, deadline ) {
  let i = userdata.findIndex( ( entry ) => entry.id === id )

  let ms = 60 * 60 * 1000 // number of milliseconds in an hour
  deadline = Math.round( deadline / ms ) * ms

  userdata[i].name = name
  userdata[i].period = period
  userdata[i].deadline = deadline

  recalculateStarts()
}

const removeTask = function( id ) {
  let i = userdata.findIndex( ( entry ) => entry.id === id )

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
