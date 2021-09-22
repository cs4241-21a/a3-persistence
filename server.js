// Enable .env file setup
require('dotenv').config()

const express = require("express"),
      bodyparser = require("body-parser"),
      mongodb = require( 'mongodb' ),
      app = express(),
      staticDir  = "public",
      hwAPIPath = "/homework",
      port = 80

// Key is corresponding to submission date (really just for uniqueness, doesn't matter for the preset values like this)
const homeworkData = {
  "0": { name: "a2-shortstack", priority: "High", course: "Webware", dueDate:'2021-09-09T11:59:00-0400', subDate: "0",},
  "1": { name: "CSS Grid Garden", priority: "High", course: "Webware", dueDate:'2021-09-09T11:59:00-0400', subDate: "1",},
  "2": { name: "Project 2", priority: "Low", course: "Mobile Computing", dueDate:'2021-09-17T23:59:00-0400', subDate: "2",},
}

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
console.log(uri)
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

const hwDB = "homeworkDB",
      collectionUserHW = "userHomeworks"

// Connect to MongoDB database
client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db(hwDB).collection(collectionUserHW)
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )

// Custom middleware for outputting an error code if the MongoDB server is down
app.use((req,res,next) => {
  if(collection !== null) {
    next()
  }else{
    res.status(503).send()
  }
})

// Serve static files when necessary
app.use(express.static(staticDir))
// Use body parser to parse JSON when necessary
app.use(bodyparser.json())

function addNewData(request, response) {
  let hwData = JSON.parse(request.body.newHW)

  // Calculate priority based on given submission time and deadline
  const dueDate = new Date(hwData.dueDate)
  const subDate = new Date(hwData.subDate)
  const dayDiff = Math.floor((dueDate - subDate) / 86400000)

  const priorityLevels = [
    [1, "High"],    // One day ==> High
    [3, "Medium"],  // Three days ==> Medium
    [null, "Low"],  // Otherwise == Low
  ]

  // If difference of time is less or equal to whichever priority level, then assign it
  for(priorityTimePair of priorityLevels) {
    const priorityTime = priorityTimePair[0]
    const priorityLevel = priorityTimePair[1]
    if(priorityTime === null || dayDiff <= priorityTime) {
      hwData.priority = priorityLevel
      break
    }
  }

  // Add to internal server data, using the submission date as the key (for uniqueness)
  homeworkData[hwData.subDate] = hwData

  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  response.end(JSON.stringify(hwData)) 
}

///// GET REQUESTS //////

// Setup handling of GET requests for homepage route
app.get('/', (request,  response) => {
  response.sendFile(staticDir + "/index.html")
})

// Setup handling for GET requesting homework from API
app.get(hwAPIPath, (request, response) => {
  response.writeHeader(200, "OK", {"Content-Type": "application/json"})
  response.end(JSON.stringify(homeworkData))
})


////// POST REQUEST ///////

// Setup handling for POST requesting homework from API
app.post(hwAPIPath, (request, response) => {
  addNewData(request, response)
})

/////// PUT REQUEST ///////

// Setup handling for PUT requesting homework from API
app.put(hwAPIPath, (request, response) => {
  addNewData(request, response)
})

/////// DELETE REQUEST ///////

// Setup handling for DELETE requesting homework from API

app.delete(hwAPIPath, (request, response) => {
  let hwData = JSON.parse(dataString)

  delete homeworkData[hwData.subDate]

  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  response.end()
})


const listener = app.listen( process.env.PORT || port, () => {
  console.log( 'Your app is listening on port: ' + listener.address().port)
})
