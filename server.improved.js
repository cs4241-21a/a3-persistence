const express = require('express'),
  app = express(),
  serveStatic = require('serve-static'),
  bodyparser = require('body-parser'),
  cookieSession = require("cookie-session"),
  cookieParser = require("cookie-parser"),
  mongoose = require('mongoose'),
  GitHubStrategy = require('passport-github2').Strategy,
  passport = require('passport'),
  dotenv = require('dotenv');

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
require('dotenv').config();

app.use(cookieSession({
  name: "session",
  keys: [process.env.ENVKEY, process.env.ENVKEY2]
}))

mongoose.connect("mongodb+srv://Andrew:S9df0gtiYp5VPzil@cs4241.ijtch.mongodb.net/CS4241?retryWrites=true&w=majority")

const userSchema = new mongoose.Schema({
  username: String,
  password: String,

  ratingList: {
    rating: [{
      name: String,
      studentYear: String,
      yearsRemaining: String,
      favoriteDorm: String,
      favoriteDining: String,
      favoriteSpot: String,
      notes: String
    }]
  }
});

const defaultData =
{
  responseID: 1,
  name: 'Andrew',
  studentYear: 'Sophomore',
  yearsRemaining: 3,
  favoriteDorm: 'Morgan Hall',
  favoriteDining: 'Campus Center',
  favoriteSpot: 'Salisbury',
  notes: 'Morgan 4 Best Floor!'
};

const User = mongoose.model("User", userSchema);

/* const testUser = new User({
  username: "test",
  password: "1234",
  ratingList: {
    rating: [defaultData];
  }
})
testUser.save(); */

app.use(express.static('public'))
app.use(bodyparser.json())

app.use(serveStatic('public', { 'index': ['responses.html'] }))

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GitHubStrategy({
  clientID: '98054014391d5b76fa5e',
  clientSecret: 'aedfa1913dfc6dd6434891ec086a125f71f81528',
  callbackURL: "https://a3-akerekon.herokuapp.com/github/logs"
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/error', (req, res) => response.send("Unknown Error"))
app.get('/github/logs', passport.authenticate('github', { failureRedirect: '/auth/error'}),
function(req, res) {
  res.redirect('/response?id=' + request.user.id)
})

app.get('/response', async (req, res) => {
  const githubUser = new User( {
    username: req.query.id,
    password: "",
    ratingList: {
      rating: []
    }
  });
  githubUser.save();
  req.session.login = true;
  req.session.username = req.query.id;
  res.redirect("edit.html")
});


app.get('/redirectToEdit', bodyparser.json(), (req, res) => {
  if (req.session.login === true) {
    res.json({ redirect: true });
  } else {
    res.json({ redirect: false });
  }
})

app.get('/getUsername', bodyparser.json(), (req, res) => {
  let username = req.session.username;
  res.json({ username: username });
})

app.post('/getTableData', bodyparser.json(), async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user !== null) {
    //console.log(user.ratingList);
    res.json({ rows: user.ratingList });
  }
})

app.get('/getFullTableData', bodyparser.json(), async (req, res) => {
  let ratings = [];
  let usernames = [];
  const cursor = User.find().cursor();

  for (let user = await cursor.next(); user != null; user = await cursor.next()) {
    for (let rating of user.ratingList.rating) {
      console.log(rating);
      ratings.push(rating);
      //console.log(user.username);
      usernames.push(user.username);
    }
  }
    res.json({ratings: ratings,
    usernames: usernames});
})

app.post('/deleteRow', bodyparser.json(), async (req, res) => {
  console.log("Deleting a row!");
  const user = await User.findOne({ username: req.body.username });
  if (user !== null) {
    console.log("Found the user!");
    let rowIndex = req.body.deletingItem;
    user.ratingList.rating.splice(rowIndex, 1);
    user.save();
    res.json({ success: true });
  }
})

app.post('/editTableData', bodyparser.json(), async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user !== null) {
    req.body.yearsRemaining = getYearsRemaining(req.body.studentYear, req.body.name);
    let rowIndex = req.body.index;
    console.log("splicing at index" + rowIndex);
    user.ratingList.rating.splice(rowIndex, 1, req.body);
    console.log(req.body);
    user.save();
    res.json({ success: true });
  }
})

app.post('/submitTableData', bodyparser.json(), async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user !== null) {
    req.body.yearsRemaining = getYearsRemaining(req.body.studentYear, req.body.name);
    //console.log(req.body);
    user.ratingList.rating.push(req.body);
    user.save();
    res.json({ success: true });
  }
})

app.post('/login', bodyparser.json(), async (req, res) => {
  console.log(req.body.username);
  const user = await User.findOne({ username: req.body.username, password: req.body.password });
  if (user == null) {
    req.session.login = false;
    res.json({ loginSuccess: false });
  } else {
    req.session.login = true;
    req.session.username = req.body.username;
    res.json({ loginSuccess: true });
    console.log("Successful login!");
  }
})

app.put('/signOut', (req, res) => {
  req.session.login = false;
  req.session.username = "";
  res.json({ signOutSuccess: true });
});

app.post('/register', bodyparser.json(), async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user == null) {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      ratingList: {
        rating: []
      }
    });
    newUser.save();

    req.session.login = true;
    req.session.username = req.body.username;
    res.json({ registrationSuccess: true });
    console.log("Successful registration!");
  } else {
    req.session.login = false;
    res.json({ registrationSuccess: false });
  }
})

const deleteItem = function (jsonData) {
  appdata.splice(jsonData['deletingItem'], 1);
}

function getYearsRemaining(studentYear, name) {
  let years = -1;

  console.log(name);

  switch (studentYear) {
    case 'First-Year':
      years = 4;
      break;
    case 'Sophomore':
      years = 3;
      break;
    case 'Junior':
      years = 2;
      break;
    case 'Senior':
      years = 1;
      break;
    case 'Graduate Student':
      years = 'N/A';
      break;
    default:
      years = 'N/A';
      break;
  }

  if (name === 'Gompei') {
    years = 100;
  }
  return years;
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
