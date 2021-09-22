require('dotenv').config()
const express = require( "express" ),
    mongodb = require('mongodb'),
    bodyParser = require('body-parser'),
    cookierParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    app = express()


app.use('/public', express.static(__dirname + '/public'))
app.use(session({ secret: "secret"}))
app.use( express.json() )
app.use( cookierParser("Secret") )
app.use( bodyParser.urlencoded() )
app.use( passport.initialize() )
app.use( passport.session() )


passport.use(new LocalStrategy( function(username, password, done) {
  collection.findOne({ username: username, password: password }, function(err, user) {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' })
    }
    if (!password) {
      return done(null, false, { message: 'Incorrect password.' })
    }
    return done(null, user)
  })
}))

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  collection.findOne({_id:id}, function(err, user) {
    done(err, user);
  });
});

const uri = "mongodb+srv://admin:admin@cluster0.vkyuj.mongodb.net/database?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'database' ).collection( 'login' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )

app.get("/", ( request, response ) => {
  response.sendFile( __dirname + "/public/login.html" );
  console.log("cookies:", request.cookies)
});

app.get("/views/index.html", ( request, response ) => {
  response.sendFile( __dirname + "/views/index.html" );
});

app.get( "/dreams", ( request, response ) => {
  response.json( dreams );
});

app.get("/logout", function(req, res){
  console.log(req.user)
  req.logout()
  console.log(req.user)
  res.redirect("../public/login.html")
  console.log('here')
});

app.post( "/submit", ( request, response ) => {
    return "submitted: ${}"
})

app.post( "/createUser", ( request, response ) => {
  console.log("created User")
  console.log(request.body)
  collection
    .insertOne( request.body )
    .then( response.redirect("/") )
    //.then( result => response.json( result ) )
})

app.post('/login',
  passport.authenticate('local', { successRedirect: '/views/index.html', failureRedirect: '/public/Failed_Login.html', failureFlash: false })
)

// listen for requests :)
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);


app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/add', ( request, response ) => {
  // assumes only one object to insert
  console.log(request.user)
  response.send(request.user)
  //request.body.user_id = request.user._id
  collection.insertOne( request.body ).then( result => response.json( result ) )
})

app.post( '/remove', ( request, response ) => {
  collection
    .deleteOne({ _id:request.body._id})
    .then( result => response.json( result ) )
})

app.post( '/update', ( request, response ) => {
  collection
    .updateOne(
      { _id:request.body._id},
      { $set:{ name:request.body.name } }
    )
    .then( result => response.json( result ) )
})