const express    = require('express'),
      mongodb    = require('mongodb'),
      dotenv     = require('dotenv').config(),
      cookie     = require('cookie-session'),
      app        = express();

app.use( express.static( 'public' ) );
app.use( express.json() );

app.use( express.urlencoded({extended: true }));
app.use( cookie({
  name: 'session',
  keys: [process.env.COOKIEKEYA, process.env.COOKIEKEYB]
}));



const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST;

console.log(uri)
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true } );
let loginsCollection = null;
let shapesCollection = null;

client.connect()
.then( () => {
  return client.db( 'shapes-db' ).collection( 'users' );
})
.catch(console.error)
.then( __collection => {
  loginsCollection = __collection;
  loginsCollection.insertOne( {user: 'user', pass: 'pass'} );
  loginsCollection.find({ }).toArray()
  .then( result => console.log(result) )
})

.then( () => {
  return client.db( 'shapes-db' ).collection( 'shapes' );
})
.catch(console.error)
.then( __collection => {
  shapesCollection = __collection;
});

app.post( '/login', (req,res)=> {
  console.log(`user: ${req.body.user} | pass: ${req.body.pass}`);
  loginsCollection.find( { user: req.body.user, pass: req.body.pass } ).toArray()
  .then(results => {
    if (results.length > 0) {
      req.session.login = true;
      res.redirect('/creator.html');
    } else {
      console.log('failed login');
      res.redirect('/index.html');
    }
  });
});

app.post( '/newlogin', (req,res)=> {
  if (loginsCollection)
    loginsCollection.insertOne( req.body );
});

app.use( function( req,res,next) {
  if( req.session.login === true )
    next();
  else
    res.sendFile( __dirname + '/' );
})



// route to get all docs
app.get( '/', (req, res) => {
  if( shapesCollection !== null ) {
    // get array and pass to res.json
    shapesCollection.find({ }).toArray().then( result => res.json( result ) )
  }
});

// route to get all docs
app.post( '/getshape', (req, res) => {
  if( shapesCollection !== null ) {
    console.log(`${req.body.docId} requested`)
    shapesCollection.find({'_id': mongodb.ObjectId(req.body.docId)}).toArray()
    .then( result => res.json( result[0] ) );
  }
});


app.use( ( request, response, next ) => {
  if ( shapesCollection !== null) {
    next();
  } else {
    response.status( 503 ).send();
  }
});


app.get('/', function(request, response) {
  response.sendFile( __dirname + '/index.html' );
});

app.get('/creator', function(request, response) {
  response.sendFile( __dirname + '/creator.html' );
});

app.post( '/add', function( request, response ) {
  console.log(`adding entry: ${request.body.name}`);
  shapesCollection.insertOne( request.body )  
  .then( result => response.json( result ) )
  .catch( err => console.error(`Failed to insert item: ${err}`) );
});

app.post( '/remove', function( request, response ) {
  shapesCollection.deleteOne( { _id:mongodb.ObjectId( request.body.shapeId ) })
  .then( result => response.json( result ) )
  .catch( err => console.error(`Failed to remove item: ${err}`) )
});

app.post( '/update', function( request, response ) {
  shapesCollection.updateOne(
    { _id:mongodb.ObjectId( request.body.shapeId ) },
    { $set:{ name:req.body.name } }
  )
  .then( result => response.json( result ) )
  .catch( err => console.error(`Failed to update item: ${err}`) )
});


app.listen( 3000 );


