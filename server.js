const http = require('http'),
    fs = require('fs'),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library used in the following line of code
    mime = require('mime'),
    dir = 'public/',
    express = require("express"),
    app = express(),
    port = 3000

const appdata = []

// make all the files in 'public' available
app.use(express.static("public"))
    // redirect to index.html
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/views/index.html")
});

// send the default array of dreams to the webpage
app.get("/appdata", (request, response) => {
    // express helps us take JS objects and send them as JSON
    response.json(dreams);
});

// listen for requests
const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});

/*------------------------------------------------------------------------ */

const server = http.createServer(function(request, response) {
    if (request.method === 'GET') {
        handleGet(request, response)
    } else if (request.method === 'POST') {
        handlePost(request, response)
    }
})

const handleGet = function(request, response) {
    const filename = dir + request.url.slice(1)


    if (request.url === '/') {
        sendFile(response, 'public/index.html')
    } else {
        sendFile(response, filename)
    }
}

const handlePost = function(request, response) {
    let dataString = ''

    request.on('data', function(data) {
        dataString += data
    })

    request.on('end', function() {
        if (dataString.startsWith('d')) {

            const index = parseInt(dataString.slice(1))
            appdata.splice(index, 1)

        } else if (dataString.startsWith('e')) {

            const index = parseInt(dataString.slice(1, dataString.indexOf(','))),
                json = JSON.parse(dataString.slice(dataString.indexOf(',') + 1)),
                curItem = appdata[index]

            curItem.task = json.task
            curItem.time = json.time
            curItem.date = json.date
            curItem.urgent = urgency(json.time, json.date)

            //console.log(appdata)

        } else if (dataString.startsWith('c')) {

            const index = parseInt(dataString.slice(1)),
                curItem = appdata[index]

            curItem.done = curItem.done === 'true' ? 'false' : 'true'

            //console.log(appdata)

        } else {
            const json = JSON.parse(dataString)

            json.urgent = urgency(json.time, json.date)

            appdata.push(json)

        }
        response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
        response.end(JSON.stringify(appdata))
    })
}

const sendFile = function(response, filename) {
    const type = mime.getType(filename)

    fs.readFile(filename, function(err, content) {

        // if the error = null, then we've loaded the file successfully
        if (err === null) {

            // status code: https://httpstatuses.com
            response.writeHeader(200, { 'Content-Type': type })
            response.end(content)

        } else {

            // file not found, error code 404
            response.writeHeader(404)
            response.end('404 Error: File Not Found')

        }
    })
}

function urgency(t, d) {
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

    return urgent
}

server.listen(process.env.PORT || port)

// // server.js
// // where your node app starts

// // we've started you off with Express (https://expressjs.com/)
// // but feel free to use whatever libraries or frameworks you'd like through `package.json`.
// const express = require("express");
// const app = express();

// // our default array of dreams
// const dreams = [
//   "Find and count some sheep",
//   "Climb a really tall mountain",
//   "Wash the dishes"
// ];

// // make all the files in 'public' available
// // https://expressjs.com/en/starter/static-files.html
// app.use(express.static("public"));

// // https://expressjs.com/en/starter/basic-routing.html
// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/index.html");
// });

// // send the default array of dreams to the webpage
// app.get("/dreams", (request, response) => {
//   // express helps us take JS objects and send them as JSON
//   response.json(dreams);
// });

// // listen for requests :)
// const listener = app.listen(process.env.PORT, () => {
//   console.log("Your app is listening on port " + listener.address().port);
// });