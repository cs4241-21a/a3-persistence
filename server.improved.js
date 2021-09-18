require('dotenv').config();
const express = require('express'),
  app = express(),
  compression = require('compression'),
  helmet = require('helmet'),
  mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient,
  uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/HotelReviews?retryWrites=true&w=majority`,
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }),
  GitHubStrategy = require('passport-github').Strategy,
  passport = require('passport'),
  session = require('express-session');

let githubid = null; // This will eventually store the id of the user who is authenticated through github

let collection = null;
client.connect((err) => {
  collection = client.db('HotelReviews').collection('Reviews');
});

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 1000, // Will store cookies for one minute
    },
  })
);

app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function (user, callback) {
  callback(null, user.id);
});

passport.deserializeUser(function (id, callback) {
  callback(null, id);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GIT_ID,
      clientSecret: process.env.GIT_SECRET,
      callbackURL: 'http://127.0.0.1:3000/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, callback) {
      callback(null, profile);
    }
  )
);

// Middleware to check connection to database
app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});

app.use(helmet());

app.use(compression());

const checkauthenticated = (request, response, next) => {
  if (request.user) {
    next();
  } else {
    response.redirect('/login.html');
  }
};

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/login.html');
});

app.get('/home', checkauthenticated, function (request, response) {
  //If user is not authenticated they will be redirected to the login page not the home page
  response.sendFile(__dirname + '/public/home.html');
});

app.get('/logout', function (request, response) {
  request.logOut();
  response.redirect('/');
});

// ----------------------------GitHub Auth--------------------------------------------------------

app.get('/auth/github', passport.authenticate('github'));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login.html' }),
  function (req, res) {
    // Successful authentication, redirect home.
    githubid = req.user.id;
    res.redirect('/home');
  }
);

// ------------------------------------------------------------------------------------

const getOverallScore = function (
  cleanlinessScore,
  serviceScore,
  amenityScore
) {
  let sum = cleanlinessScore + serviceScore + amenityScore;
  return Math.round((sum / 3) * 10) / 10;
};

app.post('/table', express.json(), function (request, response) {
  collection
    .find({ creator: githubid })
    .toArray()
    .then((result) => response.json(result));
});

app.post('/submit', express.json(), function (request, response) {
  const overallScore = getOverallScore(
    request.body.cleanliness,
    request.body.service,
    request.body.amenity
  );

  collection
    .insertOne({
      creator: githubid,
      hotel: request.body.hotel,
      location: request.body.location,
      startdate: request.body.startdate,
      cleanliness: request.body.cleanliness,
      service: request.body.service,
      amenity: request.body.amenity,
      overallexperience: overallScore,
    })
    .then(() => collection.find({ creator: githubid }).toArray())
    .then((result) => response.json(result));
});

app.post('/delete', express.json(), function (request, response) {
  collection
    .deleteOne({ _id: mongodb.ObjectId(request.body.id) })
    .then(() => {
      return collection.find({ creator: githubid }).toArray();
    })
    .then((result) => response.json(result));
});

app.post('/edit', express.json(), function (request, response) {
  const overallScore = getOverallScore(
    request.body.cleanliness,
    request.body.service,
    request.body.amenity
  );
  collection
    .updateOne(
      { _id: mongodb.ObjectId(request.body.id) },
      {
        $set: {
          hotel: request.body.hotel,
          location: request.body.location,
          startdate: request.body.startdate,
          cleanliness: request.body.cleanliness,
          service: request.body.service,
          amenity: request.body.amenity,
          overallexperience: overallScore,
        },
      }
    )
    .then(() => collection.find({ creator: githubid }).toArray())
    .then((result) => response.json(result));
});

// automatically deliver all files in the public folder with the correct headers
app.use(express.static('public'));

app.listen(process.env.PORT);
