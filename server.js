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
    collection.find({}).toArray().then(result => res.json(result))
    console.log("load called");
})

app.use((req, res, next) => {
    if (collection !== null) {
        next()
    } else {
        res.status(503).send()
    }
})

app.post('/add', bodyParser.json(), (req, res) => {
    // assumes only one object to insert
    console.log(JSON.stringify(req.body))
    console.log(res)
    debugger
    console.log("ADD", req, req.body)
    //NEED TO PERFORM THE PROCESSING ON THE BODY.
    //im going to want two different things: a login database and a calculation database
    //here, perform the processing on the input then insert it inc. username that made it and whether is secret
    //make it so that it can only 'corrupt' public things or their own secrets
    //THEN, it has to return EVERYTHING available to this user (public stuff + their secrets) with ID
    collection.insertOne(req.body)
        .then(insertResponse => collection.findOne(insertResponse.insertedId))
        .then(findResponse => res.json(findResponse))

    //WHAT IT SHOULD SEND BACK
    //collection.find({ pw: { $exists: false } }).toArray()
    //json = {}
    //for (i = 0; i < data.length; i++){
    //if (username = req.session.user ||  data[i].secret == false){
    //  json.add(data[i])
    //}
    //OF THESE: THEN DO THE 'COURRUPT' ON A RANDOM ONE, QUERY FOR ALL DATA AGAIN AFTER
    //}


})

app.post('/delete', bodyParser.json(), (req, res) => {
    collection.findOne(req.body.__id).then(function (data) {
        if (data) {
            //Could add something where if try to delete secret it does an alert
            if (data.un === req.session.user) {

            }
        }
    })
})

//implement button with this
app.get('/logout', (req, res) => {
    req.session.login = false
    req.session.user = null
    res.sendFile(__dirname + '/views/login.html')
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
                debugger
                //WHY DOES THIS NOT WORK? sendFile ALSO DOESNT WORK
                res.redirect('/views/index.html')
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
        res.sendFile(__dirname + '/views/login.html')
    }
})

// route to get all docs, needs to be after the unauth middleware?
app.get('/', (req, res) => {
    if (collection !== null) {
        res.sendFile(__dirname + "/views/index.html");
        console.log("got to GET/");
        // get array and pass to res.json
        //collection.find({}).toArray().then(result => console.log(result));
        //collection.find({}).toArray().then(result => res.json(result))
        //res.sendFile(__dirname + "/views/index.html");
    }
})

app.listen(3000)