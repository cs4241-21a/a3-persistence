require('dotenv').config()
const express = require('express'),
    mongodb = require('mongodb'),
    app = express()

app.use(express.static('public'))
app.use(express.json())

const uri = 'mongodb+srv://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.HOST

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let collection = null

client.connect()
    .then(() => {
        // will only create collection if it doesn't exist
        return client.db('WebwareA3').collection('Cluster0')
    })
    .then(__collection => {
        // store reference to collection
        collection = __collection
        // blank query returns all documents
        return collection.find({}).toArray()
    })
    .then(console.log)

// route to get all docs
app.get('/', (req, res) => {
    if (collection !== null) {
        res.sendFile(__dirname + "/views/index.html");
        // get array and pass to res.json
        collection.find({}).toArray().then(result => res.json(result))
    }
})

app.use((req, res, next) => {
    if (collection !== null) {
        next()
    } else {
        res.status(503).send()
    }
})

app.post('/add', (req, res) => {
    // assumes only one object to insert
    collection.insertOne(req.body)
        .then(insertResponse => collection.findOne(insertResponse.insertedId))
        .then(findResponse => res.json(findResponse))
})

app.listen(3000)
