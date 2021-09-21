require('dotenv').config()
const express = require( "express" ),
    { MongoClient } = require('mongodb'),
    bodyParser = require('body-parser'),
    cookierParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    app = express()


app.use(express.static( "public" ))
app.use(session({ secret: "secret"}))
app.use( express.json() )
app.use( bodyParser.urlencoded() )
app.use( cookierParser() )
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
  collection.findOne({_id: id}, function(err, user) {
    done(err, user);
  });
});


const uri = "mongodb+srv://admin:admin@cluster0.vkyuj.mongodb.net/database?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
  response.sendFile( __dirname + "/views/login.html" );
  console.log("cookies:", request.cookies)
});

app.get("/views/login.html", ( request, response ) => {
  response.sendFile( __dirname + "/views/login.html" );
});

app.get("/views/index.html", ( request, response ) => {
  response.sendFile( __dirname + "/views/index.html" );
});

app.get("/views/new.html", ( request, response ) => {
  response.sendFile( __dirname + "/views/new.html" );
});

app.get( "/dreams", ( request, response ) => {
  response.json( dreams );
});

app.post( "/submit", ( request, response ) => {
    return "submitted: ${}"
})

app.post( "/createUser", ( request, response ) => {
  console.log("created User")
  console.log(request.body)
  collection
    .insertOne( request.body )
    .then( result => response.json( result ) )
})

app.post('/login',
  passport.authenticate('local', { successRedirect: '/views/index.html', failureRedirect: '/', failureFlash: false })
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
  collection.insertOne( request.body ).then( result => response.json( result ) )
})

app.post( '/remove', ( request, response ) => {
  collection
    .deleteOne({ _id:mongodb.ObjectId( request.body._id ) })
    .then( result => response.json( result ) )
})

app.post( '/update', ( request, response ) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectId( request.body._id ) },
      { $set:{ name:request.body.name } }
    )
    .then( result => response.json( result ) )
})