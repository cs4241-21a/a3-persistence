require('dotenv').config();
const express = require('express');
const app = express();
const mongodb = require('mongodb');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

const uri = 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST;

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = null;

client.connect()
    .then(() => {
        return client.db('GTWFinApp').collection('Users');
    })
    .then(__collection => {
        collection = __collection;
        return collection.find({ "username": "test" }).toArray()
    }).then(console.log)


app.get('/', checkAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});


app.get('/dashboard', checkAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/views/register.html');
})

const authUser = async (username, password, next) => {
    let user = await collection.find({ "username": username }).toArray();
    user = user[0];
    if (user === undefined) {
        return next(null, false, { message: 'No user with that username!' });
    }

    if (password === user.password) {
        return next(null, user)
    } else {
        return next(null, false, { message: 'Incorrect password!' })
    }

}

let getUserbyId = async id => {
    if (collection !== null) {
        return await collection.find({ "_id": id }).toArray()[0];
    } else {
        return null
    }
}

let getIdByUsername = async username => {
    if (collection !== null) {
        let user = await collection.find({ "username": username }).toArray();
        return user[0]._id;
    } else {
        null
    }
}

passport.use(new LocalStrategy({}, authUser));
passport.serializeUser((user, next) => next(null, user._id))
passport.deserializeUser((id, next) => {
    next(null, getUserbyId(id));
});

app.post('/login', checkNotAuthenticated, async (req, res, next) => {
    let userID = await getIdByUsername(req.body.username);
    passport.authenticate('local',
        {
            successRedirect: '/dashboard?userID=' + userID,
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
});

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

app.post('/signUp', async (req, res) => {
    if (collection === null) {
        alert('Failed to connect to the databse!');
        return res.redirect('/register');
    }

    try {
        collection.insertOne({
            "username": req.body.username,
            "password": req.body.password
        });
        return res.redirect('/');
    } catch (e) {
        alert('Failed to register the user: ' + e.message);
        return res.redirect('/register');
    }
});

app.get('/getUsers', async (req, res) => {
    if (collection === null) {
        alert('Failed to connect to database!');
        return res.redirect('/register');
    }
    let users = await collection.find({}).toArray()
    let usernameList = []
    users.forEach(element => {
        usernameList.push(element.username);
    });
    res.json(usernameList);
    res.end()
});

async function checkAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next()
}

app.use(express.static('./views'));

app.listen(3000);