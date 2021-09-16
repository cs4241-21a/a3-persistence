const { report } = require("process"),
  express = require("express"),
  mongodb = require("mongodb"),
  app = express(),
  timeout = require("connect-timeout"),
  // Github login information
  passport = require("passport"),
  GitHubStrategy = require("passport-github").Strategy,
  session = require("express-session"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  dir = "public/",
  port = 3000,
  path = require("path"),
  cors = require("cors"),
  morgan = require("morgan");

app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

// Creates session information needed to keep track of users
app.use(
  session({
    secret: "superSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initializes passport
app.use(passport.initialize());

// Starts the passport session
app.use(passport.session());

// Serialize the user
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

// Deserialize the user
passport.deserializeUser(function (id, cb) {
  cb(null, id);
});

// The Github strategy and connection we are using for Github OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: "af506d93ad7d9a859f05",
      clientSecret: "7b2e9570a51a19bab0ab6d46dfc9ce23adb8520a",
      callbackURL: "http://127.0.0.1:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      cb(null, profile);
    }
  )
);

// TODO Make these env variables
const uri =
  "mongodb+srv://" +
  "test_user" +
  ":" +
  "tester_user_pw" +
  "@" +
  "cluster0.dpk53.mongodb.net/";

// Client representing the database
const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware used to check if the user has logged in or not
const userIsAuthorized = (req, res, next) => {
  if (req.user) {
    console.log(__dirname);
    next();
  } else {
    console.log(__dirname);
    res.redirect("/");
  }
};

// The collection we are connected to in mongodb
let collection = null;

// Connects the client and sets up the collection
client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("Assignment3DB").collection("test_08");
  })
  .then((__collection) => {
    // store reference to collection
    collection = __collection;
  });

// Get request for both possible forum_page links, only allow is authorized
app.get(
  ["/public/html/forum_page.html", "/html/forum_page.html"],
  userIsAuthorized,
  (req, res) => {
    sendFile(res, "public/html/forum_page.html");
  }
);

// route to get index page, only allowed if not logged in
app.get("/", (req, res) => {
  if (req.user != undefined) {
    return res.redirect("public/html/forum_page.html");
  }
  sendFile(res, "public/index.html");
});

// Logs the user out
app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

// Adds a route for Github Authentication
app.get("/auth/github", passport.authenticate("github"));

// Adds the callback after Github Authentication works
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log("I successfully go to the right page! ");
    console.log(req.user.id);
    res.redirect(302, "../../public/html/forum_page.html");
  }
);

// Sets the default timeout and adds middleware function
app.use(timeout("5s"));
app.use(haltOnTimedout);

// Middleware timeout function
function haltOnTimedout(req, res, next) {
  if (!req.timedout) {
    next();
  } else {
    console.log("\n\nRequest timed out!\n\n");

    response.writeHead(408, "Request Timed Out", {
      "Content-Type": "text/plain",
    });

    // Sends forum data back to front end
    response.end();
  }
}

// Handles adding an item to the forum
app.post("/submit", function (request, response) {
  console.log("\n\nNEW POST DATA REQUEST");

  // Stores the data we read in
  let dataString = "";
  // Stores the new student we are adding
  let new_student = "";

  request.on("data", async function (data) {
    dataString += data;

    let dataStringParsed = JSON.parse(dataString);

    let studentHours = getStudentHours(dataStringParsed.StudentRole);

    // Make the new student
    new_student = {
      StudentName: dataStringParsed.StudentName,
      StudentClass: dataStringParsed.StudentClass,
      StudentRole: dataStringParsed.StudentRole,
      StudentHours: studentHours,
      GitHubUserID: request.user,
      StudentYear: dataStringParsed.StudentYear,
    };

    // Insert it into the database
    mongo_db_promise = collection.insertOne(new_student);
  });

  request.on("end", async function () {
    // Wait for the data to be added to the datebase
    await mongo_db_promise;

    // Stores the entire collection
    let dbData = undefined;

    // Fetch the most up to date version of the data
    dbDataPromise = collection
      .find({ GitHubUserID: request.user })
      .toArray()
      .then((newData) => (dbData = newData));

    // Wait for the new data to be fetched
    await dbDataPromise;

    console.log("dbData");
    console.log(dbData);

    const stringDBData = JSON.stringify(dbData);
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });

    // Sends forum data back to front end
    response.end(stringDBData);
  });
});

// Handles deleting an item from the forum
app.post("/deleteEntry", function (request, response) {
  let dataString = "";

  let delete_promise = undefined;

  request.on("data", async function (data) {
    console.log("\n\nNEW DELETE DATA REQUEST");

    dataString += data;

    let dataStringParsed = JSON.parse(dataString);

    // Delete the item from the database
    delete_promise = collection.deleteOne(newIDEntry(dataStringParsed));
  });

  request.on("end", async function () {
    // Wait for the delete to finish
    await delete_promise;

    let dbData = undefined;

    // Fetch up to date data
    dbDataPromise = collection
      .find({ GitHubUserID: request.user })
      .toArray()
      .then((newData) => (dbData = newData));

    await dbDataPromise;

    console.log("dbData");
    console.log(dbData);

    const stringDBData = JSON.stringify(dbData);
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });

    // Sends forum data back to front end
    response.end(stringDBData);
  });
});

// Function used to make a newIDEntry {Key: Object} combo, allows cleaner code
function newIDEntry(dataStringParsed) {
  return { _id: mongodb.ObjectId(dataStringParsed._id) };
}

// Handles updating an item in the forum
app.post("/updateEntry", function (request, response) {
  let dataString = "";

  let updatePromise = undefined;

  request.on("data", function (data) {
    dataString += data;

    console.log("\n\nNEW UPDATE DATA REQUEST");

    let dataStringParsed = JSON.parse(dataString);

    let studentHours = getStudentHours(dataStringParsed.StudentRole);

    // Make a new student
    new_student = {
      StudentName: dataStringParsed.StudentName,
      StudentClass: dataStringParsed.StudentClass,
      StudentRole: dataStringParsed.StudentRole,
      StudentHours: studentHours,
      GitHubUserID: request.user,
      StudentYear: dataStringParsed.StudentYear,
    };

    // Update the entry with the same id in the database
    updatePromise = collection.updateOne(newIDEntry(dataStringParsed), {
      $set: new_student,
    });
  });

  request.on("end", async function () {
    // Wait for the update to finish
    await updatePromise;

    let dbData = undefined;

    // Fetch the new data
    dbDataPromise = collection
      .find({ GitHubUserID: request.user })
      .toArray()
      .then((newData) => (dbData = newData));

    await dbDataPromise;

    console.log("dbData");
    console.log(dbData);

    const stringDBData = JSON.stringify(dbData);
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });

    // Sends forum data back to front end
    response.end(stringDBData);
  });
});

// Handles the get request where we get all forum data
app.post("/initializeData", async function (request, response) {
  console.log("\n\nNEW GET INITIAL DATA REQUEST");

  console.log("User");
  console.log(request.user);

  let dbData = undefined;

  // Fetch the new up to date data
  dbDataPromise = collection
    .find({ GitHubUserID: request.user })
    .toArray()
    .then((newData) => (dbData = newData));

  await dbDataPromise;

  console.log("dbData");
  console.log(dbData);

  const stringDBData = JSON.stringify(dbData);
  response.writeHead(200, "OK", { "Content-Type": "text/plain" });
  // Sends forum data back to front end
  response.end(stringDBData);
});

// Handles sending a file over to the front end
const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
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

// Lists on the respective port for the server
app.listen(process.env.PORT || port);

// Function that converts student role to hours per week
function getStudentHours(studentRole) {
  if (studentRole === "SA") {
    return 10;
  } else if (studentRole === "TA" || studentRole === "GLA") {
    return 20;
  } else {
    return -1;
  }
}

app.use(express.static("public"));
