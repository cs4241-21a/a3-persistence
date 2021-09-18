require('dotenv').config();
const express = require('express');
const mongodb = require('mongodb');
const app = express();

app.use(function (req, res, next) {
    next();
});

app.use(express.static('views'));
app.use(express.json());

const uri = 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST;

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = null;

client.connect()
    .then(() => {
        return client.db('GTWFinApp').collection('Users');
    })
    .then(__collection => {
        collection = __collection;
        return collection.find({ "username": "Eri" }).toArray()
    })
    .then(console.log)

app.get('/', (req, res) => {
    if (collection !== null) {
        collection.find({}).toArray.then(result => res.json(result))
    }
})

app.listen(3000);