require('dotenv').config()

const express = require("express");
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const path = require('path');

const mongodb = require('mongodb');

const app = express();
const port = 3000

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST;
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });
let collection = null;
let currentCollectionId = null;

const connectToCollection = (collectionId) => {
  return client.connect()
  .then( () => {
    return client.db(process.env.DATABASE).collection(collectionId);
  })
  .then( __collection => {
    collection = __collection;
    currentCollectionId = collectionId;
    return collection.find({}).toArray();
  });
}

// Middleware 1 - Cookie Parsing
app.use(cookieParser(cookieParser));

// Middleware 2 - Serve Static files
app.use(serveStatic(path.join(__dirname, 'public')));

// Middleware 3 - Serve Favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Middleware 4 - Get JSON when appropriate
app.use(bodyParser.json());

app.get("/login", async (request, response) => {
  const uid = await authenticate(request, response);

  if (uid === null) {
    response.clearCookie("uid");
    response.sendFile(__dirname + "/views/login.html");
  } else {
    response.cookie("uid", uid.toString(), { expires: new Date(Date.now() + 2 * 3600000)});
    await connectToCollection(uid.toString());
    response.redirect("/");
  }
});

const authenticate = async (request, response) => {
  const username = request.query["username"];
  const password = request.query["password"];

  if (currentCollectionId !== process.env.AUTH_COLLECTION) {
    await connectToCollection(process.env.AUTH_COLLECTION);
  }
  
  if (!username || !password) return null;

  const result = await collection.findOne({"username": username})

  if (result !== null) {
    // Authenticate Returning User
    if (password === result.password) {
      return result._id;
    } else {
      // Incorrect Password
      response.cookie("alert", "Incorrect password.");
      return null;
    }
  } else {
    // New User
    response.cookie("alert", `Created a new account for ${username}.`);
    const resultInsert = await collection.insertOne({"username": username, "password": password})
    return resultInsert;
  }
}

// Middleware 5 - (Custom) User Authentication
app.use((request, response, next) => {
  const uid = request.cookies["uid"];
  if (uid === undefined) {
    response.redirect("/login");
  }
  next();
});

// Middleware 6 - (Custom) DB Status
app.use((req,res,next) => {
  if (collection !== null ) {
    next();
  } else {
    res.status( 503 ).send();
  }
});

// Basic Routes
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get( '/db', (req, res) => {
  if (collection !== null) collection.find({}).toArray().then(result => res.json(result));
})

app.post('/create', (request, response) => {
  collection.insertOne(request.body.item)
  .then(result => response.json({id: result.insertedId}));
});

app.post('/update', (request, response) => {
  collection.updateOne(
    {"_id": mongodb.ObjectId(request.body.id)},
    {$set: request.body.item}
  ).then(result => response.json({id: request.body.id}));
});

app.post('/delete', (request, response) => {
  collection.deleteOne(
    {"_id": mongodb.ObjectId(request.body.id)}
  ).then(result => response.json(result));
})

const listener = app.listen(process.env.PORT || port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
