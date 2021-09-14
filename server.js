const express = require('express')
const helmet = require("helmet");
const user = require("./routes/user")
const data = require("./routes/data")
const morgan = require('morgan')
const favicon = require('serve-favicon')
const cors = require('cors')


const InitiateMongoServer = require("./config/db");
InitiateMongoServer().then(() => {
    console.log("Connected to DB")
});
const app = express();
app.use(helmet());
app.use(express.static('public'))
//app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", user)
app.use("/data", data)
app.use(morgan('tiny'))
app.use(favicon(__dirname+'/public/img/favicon.ico'))
app.use(cors())


app.use( function( req, res, next ) {
    console.log( 'url:', req.url )
    next()
})
app.get( '/', function (req, res) {
    res.sendFile(__dirname + "/public/login/login.html" )
})

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
})


/*const http = require('http'),
    fs = require('fs'),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library used in the following line of code
    mime = require('mime'),
    dir = 'public/',
    port = 3000

const appdata = [
    {'name': 'Test User 1', 'age': 21, 'gender': 'Male', 'adult': 'Yes'},
    {'name': 'Test User 2', 'age': 16, 'gender': 'Male', 'adult': 'No'},
    {'name': 'Test User 3', 'age': 32, 'gender': 'Female', 'adult': 'Yes'},
    {'name': 'Test User 4', 'age': 45, 'gender': 'Other', 'adult': 'Yes'}
];

const server = http.createServer(function (request, response) {
    if (request.method === 'GET') {
        handleGet(request, response)
    } else if (request.method === 'POST') {
        handlePost(request, response)
    }
})

function sendDataToClient(response, data) {
    const type = mime.getType(appdata);
    response.writeHead(200, {'Content-Type': type});
    response.write(JSON.stringify(data));
    response.end()
}

const handleGet = function (request, response) {
    const filename = dir + request.url.slice(1)

    if (request.url === '/') sendFile(response, 'public/index.html')
    else if (request.url === '/updatePage') sendDataToClient(response, appdata);
    else sendFile(response, filename)
}

function isAdult(data) {
    if (data['age'] >= 18)
        return "Yes";
    else
        return "No";
}

function addRowToTable(dataString) {
    let jsonApp = JSON.parse(dataString);
    //Derived attribute.
    console.log("jsonApp:\n" + JSON.stringify(jsonApp))

    jsonApp['adult'] = isAdult(jsonApp);
    console.log("jsonApp:\n" + JSON.stringify(jsonApp))
    appdata.push(jsonApp);
}

function deleteRowFromTable(dataString) {
    for (let i = 0; i < appdata.length; i++) {
        let row = appdata[i];
        console.log("dataString = " + dataString.slice(5));
        if ((i + 1).toString() === dataString.slice(5)) appdata.splice(i, 1);
    }
}

function modifyRowFromTable(dataString) {
    let jsonApp = JSON.parse(dataString);
    for (let i = 0; i < appdata.length; i++) {
        console.log("i = " + i);
        console.log("jsonApp = " + jsonApp['modifyIndex']);
        if ((i + 1).toString().normalize() === (jsonApp['modifyIndex'].toString().normalize())) {
            let row = appdata[i];
            row['name'] = jsonApp['name'];
            row['age'] = jsonApp['age'];
            row['gender'] = jsonApp['gender'];
            row['adult'] = isAdult(row);
        }
    }
}

const handlePost = function (request, response) {
    let dataString = ''

    request.on('data', function (data) {
        dataString += data
    })

    request.on('end', function () {
        console.log(dataString)

        // ... do something with the data here!!!
        if (request.url === '/add') addRowToTable(dataString);
        else if (request.url === '/delete') deleteRowFromTable(dataString);
        else if (request.url === '/modify') modifyRowFromTable(dataString);
        console.log("appdata:\n" + JSON.stringify(appdata));
        response.writeHead(200, "OK", {'Content-Type': 'text/plain'})
        response.end()
    })
}

const sendFile = function (response, filename) {
    const type = mime.getType(filename)

    fs.readFile(filename, function (err, content) {

        // if the error = null, then we've loaded the file successfully
        if (err === null) {

            // status code: https://httpstatuses.com
            response.writeHeader(200, {'Content-Type': type})
            response.end(content)

        } else {

            // file not found, error code 404
            response.writeHeader(404)
            response.end('404 Error: File Not Found')

        }
    })
}

server.listen(process.env.PORT || port)*/