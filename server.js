const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const express = require( 'express' );
const mongodb = require( 'mongodb' );
const cookie = require( 'cookie-session' );
const helmet = require( 'helmet' );
const favicon = require( 'serve-favicon' );
const serveStatic = require( 'serve-static' );
const path = require( 'path' );
const app = express();

const clientID = '6293d146755b88e66857';
const clientSecret = '5c1676202596fb930a9a5b4e94d469b95d184d1f';

app.use(helmet())

app.use(serveStatic('public', {'index' : ['index.html']}))

app.use( cookie({
  name: 'session',
  keys: ['af42dsfs2kkhgbnsfdfggfghbckkpop6577534623432sdsfdsfd', 'ke43dffsfs23fdssafgfdgfdsg']
}))

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

passport.serializeUser(function(user, done){
  done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user);
})

passport.use(new GitHubStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: "http://localhost:3000/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/error', (req, res) => res.send('Unknown Error'))
app.get('/github/callback',passport.authenticate('github', { failureRedirect: '/auth/error' }),
function(req, res) {
  res.redirect('/res?id=' + req.user.id);
});


app.get('/res', (req, res) => {
  req.session.id = req.query.id;
  res.redirect("results.html")
})

app.get( '/logout', (req, res) => {
  req.session.id = '';
  req.logout();
  res.redirect('/');
})

app.use( express.static('public') )
app.use( express.json() )

const uri = 'mongodb+srv://mydbuser:sd4A47HHLOuJ7rQJ@cluster0.yb8hn.mongodb.net/'

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'raceresults' ).collection( 'raceone' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })

app.get( '/results', (req,res) => {
  if( collection !== null ) {
    collection.find({ userID: req.session.id }).sort({ avg: 1 }).toArray().then( result => res.json( result ) )
  }
})

app.post( '/submit', (req,res) => {
  // assumes only one object to insert
  const dataJSON = req.body;
  let avg = dataJSON.time / dataJSON.laps;
  dataJSON.avg = avg;
  dataJSON.userID = req.session.id;
  collection
    .findOne({ name:dataJSON.name, team:dataJSON.team, userID:dataJSON.userID })
    .then( function (result) { 
      return result;
    })
    .then(function (data) {
      if(data === null) {
        collection.insertOne( dataJSON ).then( result => res.json( result ))
      } else {
        collection.replaceOne( { name:dataJSON.name, team:dataJSON.team, userID:dataJSON.userID }, dataJSON ).then( result => res.json( result ))
      }
    })
})


app.post( '/remove', (req,res) => {
  // removes an instance matching request body
  collection.deleteOne( req.body ).then( result => res.json( result ) )
})

  
app.listen( process.env.PORT || 3000 )