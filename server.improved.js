const { response } = require('express')

const http = require('http'),
    fs = require('fs'),
    GH = require("passport-github").Strategy,
    // mime = require('mime'),
    // dir = 'public/',
    express = require("express"),
    mongodb = require('mongodb'),
    passport = require('passport'),
    session = require('express-session'),
    app = express(),
    port = 3000

const uri = 'mongodb+srv://tester:Tester@cluster0.7gpfu.mongodb.net/'

// make all the files in 'public' available
app.use(express.static("public"))

// handles parsing json data
app.use(express.json())

// passport session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}))

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(function(user, cb) {
    cb(null, user.id)
})
passport.deserializeUser(function(id, cb) {
        cb(null, id)
    })
    // AUTHENTIFICATION

passport.use(new GH({
        clientID: 'Iv1.6ea6fadfd0adfbbb',
        clientSecret: "5889095decfb1cf5746017f5a61993f98ce5aa61",
        callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
        //console.log(profile)
        cb(null, profile);
    }
));

const isAuth = (request, response, next) => {
    if (request.user) {
        next()
    } else {
        response.redirect('/login.html')
    }
}

app.get('/auth/github',
    passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let collection = null

client.connect()

// redirect to index.html
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html")
        //response.send(collection)
});

// redirect to login.html
app.get("/login", (request, response) => {
    if (request.user) {
        return response.redirect('/')
    }
    response.sendFile(__dirname + "/views/login.html")
});

// redirect to login.html
app.get("/logout", (request, response) => {
    request.logOut()
    response.redirect('/login')
});

// get app data
app.post('/collection', (request, response) => {
    if (collection !== null) {
        collection.find({}).toArray().then(result => response.json(result))
    }
});

// add in data to db
app.post('/submit', express.json(), function(request, response) {

    collection
        .insertOne(
            request.body
        )
        .then(result => response.json(result))
})

// edit data in db
app.post('/edit', function(request, response) {
    collection
        .updateOne({ _id: mongodb.ObjectId(request.body._id) }, { $set: { task: request.body.task } }, { $set: { date: request.body.date } }, { $set: { time: request.body.time } }, { $set: { urg: request.body.urg } })
})

// delete data in db
app.post('/delete', (req, res) => {
    collection
        .deleteOne({ _id: mongodb.ObjectId(req.body._id) })
        .then(result => res.json(result))
})

// check off data in db
app.post('/check', function(request, response) {
    // console.log(request.body)
    collection
        .updateOne({ _id: mongodb.ObjectId(request.body._id) }, { $set: { done: request.body.done } })
})

const urgency = function(request, response, next) {
    let t = request.body.time,
        d = request.body.date;

    let urgent = 0; // 0 is least urgent, 5 most urgent 

    if (d === '' && t !== '') {
        urgent = 5
    } else {
        let cur = new Date(),
            dd = cur.getDate(),
            mm = cur.getMonth() + 1,
            yy = cur.getFullYear(),
            today = new Date(mm + '/' + dd + '/' + yy),
            temp = Date.parse(d), //d.slice(5, 7) + '/' + d.slice(8, 10) + '/' + d.slice(0, 4),
            tempDate = new Date(temp)

        //console.log('today ' + today + "temp " + tempDate)

        let difference = Math.ceil((tempDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            //console.log("dif" + (tempDate.getTime() - today.getTime()))
        if (difference === 1) urgent = 5
        else if (difference <= 3 && difference > 1) urgent = 4
        else if (difference <= 7) urgent = 3
        else if (difference <= 14) urgent = 2
        else if (difference <= 30) urgent = 1

    }

    next()

}


app.listen(port)

// // listen for requests
// const listener = app.listen(process.env.PORT, () => {
//     console.log("Your app is listening on port " + listener.address().port);
// });

/*------------------------------------------------------------------------ */

// const server = http.createServer(function(request, response) {
//     if (request.method === 'GET') {
//         handleGet(request, response)
//     } else if (request.method === 'POST') {
//         handlePost(request, response)
//     }
// })

// const handleGet = function(request, response) {
//     const filename = dir + request.url.slice(1)


//     if (request.url === '/') {
//         sendFile(response, 'public/index.html')
//     } else {
//         sendFile(response, filename)
//     }
// }

// const handlePost = function(request, response) {
//     let dataString = ''

//     request.on('data', function(data) {
//         dataString += data
//     })

//     request.on('end', function() {
//         if (dataString.startsWith('d')) {

//             const index = parseInt(dataString.slice(1))
//             appdata.splice(index, 1)

//         } else if (dataString.startsWith('e')) {

//             const index = parseInt(dataString.slice(1, dataString.indexOf(','))),
//                 json = JSON.parse(dataString.slice(dataString.indexOf(',') + 1)),
//                 curItem = appdata[index]

//             curItem.task = json.task
//             curItem.time = json.time
//             curItem.date = json.date
//             curItem.urgent = urgency(json.time, json.date)


//         } else if (dataString.startsWith('c')) {

//             const index = parseInt(dataString.slice(1)),
//                 curItem = appdata[index]

//             curItem.done = curItem.done === 'true' ? 'false' : 'true'

//         } else {
//             const json = JSON.parse(dataString)

//             json.urgent = urgency(json.time, json.date)

//             appdata.push(json)

//         }
//         response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
//         response.end(JSON.stringify(appdata))
//     })
// }

// const sendFile = function(response, filename) {
//     const type = mime.getType(filename)

//     fs.readFile(filename, function(err, content) {

//         // if the error = null, then we've loaded the file successfully
//         if (err === null) {

//             // status code: https://httpstatuses.com
//             response.writeHeader(200, { 'Content-Type': type })
//             response.end(content)

//         } else {

//             // file not found, error code 404
//             response.writeHeader(404)
//             response.end('404 Error: File Not Found')

//         }
//     })
// }

// function urgency(t, d) {
//     let urgent = 0; // 0 is least urgent, 5 most urgent 

//     if (d === '' && t !== '') {
//         urgent = 5
//     } else {
//         let cur = new Date(),
//             dd = cur.getDate(),
//             mm = cur.getMonth() + 1,
//             yy = cur.getFullYear(),
//             today = new Date(mm + '/' + dd + '/' + yy),
//             temp = Date.parse(d), //d.slice(5, 7) + '/' + d.slice(8, 10) + '/' + d.slice(0, 4),
//             tempDate = new Date(temp)

//         //console.log('today ' + today + "temp " + tempDate)

//         let difference = Math.ceil((tempDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
//             //console.log("dif" + (tempDate.getTime() - today.getTime()))
//         if (difference === 1) urgent = 5
//         else if (difference <= 3 && difference > 1) urgent = 4
//         else if (difference <= 7) urgent = 3
//         else if (difference <= 14) urgent = 2
//         else if (difference <= 30) urgent = 1

//     }

//     return urgent
// }

// server.listen(process.env.PORT || port)