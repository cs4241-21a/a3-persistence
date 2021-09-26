require('dotenv').config();

const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      app = express()
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');
const session = require('express-session');
const timeout = require('connect-timeout')

app.use( express.json() )

const url = 'mongodb+srv://'+process.env.USERNAME+':'+process.env.PASS+'@'+process.env.HOST

const client = new mongodb.MongoClient( url, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'database' ).collection( 'data' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )
  

const isAuth = (req,res, next) => {
  if(req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.use('/login', (req, res, next) => {
  req.setTimeout((4 * 60 * 1000) + 1);
  next();
}, timeout('4m'));

app.get("/", (request, response) => {
  console.log(request.user);
  response.sendFile(__dirname + '/public/login.html');
});

app.get("/login", (request, response) => {
  if(request.user) {
    return response.redirect('/');
  }
  response.sendFile(__dirname + '/public/login.html');
});

app.get("/logout", (request, response) => {
  request.logOut();
  response.redirect('/login');
});

// Add middleware to check connection
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

// GitHub authentication

// middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  },
}))

app.use(passport.initialize())
app.use(passport.session());

passport.serializeUser(function(user,cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id,cb) {
  cb(null, id);
});

let user_id; 
passport.use(
  new GitHubStrategy(
    {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'https://a3-renee-sawka.herokuapp.com/auth/github/callback',
    },
  function (accessToken, refreshToken, profile, cb) {
    user_id = profile.id;
    cb(null,profile)
  }
)
);

app.get('/auth/github', passport.authenticate('github'));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', {failureRedirect: '/login'}),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.post('/add', (req,res) => {
  // assumes only one object to insert
    collection.insertOne( 
    { 
      githubId: user_id,
      assignment: req.body.assignment, 
      course: req.body.course, 
      percentage: req.body.percentage, 
      priority: calculatePriority(req.body.percentage),
      deadline: req.body.deadline,
      grade: req.body.grade,
      itemIndex: req.body.itemIndex})

    .then( result => res.json( result ) )
})

app.post('/edit', function (req, res) {
  collection
    .updateOne(
      { _id:mongodb.ObjectId( req.body._id ) },
      { $set:{ assignment:req.body.assignment, 
               course:req.body.course,
               percentage: req.body.percentage, 
               priority: calculatePriority(req.body.percentage),
               deadline: req.body.deadline,
               grade: req.body.grade} }
    )
    .then( result => res.json( result ) )
})

fetchIndex = (_id, clb) => {
  collection.findOne({ _id:_id}, (err, user) => {
  clb(user.itemIndex);
  });
};

app.post('/complete', function (req, res) {

  fetchIndex(mongodb.ObjectId( req.body._id ), indexRemoved => 
  {
    collection.updateMany(
    { githubId: user_id, itemIndex: {$gt: indexRemoved}},
    { $inc:{ itemIndex: -1} })

    collection
    .deleteOne({ _id:mongodb.ObjectId( req.body._id ) })
    .then( result => res.json( result ) )
  }
  );
})

app.get( '/add', function (req, res) {
  collection.find().toArray(function(err, data) {
    res.send(data);
  })
})

app.get( '/edit', function (req, res) {
  collection.find().toArray(function(err, data) {
    res.send(data);
  })
})

app.get( '/complete', function (req, res) {
  collection.find().toArray(function(err, data) {
    res.send(data);
  })
})

app.get( '/data', (req,res) => {
  if( collection !== null ) {
    collection.find({ githubId: user_id}).toArray(function(err, data) {
      res.send(data);
    })
  }
})


function calculatePriority(percentage) {
  if(percentage >= 20)
    return "High";
  else
    if(percentage < 10)
      return "Low";
    else 
      return "Medium";
}
  
app.use( express.static('public') )
app.listen(process.env.PORT || 3000);
