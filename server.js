require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb');
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
app.use(express.static('public'))
app.use(session({ secret: 'randomsecret', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 } }));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json())

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth"
},

    function (accessToken, refreshToken, profile, cb) {
        console.log('create the new user or log them in')
        photo = profile.photos.length > 0 ? profile.photos[0].value : undefined;
        user = { _id: profile.id, name: profile.displayName, photo }
        client.db("db").collection("users").updateOne({ _id: { $eq: profile.id } }, { $set: user }, { upsert: true }, (err) => {
            cb(err, user)
        })
    }
));

passport.serializeUser(function (user, done) {
    console.log("user", user)
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    client.db("db").collection("users").findOne({ _id: { $eq: id } }, (err, user) => { done(err, user) })
});

// login route
app.get('/login', passport.authenticate('github'))
app.get('/auth',
    passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

app.get('/', function (req, res) {
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
app.post('/boards', (req, res) => {
    // make sure user is authenticated
    if (req.user == undefined) {
        res.sendStatus(403)
        return
    }

    board = {
        owner: req.user._id,
        content: req.body.content
    }

    try {
        client.db('db').collection('boards').insertOne(board).then((board) => res.send(board))
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Get information about a specific board
app.get('/boards/:boardID', (req, res) => {
    // make sure user is authenticated for this endpoint
    if (req.user == undefined) {
        res.sendStatus(403)
        return
    }

    // get the board from the db
    client.db("db").collection("boards").findOne({ _id: new ObjectId(req.params.boardID) }, (err, board) => {
        if (err) {
            console.log(err)
            res.sendStatus(500)
            return
        }

        if (req.user._id != board.owner) {
            res.sendStatus(403)
            return
        }

        res.send(board)
    })
})

// Get all the boards related to the logged in user
app.get('/boards', (req, res) => {
    // make sure user is authenticated for this endpoint
    if (req.user == undefined) {
        res.sendStatus(403)
        return
    }

    console.log("get the board ids that belong to user " + req.user._id)
    client.db("db").collection("boards").find({ owner: { $eq: req.user._id } }).toArray().then((boards) => res.send(boards.map(b => b._id)))
})

// Connect to the client
client.connect(async err => {
    if (err) throw err

    app.listen(port, () => console.log("listening on http://localhost:3000"))
});
