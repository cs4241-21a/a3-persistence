const express = require("express");
const bodyParser = require("body-parser");
const cookie = require("cookie-session");
const morgan = require("morgan");
const timeout = require("connect-timeout");
//const cookieParser = require("cookie-parser");
const { MongoClient } = require("mongodb");
const path = require("path");
const port = 3000;
const dbName = "test-a3-v1";
const url = "mongodb+srv://gdgarsson:xvedWs.6h%406JKXZ@cluster0.hvamq.mongodb.net/test-a3-v1?retryWrites=true&w=majority";
let currentuser = "";

const client = new MongoClient(url);
client.connect();

const app = express();
app.use(timeout('5s'));
app.use(bodyParser.json());
app.use(haltOnTimedout);
app.use(express.static('public'));
app.use(haltOnTimedout);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(haltOnTimedout);
app.use(cookie({
    name: "session",
    keys: ["username", "password"]
}));
app.use(haltOnTimedout);


morgan(':method :url :status :res[content-length] - :response-time ms');

app.get('/', function(req, res, next) {
    // Update views
    req.session.username = current

    // Write response
    res.end(req.session.views + ' views')
})


const getDatabaseData = async function(collectionName) {
    return client.db(dbName).collection(collectionName).find().toArray(function(err, res) {
        if (err) throw err;
        console.log(res);
        return res;
    });
}

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

app.post("/login", haltOnTimedout, async(req, res) => {
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
        console.log("Creating new account...")
        client.db(dbName).collection("loginstorage").insertOne({
            _id: ObjectId(),
            username: req.body.username,
            password: req.body.password,
            objs: []
        })
        req.session.username = req.body.username;
        res.redirect("/main.html");
    } else {
        req.session.username = req.body.username;
        console.log("Logged in successfully!");
        res.redirect("/main.html");
    }

});

app.get("/", haltOnTimedout, (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/submit", haltOnTimedout, async(req, res) => {
    console.log("Attemping submit");

    let temp = req.body;

    let obj = {
        username: req.session.username,
        name: temp.name,
        year: temp.year,
        major1: temp.major1,
        major2: temp.major2,
        minors: temp.minors,
        hobbies: temp.hobbies
    }

    await client.db(dbName).collection("userdata").insertOne(obj);

    client.db(dbName).collection("userdata").find({ username: req.session.username }).toArray().then(find => {
        res.json(find);
    })

})

app.get("/getusername", haltOnTimedout, (req, res) => {
    res.send(req.session.username);
})

app.post("/modify", haltOnTimedout, async(req, res) => {
    console.log("Attempting modification")
    let temp = req.body;

    let obj = {
        username: req.session.username,
        name: temp.name,
        year: temp.year,
        major1: temp.major1,
        major2: temp.major2,
        minors: temp.minors,
        hobbies: temp.hobbies
    }


    console.log("Modify: ");
    console.log(obj);

    await client.db(dbName).collection("userdata").findOneAndReplace({ username: obj.username, name: obj.name },
        obj);

    client.db(dbName).collection("userdata").find({ username: req.session.username }).toArray().then(find => {
        res.json(find);
    })
})

app.post("/delete", haltOnTimedout, async(req, res) => {
    let temp = req.body;

    let obj = {
        username: req.session.username,
        name: temp.name,
        year: temp.year,
        major1: temp.major1,
        major2: temp.major2,
        minors: temp.minors,
        hobbies: temp.hobbies
    }


    console.log("Delete: ");
    console.log(obj);

    await client.db(dbName).collection("userdata").deleteOne(obj);

    client.db(dbName).collection("userdata").find({ username: req.session.username }).toArray().then(find => {
        res.json(find);
    })
})

console.log(__dirname);

app.listen(port, function() {
    console.log("Listening on port " + port);
})

app.post("/getdata", haltOnTimedout, async function(req, res) {
    // const data = await client.db(dbName).collection("userdata").find({ username: req.session.username }).toArray().then(find => {
    //     res.json(find);
    // });
    const data = await client.db(dbName).collection("userdata").find({ username: req.session.username }).toArray((err, result) => {
        console.log(result)
        res.send(result);
    });
    // console.log(data);
    // res.send(data);
})

function haltOnTimedout(req, res, next) {
    if (!req.timedout) next()
}