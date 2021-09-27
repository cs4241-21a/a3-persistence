const express = require("express"),
  mongodb = require("mongodb"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  timeout = require("connect-timeout"),
  helmet = require("helmet"),
  response = require("response-time"),
  app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(timeout("10s"));
app.use(response());
app.use(haltOnTimedout);
app.use(helmet());
app.use(haltOnTimedout);
app.use(bodyParser());
app.use(haltOnTimedout);
morgan("tiny");
app.use(haltOnTimedout);

const mongoclient = mongodb.MongoClient;
const uri =
  "mongodb+srv://mike:" +
  process.env.MYPASSWORD +
  "@cluster0.guiga.mongodb.net/data?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let collection = null,
  user = null,
  userentries = null;

client
  .connect()
  .then(() => {
    return client.db("data").collection("a3");
  })
  .then(_collection => {
    collection = _collection;
    return collection.find({}).toArray();
  });

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get("/login.html", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get("/index.html", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/submit", bodyParser.json(), function(req, res) {
  req.body.username = user;

  let legalStatus = "No";
  if (req.body.name.length > 0) {
    if (req.body.age > 15 && req.body.license === "Drivers Permit")
      legalStatus = "Yes";
    if (req.body.license === "Drivers License" && req.body.age >= 18) {
      legalStatus = "Yes";
    }
  }
  req.body.legalDriver = legalStatus;
  collection
    .insertOne(req.body)
    .then(insertResponse => collection.findOne(insertResponse.insertedId))
    .then(findResponse => res.json(findResponse));
});

app.post("/update", (req, res) => {
  let legalStatus = "No";
  if (req.body.name.length > 0) {
    if (req.body.age > 15 && req.body.license === "Drivers Permit")
      legalStatus = "Yes";
    if (req.body.license === "Drivers License" && req.body.age >= 18) {
      legalStatus = "Yes";
    }
  }
  req.body.legalDriver = legalStatus;

  collection
    .updateOne(
      { _id: mongodb.ObjectId(req.body.id) },
      {
        $set: {
          name: req.body.name,
          age: req.body.age,
          license: req.body.license,
          legal: req.body.legalDriver
        }
      }
    )
    .then(result => res.json(result));
});

app.post("/remove", (req, res) => {
  collection
    .deleteOne({ _id: mongodb.ObjectId(req.body.id) })
    .then(result => res.json(result));
});

client.connect().then(() => {
  userentries = client.db("data").collection("a3");
});

app.get("/getDatabase", (req, res) => {
  if (collection !== null) {
    collection
      .find({ username: user })
      .toArray()
      .then(result => res.json(result));
  }
});

app.post("/login", bodyParser.json(), function(req, res) {
  userentries
    .find({ username: req.body.username, password: req.body.password })
    .toArray()
    .then(result => res.json(result));
  user = req.body.username;
});

app.post("/register", bodyParser.json(), function(req, res) {
  userentries
    .insertOne(req.body)
    .then(insertResponse => userentries.findOne(insertResponse.insertedId))
    .then(findResponse => res.json(findResponse));
  user = req.body.username;
});

app.post("/logout", bodyParser.json(), function(req, res) {
  user = null;
});

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

app.listen(process.env.PORT || 3000);
