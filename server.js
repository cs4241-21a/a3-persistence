const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      app = express()

app.use( express.static('public') )
app.use( express.json() )
app.use( express.urlencoded( {extended : true}  ) )

console.log("hi")
const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
// const uri = 'mongodb+srv://test_user:test_pass123@cluster0.2hxyg.mongodb.net/'
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'character_saver' ).collection( 'users' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )
  
// route to get all docs
// app.get( '/', (req,res) => {
//   if( collection !== null ) {
//     // get array and pass to res.json
//     collection.find({ }).toArray().then( result => res.json( result ) )
//   }
// })
app.get( '/', (req,res) => {
  console.log(__dirname)
  res.sendFile(__dirname + "/views/login.html")

})
app.get( '/index.html', (req,res) => {
  console.log(__dirname)
  res.sendFile(__dirname + "/views/index.html")

})

app.post( '/login', async ( request, response ) => {
  let json = request.body
  console.log(json)
  
  
  switch(await checkUser (json.username, json.password)) {
  case "success":
    console.log("suc")
    // request.session.username = json.username
    // request.session.password = json.password
    // response.redirect( "/views/login.html" )
    response.redirect("/index.html");
    break;
  case "fail":
            console.log("fail")
    response.redirect( "/login.html" )
    break;
  case "no_user":
            console.log("nouser")
    createUser(json.username, json.password)
    break;
  default:
    // code block
}
})

app.use( async function( request, response, next ) {
  // if logged in, or logging in, or fetching the login page or a non html file, do nothing
  // if( ( !request.url.endsWith( ".html" ) && request.url !== "/" && request.method === "GET" ) ||
  //     request.url.endsWith( "/login.html" ) || request.url.endsWith( "/login" ) || 
  //     await checkCredentials( request.session.username, request.session.password ) === "correct" ) {
if(true){
  next()
  }
  // if loading an html file other than the login page, or using a non login post request and not logged in, redirect to the login page
  else {
    response.redirect( "/login.html" )
  }
})

app.post( '/add', (req,res) => {
  // assumes only one object to insert
  collection.insertOne( req.body ).then( result => res.json( result ) )
})

app.listen( 3000 )



// check username and passowrd
const checkUser = async function( username, password ) { 
  let users = client.db('character_saver').collection('users')
  // check username
  return users.findOne( { username: username } )
  .then( user => {
    if ( user ) {
      // check password
      if ( user.password === password ) {
        return "success"
      }
      return "fail"
    }
    return "no_user"
  })
}

// create new user
const createUser = async function (username, password) {
  console.log("create")
  let users = client.db('character_saver').collection('users')
  users.insertOne( { username: username, password: password } )
}

// // server.js
// // where your node app starts

// // we've started you off with Express (https://expressjs.com/)
// // but feel free to use whatever libraries or frameworks you'd like through `package.json`.
// const express = require("express");
// const app = express();

// // our default array of dreams
// const dreams = [
//   "Find and count some sheep",
//   "Climb a really tall mountain",
//   "Wash the dishes"
// ];

// // make all the files in 'public' available
// // https://expressjs.com/en/starter/static-files.html
// app.use(express.static("public"));

// // https://expressjs.com/en/starter/basic-routing.html
// app.get("/", (request, response) => {
//   console.log(request.url)
//   console.log(__dirname)
//   response.sendFile(__dirname + "/views/login.html");
// });

// // send the default array of dreams to the webpage
// app.get("/dreams", (request, response) => {
//   // express helps us take JS objects and send them as JSON
//   response.json(dreams);
// });



// // listen for requests :)
// const listener = app.listen(process.env.PORT, () => {
//   console.log("Your app is listening on port " + listener.address().port);
// });
