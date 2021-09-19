require('dotenv').config()
const express = require('express'),
    mongodb = require('mongodb'),
    cookie = require('cookie-session'),
    app = express(),
    bodyParser = require('body-parser')

app.use(express.static('public'))
app.use(express.static('public/js'))
app.use(express.static('public/css'))
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
        res.sendFile(__dirname + "/views/index.html"); //does this just end everything??
        console.log("got to GET/");
        // get array and pass to res.json
        //collection.find({}).toArray().then(result => console.log(result));
        //collection.find({}).toArray().then(result => res.json(result))
        //res.sendFile(__dirname + "/views/index.html");
    }
})

app.get('/load', (req, res) => {
    collection.find({}).toArray().then(result => res.json(result))
    console.log("load called");
})

app.use((req, res, next) => {
    if (collection !== null) {
        next()
    } else {
        res.status(503).send()
    }
})

app.post('/add', bodyParser.json(), (req, res) => {
    // assumes only one object to insert
    console.log(JSON.stringify(req.body))
    console.log(res)
    debugger
    console.log("ADD", req, req.body)
    //NEED TO PERFORM THE PROCESSING ON THE BODY.
    //im going to want two different things: a login database and a calculation database
    //here, perform the processing on the input then insert it inc. username that made it and whether is secret
    //make it so that it can only 'corrupt' public things
    //THEN, it has to return EVERYTHING available to this user (public stuff + their secrets) with ID
    collection.insertOne(req.body)
        .then(insertResponse => collection.findOne(insertResponse.insertedId))
        .then(findResponse => res.json(findResponse))
})

app.listen(3000)