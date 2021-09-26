// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookie = require("cookie-session");
const helmet = require("helmet");

//doesn't play nice with glitch, doesn't work
var favicon = require('serve-favicon');
var path = require('path');

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(bodyParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookie({
    name: "session",
    keys: ["cookey1", "cookey2"]
  })
);
app.use(helmet());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


const uri = `mongodb+srv://a3user:${process.env.DBPASS}@cluster0.qzrs3.mongodb.net/a3users?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let collection = null;
client.connect(err => {
  collection = client.db("a3users").collection("userbase");
});

app.post("/register", bodyParser.json(), (request, response) => {
  console.log("register");

  collection
    .find({ username: request.body.username })
    .toArray()
    .then(result => {
      if (result.length >= 1) {
        //user exists already, do nothing, maybe alert that they already exist
        //console.log("user exists!")
        response.json({ login: false });
      } else {
        //user does not exist, create
        let newUser = {
          username: request.body.username,
          password: request.body.password,
          pets: []
        };

        console.log(newUser);
        collection.insertOne(newUser);
        collection.insertOne(newUser);

        //now redirect to user page
        console.log("registering");
        request.session.username = request.body.username;
        request.session.login = true;
        response.json({ login: true });
      }
    });
});

app.post("/login", bodyParser.json(), (request, response) => {
  collection
    .find({ username: request.body.username, password: request.body.password })
    .toArray()
    .then(result => {
      if (result.length >= 1) {
        //log in, redirect
        //console.log("logging in")
        request.session.username = request.body.username;
        request.session.login = true;

        //console.log(request.session.username)
        //console.log(request.session)

        response.json({ login: true });
      } else {
        //console.log("invalid login")
        response.json({ login: false });
      }
    });
});

app.post("/logout", bodyParser.json(), (request, response) => {
  if (request.session.login == true) {
    request.session.username = "";
    request.session.login = false;

    response.json({ logout: true });
  }else{
    response.json({ logout: false })
  }
});

app.post("/delete", bodyParser.json(), (request, response) => {
  //delete object of specified ID
  //get ID via stored/correlated user data on server

  collection
    .find({ username: request.body.username, password: request.body.password })
    .toArray()
    .then(result => {
      if (result.length >= 1) {
        //log in, redirect
        //console.log("Removing user")

        //yes, I know it's inefficient
        collection.deleteOne({
          username: request.body.username,
          password: request.body.password
        });

        response.json({ deleted: true });
      } else {
        //console.log("Invalid credentials")
        response.json({ deleted: false });
      }
    });

  //collection
  //  .deleteOne({ _id: mongodb.ObjectId(request.body._id) })
  //  .then(result => response.json(result));
});

app.post("/erase", bodyParser.json(), (request, response) => {
  //erase all entries in collection, exists for debug purposes - not actually used anywhere
  collection.deleteMany({});
});

app.post("/submitpet", bodyParser.json(), (request, response) => {
  collection
    .find({ username: request.session.username })
    .toArray()
    .then(result => {
      //create new pets array
      let pets = result[0].pets;
      pets.push({
        petname: request.body.petname,
        petage: request.body.petage,
        animaltype: request.body.animaltype
      });

      collection.updateOne(
        { _id: mongodb.ObjectId(result[0]._id) },
        { $set: { pets: pets } }
      );

      //send back updated list of pets to be displayed
      response.json(pets);
    });
});

app.post("/updatepet", bodyParser.json(), (request, response) => {
  //format the editable fields into json format, add to db, display updated data
  //check if pet exists
  //if so, update
  //if not, error, let client know pet doesnt exist
  collection
    .find({ username: request.session.username })
    .toArray()
    .then(result => {
      //create new pets array
      let pets = result[0].pets;

      console.log(request.body);

      let updatedPet = {
        petname: request.body.petname,
        petage: request.body.petage,
        animaltype: request.body.animaltype
      };

      if (pets[request.body.index]) {
        pets[request.body.index] = updatedPet;
      }

      collection.updateOne(
        { _id: mongodb.ObjectId(result[0]._id) },
        { $set: { pets: pets } }
      );

      //send back updated list of pets to be displayed
      response.json(pets);
    });
});

app.post("/deletepet", bodyParser.json(), (request, response) => {
  collection
    .find({ username: request.session.username })
    .toArray()
    .then(result => {
      //create new pets array
      let pets = result[0].pets;

      if (pets[request.body.index]) {
        pets.splice(request.body.index, 1);
      }

      collection.updateOne(
        { _id: mongodb.ObjectId(result[0]._id) },
        { $set: { pets: pets } }
      );

      //send back updated list of pets to be displayed
      response.json(pets);
    });
});

app.get("/getuserinfo", bodyParser.json(), (request, response) => {
  //get all associated info for a user, checked via cookie
  //if invalid value then alert
  //if valid populate page
  //maybe have the check be a separate function, would make more sense to be separate
  console.log(request.session.login);
  response.json({ username: request.session.username });
});

app.get("/getuserpets", bodyParser.json(), (request, response) => {
  collection
    .find({ username: request.session.username })
    .toArray()
    .then(result => {
      //create new pets array
      let pets = result[0].pets;

      //send back updated list of pets to be displayed
      response.json(pets);
    });
});

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/userpage", (request, response) => {
  response.sendFile(__dirname + "/views/userpage.html");
});

// add some middleware that always sends unauthenicaetd users to the login page
app.use(function(req, res, next) {
  if (req.session.login === true) next();
  else res.sendFile(__dirname + "/public/index.html");
});

// listen for requests :)
app.listen(3000);
