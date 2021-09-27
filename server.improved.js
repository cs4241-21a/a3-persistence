const express = require("express");
const bodyparser = require("body-parser");
const mongodb = require("mongodb");

const app = express();
app.use(express.static("public"));
app.use(express.json());

const MongoClient = mongodb.MongoClient;

const uri = "mongodb+srv://" + process.env.USER + ":" + process.env.PASS + "@" + process.env.HOST + "/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let collection = null;
client.connect(err => {
  collection = client.db("dataset").collection("scores")
});
  
app.get('/', (req,res) => {
  if( collection !== null ) {
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})

app.post('/submit', bodyparser.json(), function(req, res) {
  console.log("body: ", req.body);
  collection.insertOne(req.body).then(dbresponse => {
    console.log(dbresponse);
    res.json(dbresponse.ops[0]);
  });
});

app.post('/update', bodyparser.json(), function(req, res) {
  console.log("update body:", req.body);
  collection
    .updateOne({ _id: mongodb.ObjectId(req.body._id) })
    .then(result => res.json(result));
});

app.post('/delete', bodyparser.json(), function(req, res) {
  console.log("delete body:", req.body);
  collection
    .deleteOne({ _id: mongodb.ObjectID(req.body._id) })
    .then(result => res.json(result));
});

app.post('/login', bodyparser.json(), function(req,res) {
  console.log( req.body )
  
  collection.findOne({ username: req.body.username }).then(result => {
    if(result !== null) {
      if(result.password === req.body.password) {
        req.session.login = true
        req.session.username = req.body.username;
        
        res.redirect('index.html');
      }else{
        res.status(403);
      }
    }else{
      res.status(403);
    }
  });
});

app.post( '/signup', bodyparser.json(), (req,res)=> {

  let data = {
    username: req.body.username,
    password: req.body.password,
    scores: []
  }

  collection.findOne({ username: req.body.username }).then(result => {
    if(result === null){
      collection.insertOne(data).then(result => {
        console.log(result);
        // this is just a guess on how to check if it was successful
        if(result.acknowledged && result.insertedId !== null) {
          req.session.login = true
          req.session.username = req.body.username;

          res.redirect('index.html');
        }
      });
    }else{
      res.status(403);
    }
  });
  });

  
const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  dir = "public/",
  port = 3000;

const server = http.createServer(function(request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function(request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/login.html");
  } else {
    sendFile(response, filename);
  }
};

let scores = [];

function sortGreatest(a, b) {
  return a - b;
}

function handleInput(input) {

  let score = {
    place: input.place,
    username: input.yourname,
    highscore: input.yourscore,
    difference: input.difference
  };

  scores.push(score);

  scores.sort(function(obj1, obj2) {
    // Ascending: first age less than the previous
    return obj2.highscore - obj1.highscore;
  });

  //Derived Field
  for (let i = 0; i < scores.length; i++) {
    scores[i].difference = scores[i].highscore - scores[0].highscore;
  }

  return;
}

const handlePost = function(request, response) {
  let jsonReply = {};

  request.on("data", function(data) {
    handleInput(JSON.parse(data));

    jsonReply.scores = scores;
  });

  request.on("end", function() {
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(jsonReply));
  });
};

const sendFile = function(response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function(err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
  