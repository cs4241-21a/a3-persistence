require('dotenv').config()
const { MongoClient } = require('mongodb');

const express = require('express')

const app = express()
const port = 3000

const uri = `mongodb+srv://user:${process.env.MONGODB_PASSWORD}@cluster0.2kzj5.mongodb.net/db?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the client
client.connect(err => {
    // if (err) throw err
    const collection = client.db("db").collection("boards");
    // perform actions on the collection object
    app.listen(port, () => console.log("listening on http://localhost:3000"))
    client.close();
});

/* EXPRESS ROUTES */
app.use(express.static('public'))

// Create a new board
app.post('/board', (req, res) => {
    // make sure user is authenticated
    console.log(req.body.json())
    res.send('Hello World!')
})

// Get information about a specific board
app.get('/board/:boardID', (req, res) => {
    // make sure user is authenticated for this endpoint
    console.log("get the board information related to " + req.params.boardID)
    res.send("reached GET board " + req.params.boardID)
})

// Get all the boards related to a single user
app.get('/user/:userID/boards', (req, res) => {
    console.log("get the board ids that belong to user " + req.params.userID)
    var boardIDs = ['uuid1', 'uuid2']
    res.send(boardIDs)
})