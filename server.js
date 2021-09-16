// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser"); //middleware(middle man function that does some sort of function)
const app = express();
const mongodb = require("mongodb");

var ObjectId = require('mongodb').ObjectId;

app.use(express.static("public"));

app.get("/", (request, response) => {
    response.sendFile(__dirname + "public/index.html");
});

const uri =
    "mongodb+srv://tester:tester123@cluster0.gfgtp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new mongodb.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let collection = null;

client.connect(err => {
    collection = client.db("appdata").collection("event");
    //console.log(collection);
})

app.get("/reviews", (request, response) => {
    collection
        .find({})
        .toArray()
        .then(result => response.json(result))
        .catch(err => console.log(err));
});

//calls bodyParser.json() in the middle of receiving the request and sending a response
app.post("/add", bodyParser.json(), (request, response) => {
    console.log("body:", request.body);
    collection.insertOne(request.body)
        .then(insertResponse => collection.findOne(insertResponse.insertedId))
        .then(findResponse => {
            console.log(findResponse)
            response.json(findResponse)
        });
});

app.post("/remove", bodyParser.json(), (request, response) => {
    collection
        .deleteOne({ _id: ObjectId(request.body._id) })
        .then(result => {
            console.log(result)
            response.json(result)
        });
});

//TODO
app.post('/update', bodyParser.json(), (request, response) => {
    console.log("id: ", request.body._id)
    collection
        .updateOne({ _id: ObjectId(request.body._id) }, { $set: { review: request.body.review } })
        .then(result => {
            console.log(result)
            response.json(result)
        });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});