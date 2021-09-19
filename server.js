require('dotenv').config();
const express = require('express');
const app = express();
const mongodb = require('mongodb');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

app.use(express.static('views'));
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

const uri = 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST;

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = null;

client.connect()
    .then(() => {
        return client.db('GTWFinApp').collection('Users');
    })
    .then(__collection => {
        collection = __collection;
    })

app.get('/', (req, res) => {
    if (collection !== null) {
        collection.find({}).toArray().then(result => res.json(result))
    }
});

const authUser = async (username, password, next) => {
    let user = await collection.find({ "username": username }).toArray();
    if (user === []) {
        return next(null, false, { message: 'No user with that username!' });
    }

    if (password === user[0].password) {
        return next(null, user[0])
    } else {
        return next(null, false, { message: 'Incorrect password!' })
    }

}

let getUserbyId = async id => {
    if (collection !== null) {
        return collection.find({ "_id": id }).toArray()[0];
    } else {
        return null
    }
}

passport.use(new LocalStrategy({}, authUser));
passport.serializeUser((user, next) => next(null, user._id))
passport.deserializeUser((id, next) => {
    next(null,);
});

app.post('/login', passport.authenticate('local',
    {
        successRedirect: 'main.html',
        failureRedirect: '/',
        failureFlash: true
    }
));

app.listen(3000);