const MSG_ERROR_NAME_BLANK = "Task Name field is required.";
const MSG_ERROR_TASK = "both Priority and Due Date must be populated.";
const MSG_SUCCESS_ADD = "Successfully added a new task.";
const MSG_SUCCESS_MODIFY = "Successfully modified an existing task.";
const MSG_SUCCESS_DELETE = "Successfully deleted a task.";

const http = require("http"),
  fs = require("fs"),
  express = require("express"),
  bodyparser = require("body-parser"),
  compression = require("compression"),
  responseTime = require("response-time"),
  fetch = require("node-fetch"),
  cookieSession = require("cookie-session"),
  morgan = require("morgan"),
  passport = require("passport"),
  GitHubStrategy = require("passport-github").Strategy,
  app = express(),
  port = 3000;

//Middleware
app.use(cookieSession({ secret: process.env.COOKIE_SECRET }));
app.use(express.static("public"));
app.use(compression());
app.use(morgan("combined"));
app.use(
  responseTime((request, response, time) =>
    console.log(request.method, request.url, time + "ms")
  )
);
app.use(bodyparser.json());

//Setup MongoDB
require("dotenv").config();
const mongodb = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://rvyan2023:${process.env.MONGODB_PASSWORD}@cluster0.yiz7q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
/Assignment3?retryWrites=true&w=majority`;
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
    response.sendFile(__dirname + "/public/home.html");
  } else {
    response.sendFile(__dirname + "/public/login.html");
  }
});

//GitHub Login
app.get("/geturl", (request, response) => {
  const urlpath = "https://a3-rvyan2023.glitch.me/";
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

//GitHub callback
app.get("/login/github/callback", async (request, response) => {
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
    response.redirect("/login.html");
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
    response.message = MSG_ERROR_NAME_BLANK;
    console.log('###message-TaskName');
    console.log(response.message);
    return;
  }
  if (request.body.duedate==""||request.body.duedate==null||
      request.body.duedate==undefined) {
    response.message = MSG_ERROR_TASK;
    console.log('###message-DueDate');
    console.log(response.message);
    return;
  }
  
  const json = {
    githubid: request.session.GitHub_ID,
    taskname: request.body.taskname,
    priority: request.body.priority,
    duedate: request.body.duedate,
    remainingdays: request.body.remainingdays
  };

  console.log(json);
  //Find whether record exists
  collection
    .find({
      githubid: request.session.GitHub_ID,
      taskname: request.body.taskname
    })
    .toArray(function(err, result) {
      //Add if no found
      if (result == [] || result == "") {
        collection.insertOne(json).then(dbresponse => {
          response.json(dbresponse.ops[0]);
          response.json.message(MSG_SUCCESS_ADD);
        });
      } else {
        const newVal = {
          $set: {
            priority: request.body.priority,
            duedate: request.body.duedate,
            remainingdays: request.body.remainingdays
          }
        };
        console.log("###udpate");
        console.log(request.session.GitHub_ID);
        console.log(request.body.taskname);
        collection.updateOne(
          {
            githubid: request.session.GitHub_ID,
            taskname: request.body.taskname
          },
          newVal,
          (error, response) => {
            if (error) throw error;
            return;
            if (!error) {
              response.message = MSG_SUCCESS_MODIFY;
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
        response.message = MSG_SUCCESS_DELETE;
      });
  });
});

app.listen(process.env.PORT || port);