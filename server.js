require('dotenv').config()
const { MongoClient } = require('mongodb');
const path = require('path')
const express = require('express')
const passport = require('passport')
const session = require('express-session');
var GitHubStrategy = require('passport-github').Strategy;

const app = express()
const port = 3000

const uri = `mongodb+srv://user:${process.env.MONGODB_PASSWORD}@cluster0.2kzj5.mongodb.net/db?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/* MIDDLEWARE SETUP */
app.use(session({ secret: 'randomsecret', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 } }));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth"
    },

    function (accessToken, refreshToken, profile, cb) {
        console.log('create the new user or log them in')
        console.log(profile)
        cb(null, profile)
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(null, {id: id})
    // User.findById(id, function (err, user) {
    //     done(err, user);
    // });
});

// login route
app.get('/login', passport.authenticate('github'))
app.get('/auth',
    passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

app.get('/', function (req, res) {
    console.log(req.user)
    // Get the logged in user
    if (req.user == undefined) {
        res.redirect('/login')
        return
    }

    res.render('Home', {
        user: req.user
    })
})

// Create a new board
app.post('/board', (req, res) => {
    // make sure user is authenticated
    console.log(req.body.json())
    res.send('Hello World!')
})

// Get information about a specific board
app.get('/board/:boardID', (req, res) => {
    // make sure user is authenticated for this endpoint
    console.log("get the board information related to " + req.params.boardID)
    res.send("reached GET board " + req.params.boardID)
})

// Get all the boards related to a single user
app.get('/user/:userID/boards', (req, res) => {
    console.log("get the board ids that belong to user " + req.params.userID)
    var boardIDs = ['uuid1', 'uuid2']
    res.send(boardIDs)
})

// Connect to the client
client.connect(err => {
    // if (err) throw err
    const collection = client.db("db").collection("boards");
    // perform actions on the collection object
    app.listen(port, () => console.log("listening on http://localhost:3000"))
    client.close();
});