"use strict";
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const morgan = require("morgan");

const secrets = require("./secrets");


const app = express();
app.set("env", process.env.NODE_ENV || "development");
app.set("port", process.env.PORT || 3000);


const mongodb = require("mongodb");
const uri = 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.PASS + '@' + process.env.HOST
const dbClient = new mongodb.MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let dbCollection = null;

dbClient.connect()
    .then(() => dbClient.db("cluster0").collection("collection0"))
    .then(collection => {
        dbCollection = collection;
        return dbCollection.find({}).toArray();
    });

// Verify database connection
app.use((req, res, next) => {
    if (dbCollection !== null) {
        next();
    } else {
        res.status(503);
        res.send({error: "Database connection not ready"});
    }
});

// Init middleware
app.use(morgan("tiny"));
app.use(session(secrets));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    // Check if user is logged in before serving results page to avoid errors
    if (req.url.startsWith("/results") && !req.session.hasOwnProperty("username")) {
        console.log("redirecting to login");
        res.redirect("/login.html");
    } else {
        next();
    }
});

app.use(express.static("public"));

app.get("/", (_, res) => res.redirect("/login.html"));


function sendErr(res, error) {
    res.status(400);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({error}));
}

app.post("/auth/signup", (req, res) => {
    dbCollection.find({username: req.body.username})
        .toArray()
        .then(users => {
            if (users.length > 0) {
                sendErr(res, "Username is already taken");
            } else if (!req.body.username.match(/^[a-zA-Z0-9_]{5,30}$/g)) {
                sendErr(res, "Username must be alphanumeric between 5 and 30 characters");
            } else if (req.body.password.length < 5 || req.body.password.length > 60) {
                sendErr(res, "Password must be between 5 and 30 characters");
            } else {
                console.log("Creating new user ", req.body.username);
                req.session.username = req.body.username;
                dbCollection.insertOne({
                    username: req.body.username,
                    password: req.body.password,
                    counter: 6,
                    data: {
                        0: {"rank": 1, "username": "Dave23", "score": 342, "date": new Date().toISOString()},
                        3: {"rank": 2, "username": "Legend69", "score": 235, "date": new Date().toISOString()},
                        5: {"rank": 3, "username": "bob", "score": 111, "date": new Date().toISOString()},
                        4: {"rank": 4, "username": "Dave23", "score": 29, "date": new Date().toISOString()},
                    },
                }).then(() => res.redirect("/results.html"));
            }
        });
});

app.post("/auth/login", (req, res) => {
    dbCollection.find({
        username: req.body.username,
    })
        .toArray()
        .then(users => {
            if (users.length === 0) {
                sendErr(res, "Username not found");
            } else if (users.length > 1) {
                res.status(500);
                res.setHeader("Content-Type", "application/json");
                res.send(JSON.stringify({
                    error: "Multiple users found",
                }));
            } else if (users[0].password !== req.body.password) {
                sendErr(res, "Incorrect Password");
            } else {
                console.log("User logged in: ", req.body.username);
                req.session.username = req.body.username;
                res.redirect("/results.html");
            }
        });
});

app.get("/auth/logout", (req, res) => {
    if (req.session.hasOwnProperty("username")) {
        delete req.session.username;
    }

    res.redirect("/login.html");
});

// Deny access to api if not logged in
app.use((req, res, next) => {
    if (req.url.startsWith("/api") && !req.session.hasOwnProperty("username")) {
        sendErr(res, "Not logged in");
    } else {
        next();
    }
});

app.get("/api/values", (req, res) => {
    dbCollection.findOne({
        username: req.session.username,
    }).then(data => {
        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(data.data));
    });
});


app.post("/api/add", (req, res) => {
    if (!(req.body.hasOwnProperty("username") && req.body.hasOwnProperty("score"))) {
        sendErr(res, "Missing username and/or score from request");
        return
    }

    if (!(typeof req.body.score === "number" && (req.body.score | 0) === req.body.score)) {
        sendErr(res, "Score must be an integer value");
        return
    }

    if (!(typeof req.body.username === "string" && req.body.username.length > 0)) {
        sendErr(res, "Username must be a non-empty string value");
        return
    }

    dbCollection.findOne({
        username: req.session.username,
    }).then(data => {
        const addedField = {
            username: req.body.username,
            score: req.body.score,
            date: new Date().toISOString(),
        };

        const set = {
            counter: data.counter + 1,
        };

        set[`data.${data.counter}`] = addedField;

        dbCollection.updateOne(
            {_id: mongodb.ObjectId(data._id)},
            {$set: set}
        );

        // Update local copy to avoid querying database again
        data.data[data.counter] = addedField;

        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(data.data));
    });
});

app.post("/api/remove", (req, res) => {
    if (!(req.body.hasOwnProperty("id"))) {
        sendErr(res, "Missing id from request");
        return
    }

    dbCollection.findOne({
        username: req.session.username,
    }).then(data => {
        if (!data.data.hasOwnProperty(req.body.id)) {
            sendErr(res, "Row ID not found")
            return
        }

        const unset = {};
        unset[`data.${req.body.id}`] = "";

        dbCollection.updateOne(
            {_id: mongodb.ObjectId(data._id)},
            {$unset: unset},
        );

        // Update local copy to avoid querying database again
        delete data.data[req.body.id];

        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(data.data));
    });
});


app.post("/api/edit", (req, res) => {
    if (!(req.body.hasOwnProperty("id") && req.body.hasOwnProperty("username") && req.body.hasOwnProperty("score"))) {
        sendErr(res, "Missing username, score and/or id from request");
        return
    }

    if (!(typeof req.body.score === "number" && (req.body.score | 0) === req.body.score)) {
        sendErr(res, "Score must be an integer value");
        return
    }

    if (!(typeof req.body.username === "string" && req.body.username.length > 0)) {
        sendErr(res, "Username must be a non-empty string value");
        return
    }

    dbCollection.findOne({
        username: req.session.username,
    }).then(data => {
        if (!data.data.hasOwnProperty(req.body.id)) {
            sendErr(res, "Row ID not found")
            return
        }

        const updateTime = new Date().toISOString();

        const set = {};
        set[`data.${req.body.id}.username`] = req.body.username;
        set[`data.${req.body.id}.score`] = req.body.score;
        set[`data.${req.body.id}.date`] = updateTime;

        dbCollection.updateOne(
            {_id: mongodb.ObjectId(data._id)},
            {$set: set}
        );

        // Update local copy to avoid querying database again
        data.data[req.body.id] = {
            username: req.body.username,
            score: req.body.score,
            date: updateTime,
        };

        res.status(200);
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(data.data));
    });
});


module.exports = app;
