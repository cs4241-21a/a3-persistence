const express = require("express"),
  mongodb = require("mongodb"),
  timeout = require("connect-timeout"),
  errorhandler = require("errorhandler"),
  compression = require("compression"),
  morgan = require("morgan"),
  cookie = require("cookie-session");
require("dotenv").config();
app = express();

const haltOnTimedout = function (req, res, next) {
  if (!req.timedout) next();
};

const errorNotification = function (err, str, req) {
  let title = "Error in " + req.method + " " + req.url;
  notifier.notify({
    title: title,
    message: str,
  });
};

app.use(timeout("5s"));
app.use(express.static("public"));
app.use(haltOnTimedout);
app.use(express.json());
app.use(haltOnTimedout);
if (process.env.NODE_ENV === "development") {
  app.use(errorhandler({ log: errorNotification }));
}
app.use(haltOnTimedout);
app.use(compression());
app.use(haltOnTimedout);
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
app.use(haltOnTimedout);
app.use(express.urlencoded({ extended: true }));
app.use(haltOnTimedout);
app.use(
  cookie({
    name: "session",
    keys: ["key1", "key2"],
  })
);
app.use(haltOnTimedout);

const uri = "mongodb+srv://" + process.env.USER + ":" + process.env.PASS + "@" + process.env.HOST;

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let collection = null;

app.post("/login", (req, res) => {
  const userParse = req.body.username;
  const passParse = req.body.password;
  let login = false;

  client
    .connect()
    .then(() => {
      return client.db("a3-database").collection("a3-data");
    })
    .then((__collection) => {
      collection = __collection;
      return collection.find({}).toArray();
    })
    .then((data) => {
      data.forEach((item) => {
        if (item.username === userParse && item.password === passParse) {
          login = true;
        }
      });
      if (login === true) {
        req.session.login = true;
        req.session.user = userParse;
        res.redirect("main.html");
      } else {
        res.sendFile(__dirname + "/public/login_failed.html");
      }
    });
});

app.use(function (req, res, next) {
  if (req.session.login === true) next();
  else res.sendFile(__dirname + "/public/index.html");
});

app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});

app.get("/load", (req, res) => {
  if (collection !== null) {
    collection
      .find({})
      .toArray()
      .then((data) => {
        return getUserData(data, req);
      })
      .then((result) => res.json(result));
  }
});

app.post("/add", (req, res) => {
  req.body.user = req.session.user;
  collection
    .insertOne(req.body)
    .then((response) => collection.find({}).toArray())
    .then((data) => {
      return getUserData(data, req);
    })
    .then((result) => res.json(result));
});

app.post("/remove", (req, res) => {
  collection
    .deleteOne({ _id: mongodb.ObjectId(req.body._id) })
    .then((response) => collection.find({}).toArray())
    .then((data) => {
      return getUserData(data, req);
    })
    .then((result) => res.json(result));
});

app.post("/edit", (req, res) => {
  collection
    .updateOne(
      { _id: mongodb.ObjectId(req.body._id) },
      {
        $set: {
          name: req.body.name,
          ticker: req.body.ticker,
          exchange: req.body.exchange,
          risk: req.body.risk,
          price: req.body.price,
          shares: req.body.shares,
          invested: req.body.invested,
          user: req.session.user,
        },
      }
    )
    .then((response) => collection.find({}).toArray())
    .then((data) => {
      return getUserData(data, req);
    })
    .then((result) => res.json(result));
});

const getUserData = function (data, req) {
  appdata = [];
  data.forEach((item) => {
    if (item.user === req.session.user) {
      appdata.push(item);
    }
  });
  return appdata;
};

app.listen(3000);
