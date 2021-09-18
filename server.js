require('dotenv').config();
const express = require('express');
const cookie = require('cookie-session');
const mongodb = require('mongodb');
const app = express();

app.use(cookie({
    name: 'session',
    keys: ['key1', 'key2']
}));

app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post('/login', async function (req, res) {
    let reqUser = req.body.username;
    let reqPass = req.body.password;
    let userList = await collection.find({
        "username": reqUser,
        "password": reqPass
    }).toArray();

    console.log(userList);

    if (userList.length === 1) {
        req.session.login = true;
        res.redirect('main.html');
    } else {
        res.sendFile(__dirname + '/views/index.html');
    }
});

app.use(function (req, res, next) {
    if (req.session.login === true) {
        next();
    } else {
        res.sendFile(__dirname + '/views/index.html');
    }
});

app.use(express.static('views'));

app.listen(3000);