// For express webserver
const express = require('express');
const bodyParser = require('body-parser');

// For serving static files static page
const app = express();

// For github authentication
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github').Strategy;

// For .env support
require('dotenv').config();

// For database support
const database = require('./database')(process.env.MONGODB_URI);

app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img', express.static(__dirname + '/public/img'))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
     }
}));

app.use(passport.initialize());
app.use(passport.session());

const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

const githubClientID = process.env.GITHUB_ID;
const githubClientSecret = process.env.GITHUB_SECRET;

const isLoggedIn = (req, res, next) => {
    if (req.user) next();
    else res.redirect('/login');
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: githubClientID,
    clientSecret: githubClientSecret,
    callbackURL: "http://localhost:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, cb) {
    cb(null, profile);
}));

// Pages users are directed to
app.get('/', isLoggedIn, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
    if(req.user) {
        return res.redirect('/');
    }
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

// Github Authentication
app.get('/auth/error', (req, res) => res.send('Unknown Error'));

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }),
function(req, res) {
    // Nothing
});

app.get('/auth/github/callback',
passport.authenticate('github', { failureRedirect: '/login' }),
function(req, res) {
    res.redirect('/');
});


app.get('/getData', (req, res) => {
    database.getAllDatabaseData(req.user.username)
    .then(function(value) {
        res.send(value);
    });
});

app.post('/newEntry', isLoggedIn, jsonParser, (req, res) => {
    const data = req.body;
    data.user = req.user.username;

    database.addEntryToDatabase(data);

    res.send('Parsed input and added to database.');
});

app.post('/modifyEntry', isLoggedIn, jsonParser, (req, res) => {
    const data = req.body;

    database.modifyEntryInDatabase(data);

    res.send('Modified entry ID: ' + data._id);
});

app.post('/deleteEntry', isLoggedIn, jsonParser, (req, res) => {
    const data = req.body;

    database.deleteEntryInDatabase(data);

    res.send('Parsed input and deleted from database.');
});

app.listen(3000, function() {
    console.log('Listening on port 3000...');
});
