// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const mongodb = require("mongodb");
const helmet = require("helmet");
const bodyparser = require("body-parser");
const cookie = require("cookie-session");
const crypto = require("crypto");
const favicon = require("serve-favicon");
const path = require("path");

const app = express();

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

//add favicon
app.use(favicon(path.join(__dirname, "/", "favicon.ico")));

// code from https://github.com/cs4241-21a/cs4241-21a.github.io/blob/main/using_mongo.md
app.use(express.json());
app.use(bodyparser.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.listen(3000);

// https://expressjs.com/en/starter/basic-routing.html

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
app.get("/index.html", (request, response) => {
  response.redirect("/");
});

/*
  Database setup
*/
const uri =
  "mongodb+srv://" +
  process.env.USER +
  ":" +
  process.env.PASS +
  "@" +
  process.env.HOST;

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/*
  Functions for the login page
*/

let collectionLogin = null;

client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("webware-a3").collection("users");
  })
  .then(__collection => {
    // store reference to collection
    collectionLogin = __collection;
    // blank query returns all documents
    return collectionLogin.find({}).toArray();
  });

// cookie middleware!
// keys defined in Env
app.use(
  cookie({
    name: "session",
    keys: [process.env.KEY1, process.env.KEY2]
  })
);

app.get("/homepage.html", (request, response) => {
  if (request.session.login === true) {
    response.sendFile(__dirname + "/views/homepage.html");
  } else {
    response.redirect("/");
  }
});
//message pages
app.get("/welcome.html", (request, response) => {
  if (request.session.login === true) {
    response.sendFile(__dirname + "/views/welcome.html");
  } else {
    response.redirect("/");
  }
});
app.get("/oops.html", (request, response) => {
  if (!(request.session.login === true)) {
    response.sendFile(__dirname + "/views/oops.html");
  } else {
    response.redirect("/");
  }
});

app.post("/login", (request, response) => {
  //console.log( request.body )

  //create hashcode to compare
  const passHash = crypto
    .createHash("md5")
    .update(request.body.password)
    .digest("hex");

  //check for username in database
  collectionLogin
    .find({ username: request.body.username })
    .toArray()
    .then(query => {
      //console.log(query);
      if (query.length > 0) {
        //user exists; authenticate
        if(query[0].password == passHash){
          request.session.login = true;
          request.session.id = query[0]._id;
          response.redirect("homepage.html");
        }else{
          request.session.login = false;
          response.redirect("oops.html");
          //response.sendFile( __dirname + '/views/index.html' );
        }
      } else {
        //create account
        //alert("New login created for user " + request.body.username);
        request.body.password = passHash;
        collectionLogin.insertOne(request.body)
        .then(insert => {
          request.session.id = insert.insertedId;
          request.session.login = true;
          response.redirect("welcome.html");
        })
        
      }
    });
});


/*
  Functions for the homepage
*/
let collection = null;

client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("webware-a3").collection("webware-a3-collection");
  })
  .then(__collection => {
    // store reference to collection
    collection = __collection;
    // blank query returns all documents
    return collection.find({}).toArray();
  });

// send the data from mongodb to the webpage
app.get("/data", (request, response) => {
  // express helps us take JS objects and send them as JSON
  collection
    .find({userID:request.session.id})
    .toArray()
    .then(data => {
      response.json(data);
      //console.log(data);
      //console.log("request: data");
    });
});

app.post("/submit", bodyparser.json(), function(request, response) {
  //console.log("Submitting:")
  //console.log(request.body);
  request.body.userID = request.session.id;
  collection.insertOne(request.body).then(data => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
  });
});

app.delete("/removeEntry", bodyparser.json(), function(request, response) {
  //console.log(request.body);
  var id = request.body._id;
  collection.removeOne({ _id: mongodb.ObjectId(id) }).then(data => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
  });
});

app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});
