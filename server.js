const express    = require('express'),
      mongodb    = require( 'mongodb' ),
      app        = express(),
      bodyparser = require( 'body-parser' ),
      dreams     = [],
      cookie     = require( 'cookie-session' ),
      username   = 'jake',
      password   = 'Ssf42698'
      uri        = 'mongodb+srv://'+username+':'+password+'@cluster0.blubq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'


let currUser = ""
// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use( express.static( 'public' ) )

// get json when appropriate
app.use( bodyparser.json() )
// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null,
    collectionTxt = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'Login' ).collection( 'Credentials' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )


// even with our static file handler, we still
// need to explicitly handle the domain name alone...
app.get('/', function(request, response) {
    if( collection !== null ) {
    // get array and pass to res.json
    collection.find({ }).toarray().then( result => res.json( result ) )
  }
    response.sendfile( __dirname + '/public/index.html' )
})


app.post('/load', async function(request, response) {
    //console.log(collection.find().forEach())
//if(request.session.login)response.redirect('index.html')
    //console.log(collection.find({}, {nest:1}).toArray)
let string = await collection.findOne({ uname: currUser })
console.log(string)
        response.send(string)
})

 app.get('/logout', function(req, res) {
    req.session.login = false
     currUser=""
    req.session.username = null
    res.redirect( 'index.html' )
  
 })


 app.get('/home', function(req, res) {
    if(req.session.login = false){
        res.redirect( 'index.html' )
    }
     console.log(req.session.login)
  
 })



app.post( '/submit', async function( request, response ) {
  console.log(request.body)
    //add that to nest and then send the nest back
   // dreams.push( request.body.newdream )
  //response.writeHead( 200, { 'Content-Type': 'application/json'})
  //response.end( JSON.stringify( dreams ) )
//console.log(request.session.username) 
await collection
    .updateOne(
      { uname: currUser },
      { $push:{ nest: request.body} }
    )

let string = await collection.findOne({ uname: currUser })
//console.log(string)
        response.send(string)
  
})



app.post( '/save', async function( request, response ) {
  console.log(request.body.mod)
    //add that to nest and then send the nest back
   // dreams.push( request.body.newdream )
  //response.writeHead( 200, { 'Content-Type': 'application/json'})
  //response.end( JSON.stringify( dreams ) )
//console.log(request.session.username)
    var n ={}
    n["nest." + request.body.mod] = request.body
await collection
    .updateOne(
      { uname: currUser },
      { $set:n }
    )

let string = await collection.findOne({ uname: currUser })

//console.log(string)
        response.send(string)
  
})


app.post( '/remove', async function( request, response ) {
    console.log(currUser)
    console.log(request.body.mod)
let string = await collection.findOne({ uname: currUser })
    console.log(string.nest)
    string.nest.splice(request.body.mod,1)
    let nest = string.nest

    var n ={}
    n["nest"] = nest
await collection
    .updateOne(
      { uname: currUser },
      { $set:n }
    )

 string = await collection.findOne({ uname: currUser })
//console.log(string)
        response.send(string)
 
  
})




//app.post( '/remove', async function( request, response ) {
    //add that to nest and then send the nest back
   // dreams.push( request.body.newdream )
  //response.writehead( 200, { 'content-type': 'application/json'})
  //response.end( json.stringify( dreams ) )
//console.log(request.session.username)
//    console.log(collection.find({ }, {nest}).toarray())
    /*var n ={}
    n["nest." + request.body] = {}
await collection
    .updateone(
      { uname: request.session.username },
      { $set:n }
    )
*/
 

  //console.log(request.body.mod)
    //add that to nest and then send the nest back
 //let string = await collection.find({  }).toarray()
//console.log(string)
   // let nest = string[0].nest
  //  console.log(request.body.mod, nest[request.body.mod])
    //    response.send(string)
  
//})



app.post( '/login', async (req,res)=> {
  
  const existUsername = await collection.findOne({ uname: req.body.uname, psw: req.body.psw})
  if (existUsername) {
 
    currUser = req.body.uname
    req.session.login = true
    req.session.username = req.body.uname
    res.sendFile( __dirname + '/protected/home.html' )
  }else{
    res.redirect( 'index.html' )
  }
})

app.post( '/add', async (req,res) => {
    const existUsername = await collection.findOne({ uname: req.body.uname2})
  if (req.body.uname == null || req.body.psw == null || existUsername) {
    console.log('username taken');
    return
  }
  // assumes only one object to insert
  collection.insertOne( req.body ).then( result => res.json( result ) )

collection
    .updateOne(
      { _id:mongodb.ObjectId( req.body._id ) },
      { $set:{ nest: [{first: 'jake', last: 'feiss', sport: 'football', major: 'computer science', resume: 'added soon'},{first: 'jake2', last: 'feiss', sport: 'football', major: 'computer science', resume: 'added soon'}] } }
    )
    req.session.login = true
    req.session.username = req.body.uname
     res.redirect('index.html')  
})

/*app.post( '/remove', (req,res) => {
  collection
    .deleteOne({ _id:mongodb.ObjectId( req.body._id ) })
    .then( result => res.json( result ) )
})*/

app.post( '/update', (req,res) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
    )
    .then( result => res.json( result ) )
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
     res.sendFile( __dirname + '/protected/home.html' )
  else
    res.redirect( 'index.html' )
})

const PORT = process.env.PORT||3000
app.listen( PORT, ()=> {
    console.log('click here for a surprise https://localhost:3000')
} )
