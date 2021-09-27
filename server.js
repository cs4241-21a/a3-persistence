const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const app = express();
const dotenv = require("dotenv").config();
const cookie = require("cookie-session");

var favicon = require("serve-favicon");
var path = require("path");

//req for server set
require("dotenv").config();
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use(express.static("public"));
app.use(express.json());

//this freezed glitch so i said screw it but it works fine in theory
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

const uri =
  "mongodb+srv://" +
  process.env.USER +
  ":" +
  process.env.PASS +
  "@" +
  process.env.HOST;

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });

let userColl = null;
let user = null;

client.connect(err => {
  userColl = client.db("a3acaira").collection("users");
});

app.post("/login", bodyParser.json(), function(req, res) {
  userColl
    .find({ username: req.body.username, password: req.body.password })
    .toArray()
    .then(result => res.json(result));
  user = req.body.username;
});

app.post("/register", bodyParser.json(), function(req, res) {
  userColl
    .insertOne(req.body)
    .then(insertResponse => userColl.findOne(insertResponse.insertedId))
    .then(findResponse => res.json(findResponse));
  user = req.body.username;
  console.log("beep usermade");
});

app.get("/loggedin", (req, res) => {
  res.sendFile(__dirname + "/views/loggedin.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.listen(3000, function() {
  console.log("Listening on port 3000...");
});
