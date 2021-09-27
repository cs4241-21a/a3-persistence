const MSG_N_NAME = "PLease enter the name field.";
const MSG_N_EMPTY = "Failed to input both integral sets of data.";
const MSG_Y_CREATION = "A new task has been created.";
const MSG_Y_MOD = "An existing task has been modified.";
const MSG_Y_DELETION = "An existing task has been deleted.";

const http = require("http"),
  fs = require("fs"),
  express = require("express"),
  currentCookie = require("cookie-session"),
  bparse = require("body-parser"),
  compression = require("compression"),
  responseTime = require("response-time"),
  fetch = require("node-fetch"),
  morgan = require("morgan"),
  passport = require("passport"),
  GitHubStrategy = require("passport-github").Strategy,
  app = express(),
  port = 3000;

app.use(currentCookie({ secret: process.env.COOKIE_SECRET }));
app.use(express.static("public"));
app.use(compression());
app.use(morgan("combined"));
app.use(
  responseTime((request, response, time) =>
    console.log(request.method, request.url, time + "ms")
  )
);
app.use(bparse.json());

require("dotenv").config();
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://bobjoe:<password>@cluster0.3rqgc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(
  uri,
  { useNewUrlParser: true },
  { useUnifiedTopology: true }
);

let collection = null;
client.connect(err => {
  collection = client.db("Assignment3").collection("tasks");
});

app.get("/", (request, response) => {
  if (request.session.GitHub_ID) {
    response.sendFile(__dirname + "/public/index.html");
  } else {
    response.sendFile(__dirname + "/public/credentials.html");
  }
});

app.get("/geturl", (request, response) => {
  const urlpath = "https://a3-lplopez-wpi.glitch.me";
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENTID}&redirect_uri=${urlpath}/login/github/callback`;
  response.json(url);
});

async function getAccessToken(code, client_id, client_secret) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id,
      client_secret,
      code
    })
  }).then(response => response.text());

  const params = new URLSearchParams(response);
  return params.get("access_token");
}

async function getGitHubUser(accessToken) {
  const request = await fetch("https://api.github.com/user", {
    headers: { Authorization: `bearer ${accessToken}` }
  }).then(request => request.json());

  return request;
}

app.get("/credentials/github/callback", async (request, response) => {
  const accessToken = await getAccessToken(
    request.query.code,
    process.env.GITHUB_CLIENTID,
    process.env.GITHUB_SECRET
  );

  const githubData = await getGitHubUser(accessToken);

  if (githubData) {
    request.session.GitHub_ID = githubData.id;
    request.session.token = githubData.token;
    response.redirect("/");
  } else {
    response.redirect("/credentials.html");
  }
});

app.get("/appdata", (request, response) => {
  var array = [];
  collection
    .find({ githubid: request.session.GitHub_ID })
    .forEach(doc => {
      array.push(doc);
    })
    .then(() => {
      response.json(array);
    });
});

app.get("/logout", (request, response) => {
  request.session = null;
  response.clearCookie();
  response.redirect("/");
});

app.post("/submit", (request, response) => {
  if (request.body.taskname==""||request.body.taskname==null||
      request.body.taskname==undefined) {
    response.message = MSG_N_NAME;
    console.log('###message-TaskName');
    console.log(response.message);
    return;
  }
  if (request.body.duedate==""||request.body.duedate==null||
      request.body.duedate==undefined) {
    response.message = MSG_N_EMPTY;
    console.log('###message-DueDate');
    console.log(response.message);
    return;
  }
  
  const json = {
    githubid: request.session.GitHub_ID,
    movie: request.body.movie,
    media: request.body.media,
    duedate: request.body.duedate,
    remainingdays: request.body.remainingdays
  };

  console.log(json);
  collection
    .find({
      githubid: request.session.GitHub_ID,
      movie: request.body.movie
    })
    .toArray(function(err, result) {
      if (result == [] || result == "") {
        collection.insertOne(json).then(dbresponse => {
          response.json(dbresponse.ops[0]);
          response.json.message(MSG_Y_CREATION);
        });
      } else {
        const newVal = {
          $set: {
            media: request.body.media,
            duedate: request.body.duedate,
            remainingdays: request.body.remainingdays
          }
        };
        console.log("###udpate");
        console.log(request.session.GitHub_ID);
        console.log(request.body.movie);
        collection.updateOne(
          {
            githubid: request.session.GitHub_ID,
            movie: request.body.movie
          },
          newVal,
          (error, response) => {
            if (error) throw error;
            return;
            if (!error) {
              response.message = MSG_Y_MOD;
            }
          }
        );
      }
    });
});




app.post("/delete", (request, response) => {
  console.log("###delete");
  console.log(request.body._id);
  collection.deleteOne({ _id: mongodb.ObjectID(request.body._id) }).then(() => {
    var array = [];
    collection
      .find({ githubid: request.session.GitHub_ID })
      .forEach(doc => {
        array.push(doc);
      })
      .then(() => {
        response.json(array);
        response.message = MSG_Y_DELETION;
      });
  });
});

app.listen(process.env.PORT || port);