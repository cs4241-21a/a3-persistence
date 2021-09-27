require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path')
const express = require('express')
const passport = require('passport')
const session = require('express-session');
var GitHubStrategy = require('passport-github').Strategy;

const app = express()
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

const uri = `mongodb+srv://user:${process.env.MONGODB_PASSWORD}@cluster0.2kzj5.mongodb.net/db?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/* MIDDLEWARE SETUP */
app.use(express.static('public'))
app.use(session({ secret: 'randomsecret', resave: false, saveUninitialized: true, cookie: { maxAge: 60000*60 } }));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json())

passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
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
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    client.db("db").collection("users").findOne({ _id: id }, (err, user) => { done(err, user) })
});

// login route
app.get('/login', passport.authenticate('github'))

app.get('/logout', (req, res) => {
    req.logout()
    req.session.destroy(function () {
        console.log("destroying the session")
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
})

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

    res.render('pages/Home', {
        user: req.user
    })
})

app.get('/users', (req, res) => {
    if (req.user == undefined) {
        res.sendStatus(403)
        return
    }

    client.db('db').collection('users').find({}).toArray().then((users) => res.send(users)).catch(err => {console.log(err); res.sendStatus(500)})
})

app.get('/users/:userID', (req, res) => {
    if (req.user == undefined) {
        res.sendStatus(403)
        return
    }

    client.db('db').collection('users').findOne({_id: req.params.userID}).then((user) => res.send(user)).catch(err => {console.log(err); res.sendStatus(500)})
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
        content: req.body.content,
        name: req.body.name,
        reviewers: req.body.reviewers,
        createdAt: new Date()
    }

    try {
        client.db('db').collection('boards').insertOne(board).then((board) => res.send(board))
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Get all the boards related to the logged in user
app.get('/boards', (req, res) => {
    // make sure user is authenticated for this endpoint
    if (req.user == undefined) {
        res.sendStatus(403)
        return
    }

    console.log("get the board ids that belong to user " + req.user._id)
    owned = client.db("db").collection("boards").find({ owner: req.user._id }).sort({ createdAt: -1 }).toArray()
    review = client.db("db").collection("boards").find({ reviewers: req.user._id }).sort({ createdAt: -1 }).toArray()

    Promise.all([owned, review]).then((vals) => res.send({ owned: vals[0].map(b => ({id: b._id, name: b.name})), review: vals[1].map(b => ({id: b._id, name: b.name, author: b.owner})) }))
        .catch(err => { console.log(err); res.sendStatus(500) })
})

// Get information about a specific board
app.get('/boards/:boardID', (req, res) => {
    // make sure user is authenticated for this endpoint
    if (req.user == undefined) {
        res.redirect('/')
        return
    }

    // get the board from the db
    client.db("db").collection("boards").findOne({ _id: new ObjectId(req.params.boardID) }, (err, board) => {
        if (err) {
            console.log(err)
            res.sendStatus(500)
            return
        }

        if (board == undefined) {
            res.sendStatus(404)
            return
        }

        if (req.user._id != board.owner && (board.reviewers && !board.reviewers.includes(req.user._id))) {
            res.sendStatus(403)
            return
        }

        res.render('pages/Board', {
            board,
            user: req.user
        })
    })
})

// Update the content of a board
app.patch('/boards/:boardID', (req, res) => {
    // make sure user is authenticated for this endpoint
    if (req.user == undefined) {
        res.sendStatus(403)
        return
    }

    client.db('db').collection('boards').updateOne({ _id: new ObjectId(req.params.boardID) }, { $set: { content: req.body.content } }).then(() => res.sendStatus(200)).catch(err => { console.log(err); res.sendStatus(500) })
})

// Delete a board by ID
app.delete('/boards/:boardID', (req, res) => {
    // make sure user is authenticated for this endpoint
    if (req.user == undefined) {
        res.sendStatus(403)
        return
    }

    client.db('db').collection('boards').findOneAndDelete({ _id: new ObjectId(req.params.boardID), owner: req.user._id }).then(() => res.sendStatus(204)).catch(err => { console.log(err); res.sendStatus(500) })
})

// Create a new comment
app.post('/comments', (req, res) => {
    // make sure user is authenticated for this endpoint
    if (req.user == undefined) {
        res.sendStatus(403)
        return
    }

    comment = {
        board: req.body.board,
        author: req.user._id,
        content: req.body.content,
        createdAt: new Date()
    }

    console.log(comment)

    client.db("db").collection("comments").insertOne(comment).then((comment) => res.send(comment))
})

app.get('/comments/:commentID', (req, res) => {
    if (req.user == undefined) {
        res.sendStatus(403)
        return
    }

    // get the board from the db
    client.db("db").collection("comments").findOne({ _id: new ObjectId(req.params.commentID) }, (err, comment) => {
        if (err) {
            console.log(err)
            res.sendStatus(500)
            return
        }

        if (comment == undefined) {
            res.sendStatus(404)
            return
        }

        res.send(comment)
    })

})

app.delete('/comments/:commentID', (req, res) => {
    if (req.user == undefined) {
        res.sendStatus(403)
        return
    }

    // get the board from the db
    client.db("db").collection("comments").findOneAndDelete({ _id: new ObjectId(req.params.commentID), author: req.user._id }).then(() => res.sendStatus(204)).catch(err => { console.log(err); res.sendStatus(500) })

})

// Get all comments related to given board id
app.get('/boards/:boardID/comments', (req, res) => {
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

        if (board == undefined) {
            res.sendStatus(404)
            return
        }

        // make sure the user is either the board owner or a valid reviewer
        if (req.user._id != board.owner && (board.reviewers && !board.reviewers.includes(req.user._id))) {
            res.sendStatus(403)
            return
        }

        // get the list of comments related to the board
        client.db("db").collection("comments").find({ board: req.params.boardID }).toArray().then((comments) => res.send(comments))
    })
})

// Connect to the client
client.connect(async err => {
    if (err) throw err

    app.listen(port)
});
