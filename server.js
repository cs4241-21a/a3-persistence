require('dotenv').config()
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const dreams = [];
const passport = require('passport');
const util = require('util');
const session = require('express-session');
const methodOverride = require('method-override');
const GitHubStrategy = require('passport-github2').Strategy;
const partials = require('express-partials');
const axios = require("axios");


const DEFAULT_PORT = 3000;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const MONGO_USERNAME = process.env.DB_USER;
const MONGO_PASS = process.env.DB_PASS;
const MONGO_HOST = process.env.DB_HOST;

const OAUTH_CALLBACK_HOST = process.env.OAUTH_CALLBACK_HOST;

const { MongoClient, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASS}@${MONGO_HOST}`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let usersCollection = null;
let bookCollection = null;

// app.set('views', __dirname);
// app.set('view engine', 'ejs');

client.connect()
    .then(() => {
        return client.db('MyDigitalLib')
    })
    .then((db) => {
        usersCollection = db.collection('Users');
        bookCollection = db.collection('Books');
    });

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `http://${OAUTH_CALLBACK_HOST}/auth/github/callback`,
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {

            // To keep the example simple, the user's GitHub profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the GitHub account with a user record in your database,
            // and return that user instead.

            handleUserLogin(profile).then(res => done(null, res));
            // return done(null, profile);
        });
    }
));

async function handleUserLogin(profile) {
    const matching_user = await usersCollection.findOne({ github_id: profile.id });

    if (matching_user === null) {

        const user_entry = {
            github_id: profile.id,
            name: profile.username,
            avatar_url: profile._json.avatar_url,
        }
        const insert_result = await usersCollection.insertOne(user_entry)
        const user_entry_with_id = {
            ...user_entry,
            _id: insert_result.insertedId,
        };
        return user_entry_with_id;

    } else {
        return matching_user;
    }
}

// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use(express.static('public', { index: false }));

// get json when appropriate
app.use(bodyparser.json());
app.use(methodOverride());

app.use(session({ secret: 'dreadlockanyonewhackydeviator', resave: false, saveUninitialized: false }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHub will redirect the user
//   back to this application at /auth/github/callback
app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }),
    function(req, res) {
        // The request will be redirected to GitHub for authentication, so this
        // function will not be called.
    });

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/public/login.html');
});
// even with our static file handler, we still
// need to explicitly handle the domain name alone...
app.get('/', ensureAuthenticated, function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});



// API ENDPOINTS

// So the frontend can get info about the user
app.get('/me', ensureAuthenticated, (req, res) => {
    // console.log('/me');
    // console.log(req.user);
    res.send(req.user);
})

app.get('/me/books', ensureAuthenticated, (req, res) => {
    // console.log('/me/books');
    // console.log(req.user);
    const user_id = req.user._id;

    bookCollection.find({ user_id }).toArray()
        .then(books => res.send(books));
});

const OPENLIB_BASE_URL = 'https://openlibrary.org'
app.post('/addBook', ensureAuthenticated, async(req, res) => {
    const user_id = req.user._id;

    const body = req.body;
    const isbn = body.ISBN;


    const isbn_url = `${OPENLIB_BASE_URL}/isbn/${isbn}`;
    const book_info = (await axios.get(isbn_url)).data;
    console.log(book_info);
    const authors = book_info.authors;

    let author_names = [];
    if (authors) {
        // the authors are given by their author entry in openlibrary
        // so we have to go through and get the name for each other
        author_names = await Promise.all(authors.map(async author => {

            const author_info = (await axios.get(`${OPENLIB_BASE_URL}/${author.key}`)).data;
            return author_info.name;
        }));

    } else {
        author_names = ["Author Unknown"]
    }


    const book_entry = {
        user_id,
        isbn,
        title: book_info.title || "Title Unknown",
        authors: author_names,
        release_date: book_info.publish_date ? Date.parse(book_info.publish_date) : "Unknown",
        num_pages: book_info.number_of_pages || "Unknown",
        date_added: Date.now(),
        location: body.location,
        rating: body.rating,
    };

    bookCollection.insertOne(book_entry);

    res.send(book_entry);
});

app.put('/modifyBook', ensureAuthenticated, async(req, res) => {
    const user_id = req.user._id;

    const body = req.body;
    const book_entry_id = body._id;
    const isbn = body.ISBN;


    const isbn_url = `${OPENLIB_BASE_URL}/isbn/${isbn}`;
    const book_info = (await axios.get(isbn_url)).data;
    const authors = book_info.authors;

    let author_names = [];
    if (authors) {
        // the authors are given by their author entry in openlibrary
        // so we have to go through and get the name for each other
        author_names = await Promise.all(authors.map(async author => {

            const author_info = (await axios.get(`${OPENLIB_BASE_URL}/${author.key}`)).data;
            return author_info.name;
        }));

    } else {
        author_names = ["Author Unknown"]
    }

    const book_entry = {
        user_id,
        isbn,
        title: book_info.title || "Title Unknown",
        authors: author_names,
        release_date: book_info.publish_date ? Date.parse(book_info.publish_date) : "Unknown",
        num_pages: book_info.number_of_pages || "Unknown",
        date_added: Date.now(),
        location: body.location,
        rating: body.rating,
    };

    const update = await bookCollection.updateOne({ _id: new ObjectId(book_entry_id) }, { $set: book_entry });

    res.send(update);
});


app.delete('/deleteBook', ensureAuthenticated, async(req, res) => {
    const user_id = req.user._id;

    const body = req.body;
    const book_entry_id = body._id;

    const doc = {
        _id: new ObjectId(book_entry_id),
        user_id
    }
    console.log("deleting document matching: ");
    console.log(doc);
    const deletion_result = await bookCollection.deleteOne(doc);
    res.send(deletion_result);
});



app.listen(process.env.PORT ? process.env.PORT : DEFAULT_PORT);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}