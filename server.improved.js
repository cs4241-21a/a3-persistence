const express = require("express"),
  app = express(),
  bodyparser = require("body-parser"),
  mongodb = require("mongodb"),
  helmet = require("helmet"),
  compression = require("compression"),
  favicon = require("serve-favicon"),
  port = 3003;
require("dotenv").config();
app.use(compression({ level: 6, threshold: 0 }));
app.use(express.static("public"));
app.use(bodyparser.json());
app.use(helmet());
app.use(favicon(__dirname + "/public/assets/WPI.ico"));

const uri =
  "mongodb+srv://" +
  process.env.DBUSER +
  ":" +
  process.env.DBPASS +
  "@" +
  process.env.DBHOST;

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let collection = null;

client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("a3").collection("Webware");
  })
  .then(__collection => {
    // store reference to collection
    collection = __collection;
    // blank query returns all documents
    return collection.find({}).toArray();
  });

const userclient = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let usercollection = null;

userclient
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return userclient.db("a3").collection("Users");
  })
  .then(__usercollection => {
    // store reference to collection
    usercollection = __usercollection;
    // blank query returns all documents
    return usercollection.find({}).toArray();
  });

app.get("/", function(request, response) {
  response.sendFile("/index.html");
});

app.post("/init", function(request, response) {
  collection
    .find({})
    .toArray()
    .then(result => response.json(result));
});

app.post("/submit", function(request, response) {
  collection
    .insertOne(request.body)
    .then(collection.find({}).toArray())
    .then(result => response.json(result));
});

app.post("/delete", function(request, response) {
  collection
    .deleteOne({ _id: mongodb.ObjectId(request.body.id) })
    .then(collection.find({}).toArray())
    .then(result => response.json(result));
});

app.post("/modify", function(request, response) {
  collection
    .updateOne(
      { _id: mongodb.ObjectId(request.body.id) },
      { $set: { name: request.body.name } }
    )
    .then(collection.find({}).toArray())
    .then(result => response.json(result));
});

app.post("/signup", function(request, response) {
  usercollection
    .find({ user: request.body.user })
    .toArray()
    .then(array => finishsignup(response, array, request.body));
});

const finishsignup = function(response, array, body) {
  if (array.length === 0) {
    usercollection
      .insertOne(body)
      .then(usercollection.find({}).toArray())
      .then(result => response.json(result));
  } else {
    response.writeHeader(201, { "Content-Type": "application/json" });
    response.end();
  }
};

app.post("/login", function(request, response) {
  usercollection
    .find({ user: request.body.user })
    .toArray()
    .then(array => finishlogin(response, array, request.body));
});

const finishlogin = function(response, array, body) {
  if (array.length !== 0 && body.pass === array[0].pass) {
    response.writeHeader(202);
    response.end();
  } else {
    response.writeHeader(201);
    response.end();
  }
};

const sendFile = function(response, filename) {
  fs.readFile(filename, function(err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": "application/json" });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

app.listen(process.env.PORT || port);

