const express = require("express");
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const path = require('path');

const app = express();
const port = 3000

const events = [];

// Middleware 1 - Cookie Parsing
app.use(cookieParser(cookieParser));

// Middleware 2 - Serve Static files
app.use(serveStatic(path.join(__dirname, 'public')));

// Middleware 3 - Serve Favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Middleware 4 - Get JSON when appropriate
app.use(bodyParser.json());

// Middleware 5 - (Custom) User Authentication (After login GET)
app.get("/login", (request, response) => {
  if (request.query["username"] && request.query["password"]) {
    response.cookie("uid", request.query["username"],  { expires: new Date(Date.now() + 2 * 3600000) });
    response.redirect("/");
  } else {
    response.clearCookie("uid");
    response.sendFile(__dirname + "/views/login.html");
  }
});

app.use((request, response, next) => {
  uid = request.cookies["uid"];
  if (uid === undefined) {
    console.log("REDIRECTED");
    response.redirect("/login");
  }
  next();
});

// Basic Routes
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/events", (request, response) => {
  response.json(events);
});

app.post('/submit', (request, response) => {
  if (request.body.index > events.length - 1) {
    events.push(request.body.item);
  } else if (request.body.item === undefined) {
    events.splice(request.body.index, 1);
  } else {
    events[request.body.index] = request.body.item;
  }
  response.writeHead( 200, { 'Content-Type': 'application/json'});
  response.end(JSON.stringify(events));
})

const listener = app.listen(process.env.PORT || port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
