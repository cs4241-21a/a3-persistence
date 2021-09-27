const express = require("express");
const bodyParser = require("body-parser");
//const cookie = require("cookie-session");
//const cookieParser = require("cookie-parser");
const { MongoClient } = require("mongodb");
const path = require("path");
const port = 3000;
const dbName = "test-a3-v1"
const url = "mongodb+srv://gdgarsson:xvedWs.6h%406JKXZ@cluster0.hvamq.mongodb.net/test-a3-v1?retryWrites=true&w=majority";

const client = new MongoClient(url);
client.connect();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
/*app.use(cookie({
    name: "session",
    keys: ["username", "password"]
}));*/


/*const objs = []
const ggars = {
    name: "Geoffrey Garsson",
    year: 2023,
    major1: "IMGD-Tech",
    major2: "None",
    hobbies: ["Music", "Game Development", "Martial Arts", "Singing"]
};
const trumbus = {
    name: "Trumbus",
    year: 0,
    major1: "IMGD-Tech",
    major2: "IMGD-Art",
    hobbies: ["Memes", "Game Development"]
};

objs.push(ggars);
objs.push(trumbus);*/

const getDatabaseData = async function(collectionName) {
    return client.db(dbName).collection(collectionName).find().toArray(function(err, res) {
        if (err) throw err;
        console.log(res);
        return res;
    });
}

app.post("/submit", async(req, res) => {

})

//getDatabaseData("userdata");

// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     let dbo = db.db(dbName);
//     //let myobj = ggars;

//     dbo.collection("userdata").find().toArray(function(err, res) {
//         if (err) throw err;
//         console.log(res);
//         db.close();
//     });
//     /*dbo.collection("userdata").insertOne(myobj, function(err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//     });*/
// });

app.post("/login", async(req, res) => {
    console.log(req.body)
    console.log(req.body.username);

    let loggedin = false;
    await client.db(dbName).collection("loginstorage").find({
        username: req.body.username,
        password: req.body.password
    }).toArray().then((res, err) => {
        if (err) throw err;
        loggedin = true;
    });

    if (!loggedin) {
        console.log("Log in failed: username or password was incorrect");
    } else {
        console.log("Logged in successfully!");
        res.redirect("/main.html");
    }

});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

console.log(__dirname);

app.listen(port, function() {
    console.log("Listening on port " + port);
})