// server.js
// where your node app starts

// using ExpressJS
const express = require("express");
const app = express();
const bodyParser = require("body-parser"); // middleware
const cookie = require("cookie-session");
const morgan = require('morgan');
const compression = require('compression');
const helmet = require("helmet");
var responseTime = require('response-time');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(responseTime());

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://palomagonzalez:${process.env.DBPASSWORD}@cluster0.axlpm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let collection = null;
let users = null;
client.connect(err => {
  collection = client.db("a3_db").collection("bucketlist");
  users = client.db("a3_db").collection("users");
});

app.use(express.static("public"))

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

app.use(
  cookie({
    name: "session",
    keys: ["key1", "key2"]
  })
);

app.post("/login", (req, res) => {
  // express.urlencoded will put your key value pairs
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log("hello" + JSON.stringify(req.body));
  
  
  
  users
      .find({username : req.body.username,
            password : req.body.password})
      .toArray()
      .then(result => {
    //console.log("user found succesfully!")
    
    
    if(result.length > 0){
        console.log("login succesful")
        req.session.login = true
        req.session.user = req.body.username
        console.log(req.session.user)
        res.redirect("/views/main.html")
      } else {
        console.log("login unsuccessful")
        res.sendFile(__dirname + "/views/index.html");
      }
  
  });
      
    
  
  
    
  //} else {
    // password incorrect, redirect back to login page
  //  res.sendFile(__dirname + "/views/index.html");
 //}
  
});

// add some middleware that always sends unauthenicaetd users to the login page
/*
app.use(function(req, res, next) {
  if (req.session.login === true) next();
  else res.sendFile(__dirname + "/views/index.html");
});
*/

// route to get all docs
app.post("/getdata", (req, res) => {
  console.log(req.session.user)
  if (collection !== null) {
    // get array and pass to res.json
    collection
      .find({username : req.session.user})
      .toArray()
      .then(result => res.json(result));
  }
});

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
  
});

app.get("/index.html", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
  
});

app.get("/views/main.html", (request, response) => {
  response.sendFile(__dirname + "/views/main.html");
  
});

app.get("/public/script.js", (request, response) => {
  response.sendFile(__dirname + "/public/script.js");
  
});

app.get("/public/loginscript.js", (request, response) => {
  response.sendFile(__dirname + "/public/loginscript.js");
  
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

app.post("/add", bodyParser.json(), (request, response) => {
  //dreams.push(request.body.dream)
  //response.json(request.body)
  let addObj = request.body
  addObj.username = request.session.user
  collection.insertOne(addObj).then(data => {
  
    collection
      .find({_id : data.insertedId})
      .toArray()
      .then(result => response.json(result));
  
  });
  
});

app.post("/delete", bodyParser.json(), (request, response) => {
  console.log(request.body._id)
   collection
    .deleteOne({ _id:mongodb.ObjectId( request.body.id ) })
    .then( result => response.json( result ) )
})

app.post("/edit", bodyParser.json(), (request, response) => {
  
  console.log(request.body)
  
   collection
      .updateOne(
     {_id : mongodb.ObjectId( request.body.id )},
     {$set: {dream : request.body.newData.dream,
            dreamtime : request.body.newData.dreamtime,
            dreampriority: request.body.newData.dreampriority}})
     .then(result => response.json({status: 'updated'}))
    
})

app.post("/getdream", bodyParser.json() , (req, res) => {
    // get array and pass to res.json
    collection
      .find({_id : mongodb.ObjectId(req.body.id)})
      .toArray()
      .then(result => {
      console.log(result,req.body.id)
      res.json(result)});
  
});




// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
