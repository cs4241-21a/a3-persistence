const express = require('express'),
  app = express(),
  serveStatic = require('serve-static'),
  bodyparser = require('body-parser'),
  cookieSession = require("cookie-session"),
  cookieParser = require("cookie-parser"),
  mongoose = require('mongoose');

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use(express.urlencoded({ extended: true }))


app.use(cookieSession({
  name: "session",
  keys: ["KEY1", "KEY2"]
}))

mongoose.connect("mongodb+srv://Andrew:S9df0gtiYp5VPzil@cs4241.ijtch.mongodb.net/CS4241?retryWrites=true&w=majority")

const userSchema = new mongoose.Schema({
  username: String,
  password: String,

  ratingList: {
    rating: [{
      name: String,
      studentYear: String,
      yearsRemaining: Number,
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

app.get('/redirectToEdit', bodyparser.json(), (req, res) => {
  if (req.session.login === true) {
    res.json({ redirect: true });
  } else {
    res.json({ redirect: false });
  }
})

app.get('/getUsername', bodyparser.json(), (req, res) => {
  let username = req.session.username;
  res.json({username: username});
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
    res.json({signOutSuccess: true});
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