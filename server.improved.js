const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      cookie = require( 'cookie-session' ),
      dir = 'public',
      app = express(),
      dbclient = new mongodb.MongoClient( process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology:true })

let users
let userdata
let tasklist

//open connection to database and save account data
dbclient.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return dbclient.db( 'userdata' ).collection( 'userinfo' )
  })
  .then( collection => {
    users = collection
    return users.find( { } ).toArray()
  })

// -------------------------------------------------------------
// ---------- Express request handling and middleware ----------
// -------------------------------------------------------------

app.use( express.json() )

app.use( express.urlencoded( { extended: true } ) )

app.use( cookie({
  name: "session",
  keys: [ process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2 ]
}) )

app.post( '/login', async ( request, response ) => {
  let json = request.body

  let logInResult = await checkCredentials( json.username, json.password )
  // log in if credentials are correct
  if( logInResult === "correct" ) {
    request.session.username = json.username
    request.session.password = json.password
    response.redirect( "/index.html" )
  }
  else {
    // if not in database, and account name is valid, create new account
    if ( logInResult === "nonexistent" && json.username !== "" && json.username !== "userinfo" ) {
      users.insertOne( { username: json.username, password: json.password } )
      request.session.username = json.username
      request.session.password = json.password
      response.redirect( "/index.html" )
    }
    // if incorrect, or nonexistent but invalid username, redirect to login page
    else {
      response.redirect( "/login.html" )
    }
  }
})

app.get( '/logout', ( request, response ) => {
  request.session.username = ""
  response.redirect( "/login.html" )
})

// send signed out users to the login page
app.use( async function( request, response, next ) {
  // if logged in, or logging in, or fetching the login page or a non html file, do nothing
  if( ( !request.url.endsWith( ".html" ) && request.url !== "/" && request.method === "GET" ) ||
      request.url.endsWith( "/login.html" ) || request.url.endsWith( "/login" ) || 
      await checkCredentials( request.session.username, request.session.password ) === "correct" ) {
    next()
  }
  // if loading an html file other than the login page, or using a non login post request and not logged in, redirect to the login page
  else {
    response.redirect( "/login.html" )
  }
})

app.use( express.static( dir ) )

app.post( '/add|/edit|/remove|/update', async ( request, response) => {
  // get user's tasks from database
  userdata = dbclient.db( 'userdata' ).collection( request.session.username )
  
  // check for failed connection
  if( userdata === null ) {
    response.status( 503 ).send()
    return
  }

  let json = request.body

  // round given deadline to nearest hour
  if ( 'deadline' in json ) {
    const ms = 60 * 60 * 1000 // number of milliseconds in an hour
    json.deadline = Math.round( json.deadline / ms ) * ms
  }

  switch( request.url ) {
    case '/add': await addTask( json ); break
    case '/edit': await editTask( json ); break
    case '/remove': await removeTask( json ); break
    case '/update': await recalculateStarts(); break
    default: break
  }

  response.writeHead( 200, "OK", { 'Content-Type': 'application/json' } )
  response.end( JSON.stringify( tasklist ) )
})

app.listen( process.env.PORT || 3000 )

// -----------------------------------------------------------------
// ---------- Database Actions and Startdate Calculations ----------
// -----------------------------------------------------------------

const checkCredentials = function( username, password ) {
  // check existing accounts for account with the given username
  return users.findOne( { username: username } )
  .then( account => {
    if ( account ) {
      // return whether the given password matches the account's password
      if ( account.password === password ) {
        return "correct"
      }
      return "incorrect"
    }
    // account is not in database
    return "nonexistent"
  })
}

const addTask = async function( json ) {
  json.start = Date.parse( Date() )
  await userdata.insertOne( json )
  
  await recalculateStarts()
}

const editTask = async function( json ) {
  await userdata
    .updateOne(
      { _id: mongodb.ObjectId( json._id ) },
      { $set: { name: json.name, period: json.period, deadline: json.deadline } },
    )
  
  await recalculateStarts()
}

const removeTask = async function( json ) {
  await userdata.deleteOne( { _id: mongodb.ObjectId( json._id ) } )
  
  await recalculateStarts()
}

// calculate latest starts based on deadlines and periods
const recalculateStarts = async function() {
  // get array from collection
  tasklist = await userdata.find( { } ).toArray()

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
  tasklist.forEach( async function( task ) {
    await userdata.updateOne(
      { _id: task._id},
      { $set: { start: task.start } }
    )
  })
}
