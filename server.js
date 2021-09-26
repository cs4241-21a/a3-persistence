// Enable .env file setup
require('dotenv').config()

// Import dependencies for properly running the server
const express = require("express"),
      cors = require("cors"),
      cookie = require("cookie-session"),
      bodyparser = require("body-parser"),
      mongodb = require( 'mongodb' ),
      app = express(),
      staticURL = process.env.STATIC_URL,
      staticDir  = "public",
      hwPath = "/agenda"
      hwAPIPath = hwPath + "/data",
      port = 80

// Import dependencies for OAuth2 with GitHub
const passport = require("passport"),
      GitHubStrat = require("passport-github2").Strategy

const githubRedirect = "/auth/github",
      githubCallback = githubRedirect + "/authorized",
      githubUserScope = [ "read:user" ]

passport.use(new GitHubStrat({
    passReqToCallback: true,
    clientID: process.env.GH_OAUTH_ID,
    clientSecret: process.env.GH_OAUTH_SECRET,
    callbackURL: staticURL + githubCallback
  },
  function(req, accessToken, refreshToken, user, done) {
    user.accessToken = accessToken
    return done(null, user)
  }
))

passport.serializeUser(function(user, done) {
  console.log("passport.serializeUser:\t" + user)
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("passport.deserializeUser:\t"+ obj)
  done(null, obj);
});

// Key is corresponding to submission date (really just for uniqueness, doesn't matter for the preset values like this)
const homeworkData = {
  "0": { name: "a2-shortstack", priority: "High", course: "Webware", dueDate:'2021-09-09T11:59:00-0400', subDate: "0",},
  "1": { name: "CSS Grid Garden", priority: "High", course: "Webware", dueDate:'2021-09-09T11:59:00-0400', subDate: "1",},
  "2": { name: "Project 2", priority: "Low", course: "Mobile Computing", dueDate:'2021-09-17T23:59:00-0400', subDate: "2",},
}

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
console.log(uri)
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let userCollection = null
let homeworkCollection = null


const hwDB = "homeworkDB",
      userCollectionLabel = "userData"
      homeworkCollectionLabel = "userHomeworks"


// Connect to MongoDB database
client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return [
      client.db(hwDB).collection(userCollectionLabel),
      client.db(hwDB).collection(homeworkCollectionLabel),
    ]
  })
  .then(__collection => {
    // store reference to collection
    userCollection = __collection[0]
    homeworkCollection = __collection[1]
    // blank query returns all documents
    const userData = userCollection.find({ }).toArray()
    const hwData = homeworkCollection.find({ }).toArray()
    return Promise.all([userData, hwData])
  })
  .then(console.log)


// Custom middleware for outputting an error code if the MongoDB server is down
app.use((req,res,next) => {
  if(userCollection !== null && homeworkCollection !== null) {
    next()
  }else{
    res.status(503).send()
  }
})


/**
 * Middleware for creating and storing cookies
 * Each session stores the following keys:
 * - access_token = used for accessing the GitHub API (obtaining user info)
 */
app.use(cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

// Use CORS middleware to remove Same Origin Policy Errors
app.use(cors({
  origin: '*',
  methods: "GET, POST, PATCH, DELETE, PUT",
  allowedHeaders: "Content-Type, Authorization",
  preflightContinue: true,
}))

// Use body parser to parse JSON when necessary
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

// Setup middleware for Passport OAuth2
app.use(passport.initialize())
app.use(passport.session())

// Redirect to home page if a user is not logged in and is attempting to view their agenda
app.use((req, res, next) => {
  if(req.path.startsWith(hwPath) && !req.hasOwnProperty("user")) {
    res.redirect("/")
  }
  else {
    // Session cookie exists, continue
    next() 
  }
})

// Serve static files when necessary
app.use(express.static(staticDir))

/**
 * Adds new data to the homework database
 * @param {*} request 
 * @param {*} response 
 */
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

// Handles GET request to login location for redirecting to GitHub
// This will then redirect to GitHub's OAuth page for authorization
app.options(githubRedirect, cors())
app.get(githubRedirect,
  [
    // (req, res, next) => {
    //   req.set({"Access-Control-Allow-Origin": "*"})
    //   next()
    // },
    passport.authenticate("github", { scope: githubUserScope }),
  ],
  function(req, res) {
    // Do nothing, being redirect to GitHub
    // The server will need to wait for a response when callback is sent a GET request
    console.log(req)
    console.log(res)
  }
)

// Set up a whitelist and check against it:
var whitelist = [staticURL, 'https://github.com']
var corsOptions = {
  origin: (origin, callback) => {
    callback(null, true)
  }
}
// Handles GET request to app's GitHub post-authorization location
// This obtains the authorization token to be used with the GitHub API
app.get(githubCallback,
  passport.authenticate("github",
  { failureRedirect: "/?" + new URLSearchParams({
      error: "Failed to authenticate with GitHub"
  })}),
  function(req, res) {
    console.log(req.user)
    res.redirect(hwPath)
  }
)

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
  console.log( 'Your app is listening on: ' + staticURL + ":" + listener.address().port)
})
