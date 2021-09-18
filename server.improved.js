const express    = require('express'),
      bodyParser = require( 'body-parser' ),
      cookie  = require( 'cookie-session' ),
      cookieParser = require('cookie-parser'),
      serveStatic = require('serve-static')
      app        = express()


const { request } = require('express')
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

app.use( express.urlencoded({ extended:true }) )
app.use(cookieParser())


app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.use(express.static('public'))

let loginCollection = null
const uri = `mongodb+srv://dbUser:Michael1@csweb.0knbq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  loginCollection = client.db("contactApp").collection("loginInfo");
});

app.post( '/login', (req,res)=> {

  if( loginCollection !== null ) {
    loginCollection.find({ username:req.body.username }).toArray().then( result => { 
      console.log(req.body.password)
      console.log(req.body.username)
      console.log(result)
      if(result.length === 1){

        if( req.body.password === result[0].password ) {

          req.session.login = true
          req.session.username = req.body.username
          
          console.log('Cookies: ', cookieParser.JSONCookies(req.cookies))

          console.log('Signed Cookies: ', req.signedCookies)
          res.redirect( 'main.html' )
        }else{
          req.session.login = false
          res.sendFile( __dirname + '/public/index.html' )
        }
      }
      else{
        console.log("Wrong email")
        req.session.login = false
        res.sendFile( __dirname + '/public/index.html' )
      }
    })
  }
  
  
  
})


app.post('/createAccount', bodyParser.json(), function(request, response) {
  console.log("IN THE CREATE")
  if( loginCollection !== null ) {
    loginCollection.find({ username: request.body.username }).toArray()
    .then(result => {
      if(result.length == 0){
        loginCollection.insertOne( request.body )
        .then( result => { 
          response.json({isValid: true})
        })
        .catch(err => console.log(err)) 
      }
      else {
        console.log("account exists")
        response.json({isValid: false})
      }
    }) 
    
  }
  
})

app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/index.html' )
})







let collection= null


client.connect(err => {
  collection = client.db("contactApp").collection("userData");
});


app.post( '/signOut', bodyParser.json(), function( request, response ) {
  console.log("In sign out: " + request.session.login)
  request.session.login = false
  console.log("In sign out: " + request.session.login)
  response.sendFile( __dirname + '/public/index.html' )
})

app.post( '/submit', bodyParser.json(), function( request, response ) {
  request.body.username = request.session.username
  collection.insertOne( request.body )
    .then( insertResponse => collection.findOne( insertResponse.insertedId ) ) 
    .then( findResponse   => response.json( findResponse ) )
  .catch(err => console.log(err)) 
})

app.get('/getData', function(request, response) {
  if( collection !== null ) {
    collection.find({ username:request.session.username }).toArray().then( result => { response.json( result ) } )
  }
})

app.post('/getItem',  bodyParser.json(), function(request, response) {
  if( collection !== null ) {
    collection.findOne( { _id:mongodb.ObjectId( request.body.id ) } )
      .then( result => { response.json( result ) })
  }
})


app.post('/delete', bodyParser.json(), function(request, response) {
  collection
    .deleteOne({ _id:mongodb.ObjectId( request.body.id ) })
    .then( result => response.json( result ) )
})

app.post('/update', bodyParser.json(), function(request, response) {
  collection
    .updateOne(
      { _id:mongodb.ObjectId( request.body.modifyInput ) },
      { $set:{ name:request.body.name,
               email:request.body.email,
               number:request.body.number,
               age:request.body.age,
               occupation:request.body.occupation,
               age_group:request.body.age_group,
               education_level:request.body.education_level,
               notes:request.body.notes
              } }
    )
    .then( result => response.json( result ) )
})




const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

