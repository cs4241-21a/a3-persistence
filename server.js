
const express = require("express"),
  mongodb = require("mongodb"),
  cookie = require("cookie-session"),
  bodyParser = require("body-parser"),
  serveFavicon = require("serve-favicon"),
  morgan = require('morgan'),
  serveStatic = require("serve-static"),
  app = express();

app.use(serveStatic('public'))
app.use(bodyParser.json());
app.use(serveFavicon(__dirname + '/assets/31e655bd-7c52-4869-a65b-dbc31f34a1e9%2Fplane.png?v=1632590892578'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.urlencoded({ extended: true }));
app.use(
  cookie({
    name: "session",
    keys: ["key1-3456346", "key2-575875"]
  })
);

const uri =
  "mongodb+srv://admin:admin123@cluster0.znzjt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let collection = null;
client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("locations").collection("userList");
  })
  .then(__collection => {
    // store reference to collection
    collection = __collection;
    // blank query returns all documents
    return collection.find({}).toArray();
  })



app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});

app.post("/login", (request, response) => {
  collection = client.db("locations").collection("userList");
  collection.findOne({ username: request.body.username }).then(result => {
    if (result === null) {
      //Save new user in users collection
      collection.insertOne(request.body);
      collection = client.db("locations").collection(request.body.username);
      request.session.login = true;
      response.redirect("main.html");
    } else {
      //Verify that the password matches in the password in database
      collection.findOne(request.body).then(result => {
        if (result === null) {
          request.session.login = false;
          response.redirect("failed-login.html")
        } else {
          collection = client.db("locations").collection(request.body.username);
          request.session.login = true;
          response.redirect("main.html");
        }
      });
    }
  });
});



app.post("/submit", (request, response) => {
  collection
    .insertOne(request.body)
    .then(result => {
      console.log(result.insertedId);
    })
    .then(async () => {
      collection
        .find()
        .toArray()
        .then(async result => {
          console.log("result", result);
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify(result));
        });
    });
});

app.post("/update",(request,response) => {
  
  collection
    .updateOne({_id:mongodb.ObjectId(request.body._id)}, 
               {$set:{location:request.body.location,cost:request.body.cost,priority:request.body.priority,rating:request.body.rating,visited:request.body.visited}})
  .then(async () => {
    collection
        .find()
        .toArray()
        .then(async result => {
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify(result));
        });
  })
})

app.post("/delete",(request,response) => {
  collection.deleteOne({_id:mongodb.ObjectId(request.body._id)})
  .then( async () => {
    collection
        .find()
        .toArray()
        .then(async result => {
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify(result));
        });
  })
})

app.get("/init",(request,response) => {
  collection
        .find()
        .toArray()
        .then(async result => {
          response.writeHead(200, { "Content-Type": "application/json" });
          response.end(JSON.stringify(result));
        });
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
