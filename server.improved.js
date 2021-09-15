const bodyParser = require('body-parser')
var express = require('express')
var app = express()
var bodyparser = require('body-parser')

let uid = 0

const appdata = []

const getPercentDead = function (dob, gender) {
  let year = dob.substr(0, 4)
  let month = dob.substr(5, 2)
  let day = dob.substr(8, 2)
  const today = new Date();
  const curYear = today.getFullYear()
  const curMonth = today.getMonth() + 1
  const curDay = today.getDate()
  if (curDay < day) { month++ }
  const age = (curYear - year) * 12 + (curMonth - month)
  let expectedDeath = 0
  switch (gender) {
    case 'Male':
      expectedDeath = 75.1 * 12
      break;
    case 'Female':
      expectedDeath = 80.5 * 12
      break;
    case 'Other':
      expectedDeath = 77.8 * 12
      break;
  }
  return `${((age / expectedDeath) * 100).toFixed(2)}%`
}

app.use(function (req, res, next) {
  console.log('url:', req.url)
  next()
})

app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html')
})

app.post('/add', function (request, response) {
  console.log(request.body)
  const percentDead = getPercentDead(request.body.yourdob, request.body.yourgender)
  request.body.percentDead = percentDead
  request.body.uid = uid++
  appdata.push(request.body) // Add the created object to the servers memory
  console.log('ADD:')
  console.log(request.body)

  response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(request.body))
})

app.post('/update', function (request, response) {
  console.log(appdata)
  //Update server record to reflect post data
  const serverObj = appdata.filter(record => record.uid == request.body.uid)[0]
  //console.log(serverObj)
  serverObj.yourname = request.body.yourname
  serverObj.yourdob = request.body.yourdob
  serverObj.yourgender = request.body.yourgender
  serverObj.percentDead = getPercentDead(request.body.yourdob, request.body.yourgender)
  console.log('UPDATE:')
  console.log(serverObj)

  response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(serverObj))
})

app.post('/remove', function (request, response) {
  console.log(appdata)
  console.log('REMOVE:')
  //console.log(postObj)
  const objToRemove = appdata.filter(record => record.uid == request.body.uid)[0]
  console.log(objToRemove)
  const indexToRemove = appdata.indexOf(objToRemove)
  appdata.splice(indexToRemove, 1)

  response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(request.body))
})

app.post('/all', function (request, response) {
  console.log("Sending appdata")

  response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(appdata))
})

app.listen(3000)



// const server = http.createServer(function (request, response) {
//   if (request.method === 'GET') {
//     handleGet(request, response)
//   } else if (request.method === 'POST') {
//     handlePost(request, response)
//   }
// })

// const handleGet = function (request, response) {
//   const filename = dir + request.url.slice(1)

//   if (request.url === '/') {
//     sendFile(response, 'public/index.html')
//   } else {
//     sendFile(response, filename)
//   }
// }

// const handlePost = function (request, response) {
//   let dataString = ''
//   request.on('data', function (data) {
//     dataString += data
//   })
//   if (request.url === '/add') {
//     request.on('end', function () {
//       // Must convert JSON to string before seding and then convert it back on the server
//       // Create record to send back to client and store on server
//       const dataObj = JSON.parse(dataString)
//       const percentDead = getPercentDead(dataObj.yourdob, dataObj.yourgender)
//       dataObj.percentDead = percentDead
//       dataObj.uid = uid++
//       appdata.push(dataObj) // Add the created object to the servers memory
//       console.log('ADD:')
//       console.log(dataObj)

//       dataString = JSON.stringify(dataObj)

//       response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
//       response.end(dataString)
//     })
//   } else if (request.url === '/update') {
//     request.on('end', function () {
//       console.log(appdata)
//       //Update server record to reflect post data
//       const postObj = JSON.parse(dataString)
//       //console.log(postObj)
//       const serverObj = appdata.filter(record => record.uid == postObj.uid)[0]
//       //console.log(serverObj)
//       serverObj.yourname = postObj.yourname
//       serverObj.yourdob = postObj.yourdob
//       serverObj.yourgender = postObj.yourgender
//       serverObj.percentDead = getPercentDead(postObj.yourdob, postObj.yourgender)
//       console.log('UPDATE:')
//       console.log(serverObj)

//       dataString = JSON.stringify(serverObj)

//       response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
//       response.end(dataString)
//     })
//   } else if (request.url === '/remove') {
//     request.on('end', function () {
//       postObj = JSON.parse(dataString)
//       console.log(appdata)
//       console.log('REMOVE:')
//       //console.log(postObj)
//       const objToRemove = appdata.filter(record => record.uid == postObj.uid)[0]
//       console.log(objToRemove)
//       const indexToRemove = appdata.indexOf(objToRemove)
//       appdata.splice(indexToRemove, 1)

//       response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
//       response.end(dataString)
//     })
//   } else if (request.url === '/all') {
//     request.on('end', function () {
//       console.log("Sending appdata")
//       dataString = JSON.stringify(appdata)

//       response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
//       response.end(dataString)
//     })
//   }
// }

// const sendFile = function (response, filename) {
//   const type = mime.getType(filename)

//   fs.readFile(filename, function (err, content) {

//     // if the error = null, then we've loaded the file successfully
//     if (err === null) {

//       // status code: https://httpstatuses.com
//       response.writeHeader(200, { 'Content-Type': type })
//       response.end(content)

//     } else {

//       // file not found, error code 404
//       response.writeHeader(404)
//       response.end('404 Error: File Not Found')

//     }
//   })
// }

// server.listen(process.env.PORT || port)
