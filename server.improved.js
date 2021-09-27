const { response } = require('express')

const http = require('http'),
    fs = require('fs'),
    GH = require("passport-github").Strategy,
    // mime = require('mime'),
    dir = 'public/',
    express = require("express"),
    mongodb = require('mongodb'),
    passport = require('passport'),
    session = require('express-session'),
    dotenv = require('dotenv').config(),
    app = express(),
    port = 3000

let userId = ''

//const uri = 'mongodb+srv://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.HOST
const uri = 'mongodb+srv://tester:Tester@cluster0.7gpfu.mongodb.net/'

// make all the files in 'public' available
app.use(express.static("public"))

// handles parsing json data
app.use(express.json())

// Helps secure your apps by setting various HTTP headers
app.use(express.helmet())

// Record HTTP response time
app.use(express.response-time())

// passport session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 1000 // stores for a min *  24 * 60 
    }
}))

app.use(passport.initialize())

app.use(passport.session())


passport.serializeUser(function(user, cb) {
    cb(null, user.id)
})
passport.deserializeUser(function(id, cb) {
    cb(null, id)
})

// AUTHENTIFICATION
passport.use(new GH({
        clientID: 'Iv1.6ea6fadfd0adfbbb',
        clientSecret: "5889095decfb1cf5746017f5a61993f98ce5aa61",
        callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
        userId = profile.username
        cb(null, profile);
    }
));

const isAuth = (request, response, next) => {
    if (request.user) {
        next()
    } else {
        response.redirect('/login.html')
    }
}

// redirect to index.html
app.get("/", isAuth, (request, response) => {
    response.sendFile(__dirname + "/views/index.html")
});

// redirect to login.html
app.get("/login", (request, response) => {
    if (request.user) {
        return response.redirect('/')
    }
    response.sendFile(__dirname + "/public/login.html")
});

// redirect to login.html
app.get("/logout", (request, response) => {
    request.logOut()
    response.redirect('/login')
});


app.get('/auth/github',
    passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(request, response) {
        userId = request.user.id
        response.redirect('/');
    });

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let collection = null

client.connect()
    .then(() => {
        return client.db('database').collection('collection')
    })
    .then(_collection => {
        collection = _collection
        return collection.find({}).toArray()
    })


// get app data
app.post('/collection', (request, response) => {
    if (collection !== null) {
        collection
            .find({ user: userId })
            .toArray()
            .then(result => response.json(result))
    }
});

// add in data to db
app.post('/submit', express.json(), function(request, response) {
    urgent = urgency(request.body.time, request.body.date)
    console.log(urgent)
    collection
        .insertOne({
            user: userId,
            task: request.body.task,
            date: request.body.date,
            time: request.body.time,
            u: urgent,
            done: 'false'
        })
        .then(result => response.json(result))
})

// edit data in db
app.post('/edit', function(request, response) {
    let urgent = urgency(request.body.time, request.body.date)
    collection
        .updateOne({ _id: mongodb.ObjectId(request.body._id) }, {
            $set: {
                task: request.body.task,
                date: request.body.date,
                time: request.body.time,
                u: urgent
            }
        }).then(result => response.json(result))
})

// delete data in db
app.post('/delete', (request, response) => {
    collection
        .deleteOne({ _id: mongodb.ObjectId(request.body._id) })
        .then(result => response.json(result))
})

// check off data in db
app.post('/check', function(request, response) {
    collection
        .updateOne({ _id: mongodb.ObjectId(request.body._id) }, { $set: { done: request.body.done } })
})

// Urgency for tasks

const urgency = function(t, d) {
    let urgent = 0; // 0 is least urgent, 5 most urgent 

    if (d === '' && t !== '') {
        urgent = 5
    } else {
        let cur = new Date(),
            dd = cur.getDate(),
            mm = cur.getMonth() + 1,
            yy = cur.getFullYear(),
            today = new Date(mm + '/' + dd + '/' + yy),
            temp = Date.parse(d), //d.slice(5, 7) + '/' + d.slice(8, 10) + '/' + d.slice(0, 4),
            tempDate = new Date(temp)


        let difference = Math.ceil((tempDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        if (difference === 1) urgent = 5
        else if (difference <= 3 && difference > 1) urgent = 4
        else if (difference <= 7) urgent = 3
        else if (difference <= 14) urgent = 2
        else if (difference <= 30) urgent = 1

    }
    return urgent
}

app.listen(port)