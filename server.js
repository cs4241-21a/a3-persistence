const express = require("express"),
    bodyParser = require("body-parser"),
    cookie = require('cookie-session'),
    path = require('path'),
    app = express(),
    mongodb = require("mongodb"),
    favicon = require('serve-favicon'),
    serveStatic = require('serve-static'),
    morgan = require('morgan');
var ObjectId = require('mongodb').ObjectId;

//Serve favicon using middlewaare
app.use(favicon(__dirname + '/public/assets/open-book.png'));

//Serve static files using middleware
app.use(serveStatic(path.join(__dirname, 'public')))

//create a token
morgan.token('body', function(req, res) {
    return [
        JSON.stringify(req.body)
    ]
})

//create logger using morgan middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const uri =
    "mongodb+srv://tester:tester123@cluster0.gfgtp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new mongodb.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let collection = null;

client.connect()
    .then(() => {
        // will create collection if it doesn't exist
        return client.db("data").collection("data");
    })
    .then(__collection => {
        // store reference to collection
        collection = __collection
            // blank query returns all documents
        return collection.find({}).toArray()
    })
    // .then(console.log)

app.post("/reviews", bodyParser.json(), (request, response) => {
    if (collection !== null) {
        collection
            .find({ "user": request.body.user })
            .toArray()
            .then(result => response.json(result))
            .catch(err => console.log(err));
    }
});

app.post("/addUser", bodyParser.json(), (request, response) => {
    if (collection !== null) {
        collection
            .find({ "username": request.body.username })
            .toArray()
            .then(result => {
                if (result.length === 0) {

                    collection.insertOne(request.body)
                        .then(insertResponse => collection.findOne(insertResponse.insertedId))
                        .then(findResponse => {
                            response.json({ "newUser": "1" })
                        });
                } else {
                    response.json({ "newUser": "0" })
                }
            })
            .catch(err => console.log(err));
    }
});

// use express.urlencoded to get data sent by default form actions
// or GET requests
app.use(express.urlencoded({ extended: true }))

//  The keys are used for encryption and should be changed
app.use(cookie({
    name: 'session',
    keys: ['key123456', 'key234567']
}))


app.post('/login', (request, response) => {
    // express.urlencoded will put your key value pairs 
    // into an object, where the key is the name of each
    // form field and the value is whatever the user entered

    collection.find({ "username": request.body.username }).toArray(function(err, results) {
        if (err) {
            console.log(err);
        } else {
            if (results[0] === undefined) {
                request.session.login = false

                // username incorrect, redirect back to login page
                response.sendFile(__dirname + '/public/login-failed.html')
            } else if (results[0].password === request.body.password) {
                // define a variable that we can check in other middleware
                // the session object is added to our requests by the cookie-session middleware
                request.session.login = true

                // since login was successful, send the user to the main content
                response.redirect('main.html')
            } else {
                request.session.login = false
                    // password incorrect, redirect back to login page
                response.sendFile(__dirname + '/public/login-failed.html')
            }

        }
    })
})

// add some middleware that always sends unauthenicated users to the login page
app.use(function(request, response, next) {
    if (request.session.login === true)
        next()
    else
        response.sendFile(__dirname + '/public/login-failed.html')
})

app.post("/add", bodyParser.json(), (request, response) => {
    console.log("body:", request.body);
    collection.insertOne(request.body)
        .then(insertResponse => collection.findOne(insertResponse.insertedId))
        .then(findResponse => {
            console.log(findResponse)
            response.json(findResponse)
        });
});

app.post("/remove", bodyParser.json(), (request, response) => {
    collection
        .deleteOne({ _id: ObjectId(request.body._id) })
        .then(result => {
            console.log(result)
            response.json(result)
        });
});

//TODO
app.post('/update', bodyParser.json(), (request, response) => {
    console.log("id: ", request.body._id)
    collection
        .updateOne({ _id: ObjectId(request.body._id) }, { $set: { review: request.body.review, user: request.body.user } })
        .then(result => {
            console.log(result)
            response.json(result)
        });
});

const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});