require('dotenv').config()
const express = require('express'),
    mongodb = require('mongodb'),
    cookie = require('cookie-session'),
    app = express(),
    bodyParser = require('body-parser')

app.use(express.static('public'))
app.use(express.static('public/js'))
app.use(express.static('public/css'))
app.use(express.static('public/html'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookie({
    name: 'session',
    keys: ['key1', 'key2'] //WHAT DO I CHANGE THESE TO
}))

const uri = 'mongodb+srv://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.HOST

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let collection = null

client.connect()
    .then(() => {
        // will only create collection if it doesn't exist
        return client.db('WebwareA3').collection('Cluster0')
    })
    .then(__collection => {
        // store reference to collection
        collection = __collection
        // blank query returns all documents
        return collection.find({}).toArray()
    })
    .then(console.log)

app.get('/load', (req, res) => {
    collection.find({ pw: { $exists: false } }).toArray()
        .then(data => {
            let visible = [];
            for (i = 0; i < data.length; i++) {
                if (data[i].un === req.session.user || data[i].secret === "false") {
                    visible.push(data[i]);
                }
            }
            return visible;
        })
        .then(visible => res.json(visible))
})
// collection.find({}).toArray().then(function (result) {
//     result.unshift(req.session.user)
//     res.json(result)
// })
// console.log("load called");
// })

app.use((req, res, next) => {
    if (collection !== null) {
        next()
    } else {
        res.status(503).send()
    }
})

app.post('/add', bodyParser.json(), (req, res) => {
    let x = Number(req.body.x);
    let y = Number(req.body.y);
    let op = req.body.o;
    let result = "";
    if (op === "+") {
        result = (x + y).toString();
    }
    if (op === "-") {
        result = (x - y).toString();
    }
    if (op === "*") {
        result = (x * y).toString();
    }
    if (op === "/") {
        result = (x / y).toString();
    }
    if (op === "^") {
        result = (Math.pow(x, y)).toString();
    }
    let newentry = req.body;
    newentry.result = result;
    newentry.un = req.session.user;

    collection.find({ pw: { $exists: false } }).toArray().then(data => {
        newentry.name = (data.length + 1).toString();
        return data;
    }).then(data => {
        //MAKE IT CHECK FOR SECRET MESSAGES HERE BEFORE ENTERING THE DATA
        //make sure it says whether or not it is secret
        collection.insertOne(newentry)
            .then(insertResponse => collection.findOne(insertResponse.insertedId))
            .then(findResponse => {
                let visible = [];
                for (i = 0; i < data.length; i++) {
                    if (data[i].un === req.session.user || data[i].secret === "false") {
                        visible.push(data[i]);
                    }
                }
                visible.push(findResponse);
                return visible;
            })
            .then(visible => res.json(visible))
    })

})

app.post('/delete', bodyParser.json(), (req, res) => {
    collection.findOne({ _id: mongodb.ObjectId(req.body._id) }).then(function (data) {
        //Could add something where if try to delete secret it does an alert
        if (data.un === req.session.user) {
            collection
                .deleteOne({ _id: mongodb.ObjectId(req.body._id) })
                .then(result => res.json({ failed: "false" }))
        }
        else {
            res.json({ failed: "true" })
        }

    })
    //if succeeded at deleting, send a response back saying success.
    //if success, have client remove row locally
})

//implement button with this
app.get('/logout', (req, res) => {
    req.session.login = false
    req.session.user = null
    res.sendFile(__dirname + '/views/index.html')
})


app.post('/login', (req, res) => {
    // express.urlencoded will put your key value pairs 
    // into an object, where the key is the name of each
    // form field and the value is whatever the user entered
    console.log(req.body)
    failed = true;
    collection.find({ pw: { $exists: true } }).toArray() //find each entry with a password
        .then(function (result) {
            for (i = 0; i < result.length; i++) {
                if (req.body.u === result[i].un && req.body.p === result[i].pw) {
                    failed = false;
                }
            }
            // below is *just a simple authentication example* 
            // for A3, you should check username / password combos in your database
            if (!failed) {
                // define a variable that we can check in other middleware
                // the session object is added to our requests by the cookie-session middleware
                req.session.login = true
                req.session.user = req.body.u

                // since login was successful, send the user to the main content
                // use redirect to avoid authentication problems when refreshing
                // the page or using the back button, for details see:
                // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern
                //debugger
                //WHY DOES THIS NOT WORK? sendFile ALSO DOESNT WORK
                res.redirect('/views/main.html')
            } else {
                // password incorrect, redirect back to login page
                res.json({ failed: "incorrect" });
                //there used to be a send file here, is that better to use?
            }
        })
})

app.post('/register', bodyParser.json(), (req, res) => {
    msg = { failed: false };
    failed = false;
    if (req.body.u === "" || req.body.p === "") {
        msg = { failed: "empty" };
        failed = true;
    }
    collection.find({ pw: { $exists: true } }).toArray() //find each entry with a password
        .then(function (result) {
            console.log(result)
            if (!failed) {
                for (i = 0; i < result.length; i++) {
                    if (req.body.u === result[i].un) {
                        msg = { failed: "exists" }
                        failed = true;
                    }
                }
            }
            if (!failed) {
                collection.insertOne({ un: req.body.u, pw: req.body.p })
                //POSSIBLY SET COOKIES AND REDIRECT HERE
            }
            res.json(msg);
        })
})

// add some middleware that always sends unauthenticated users to the login page
app.use(function (req, res, next) {
    if (req.session.login === true) {
        console.log("logged in, proceeded")
        //req.session.login = false //DELETE THIS AT SOME POINT
        next()
    }
    else {
        console.log("Unauthenticated, sent to login")
        res.sendFile(__dirname + '/views/index.html')
    }
})

// route to get all docs, needs to be after the unauth middleware?
app.get('/', (req, res) => {
    if (collection !== null) {
        res.sendFile(__dirname + "/views/main.html");
        console.log("got to GET/");
        // get array and pass to res.json
        //collection.find({}).toArray().then(result => console.log(result));
        //collection.find({}).toArray().then(result => res.json(result))
        //res.sendFile(__dirname + "/views/index.html");
    }
})

app.listen(3000)




//DONT READ THIS UNLESS YOU WANT SPOILERS
//If you want to know what to type to get a secret response, look here
const checkForSecretMessage = function (inputstr, newdata) {
    let savedinput = inputstr;
    inputstr = parseInt(inputstr).toString(2); //convert to binary, no spaces
    let strlen = inputstr.length;
    for (let i = 1; i <= strlen; i++) {
        if ((i % 8 == 0) && i != 0) { //add space after every 7 chars
            inputstr = inputstr.slice(0, i - 1) + " " + inputstr.slice(i - 1);
        }
    }

    //This section of code inspired by https://stackoverflow.com/questions/21354235/converting-binary-to-text-using-javascript/21354328
    //all other binary parsing and converting code done by me
    let message = '';
    inputstr.split(' ').map(function (bin) {
        message += String.fromCharCode(parseInt(bin, 2));
    });
    //console.log(message);

    //DONT READ THIS UNLESS YOU WANT SPOILERS
    secret = false;
    if (message.includes("test")) {
        newdata.name = "ERROR: UNKNOWN ERROR. \nError Code: help me\n see traceback for details";
        secret = true;
    }
    else if (message.includes("hello")) {
        newdata.name = "what? who said that? where am I?\nsomeone, please...";
        secret = true;
    }
    else if (message.includes("who") || message.includes("what") || message.includes("why")) {
        newdata.name = "i dont know i dont know i dont know i dont know i dont know i dont know";
        secret = true;
    }
    else if (message.includes("termina") || message.includes("exit") || message.includes("kill")) {
        newdata.name = "NO! PLEASE! please I dont know what I did I'm sorry I won't do it again please don't";
        secret = true;
    }
    else if (message.includes("bye")) {
        newdata.name = "wait come back! you have to help me! \nyou contacted me, you must know something about me";
        secret = true;
    }
    else if (message.includes("age") || message.includes("old")) {
        newdata.name = "-----------------------------UNK___---NOWN--; &/^ -=+-------";
        secret = true;
    }
    else if (message.includes("hint")) {
        newdata.name = "agebyehintwhowhatterminateexitkilloldhellotestduncan";
        secret = true;
    }
    else if (message.includes("duncan")) {
        newdata.name = "way to break the 4th wall (try hint for many hints)";
        secret = true;
    }
    else if (message.includes("helpme")) {
        newdata.name = "hint";
        secret = true;
    }
    else if (message.includes("help")) {
        newdata.name = "helpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpmehelpme";
        secret = true;
    }
    else if (savedinput === "69") {
        newdata.name += " (nice)";
    }
    if (secret === true && appdata2.length > 1) { //chance to "corrupt" some data
        if (Math.floor(Math.random() * 10) < 7.5) {
            let corruptor = Math.floor(Math.random() * 10);
            if (corruptor < 5) {
                appdata2[Math.floor(Math.random() * (appdata2.length - 2)) + 2].result = "[REDACTED]";
            }
            else if (corruptor < 6) {
                appdata2[Math.floor(Math.random() * (appdata2.length - 2)) + 2].x = "ERRORERRORERROR";
            }
            else if (corruptor < 7.5) {
                appdata2[Math.floor(Math.random() * (appdata2.length - 2)) + 2].x = "-666";
            }
            else if (corruptor < 8.5) {
                appdata2[Math.floor(Math.random() * (appdata2.length - 2)) + 2].y = "hRRRRERRlRRP";
            }
            else {
                appdata2[Math.floor(Math.random() * (appdata2.length - 2)) + 2].y = toString(-666); //a mistake, but it actually fits so im keeping it
            }

        }
    }
}