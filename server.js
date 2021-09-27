// Enable .env file setup
require('dotenv').config()

// Import dependencies for properly running the server
const fetch = require("node-fetch"),
      express = require("express"),
      cors = require("cors"),
      cookieParser = require("cookie-parser"),
      bodyparser = require("body-parser"),
      mongodb = require( 'mongodb' ),
      app = express(),
      staticURL = process.env.STATIC_URL,
      staticDir  = "public",
      hwPath = "/agenda",
      hwAPIPath = hwPath + "/data",
      port = 80


///////// Define MongoDB database information //////////

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
console.log(uri)
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let homeworkCollection = null

const hwDB = "homeworkDB",
      homeworkCollectionLabel = "userHomeworks"

// Connect to MongoDB database
client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db(hwDB).collection(homeworkCollectionLabel)
  })
  .then(__collection => {
    // store reference to collection
    homeworkCollection = __collection
  })


  /////// Import dependencies for OAuth2 with GitHub //////

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
  async function(req, accessToken, refreshToken, user, done) {
    user.access_token = accessToken

    const hwData = await homeworkCollection.findOne({_id: user.id})
    // If the user doesn't exist on the database, add them
    if(hwData === null) {
      await homeworkCollection.insertOne({
        _id: user.id,
        data: {},
      })
    }

    return done(null, user)
  }
))

passport.serializeUser(async function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


//////////// MIDDLEWARE ////////////////

// Custom middleware for outputting an error code if the MongoDB server is down
app.use((req,res,next) => {
  if(homeworkCollection !== null) {
    next()
  }else{
    res.status(503).send()
  }
})

// Use CORS middleware to remove Same Origin Policy Errors
app.use(cors())

// Use body parser to parse JSON when necessary
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

// Setup middleware for Passport OAuth2
app.use(passport.initialize())

/*
 * Middleware for creating and storing cookies
 * Each session stores the following keys:
 * - access_token = used for grabbing user info
 * - id = used for storing user ID
 */
const COOKIE_ACCESS_TOKEN = "access_token"
const COOKIE_USER_ID = "id"
app.use(cookieParser())

// Redirect to home page if a user is not logged in and is attempting to view their agenda
// Also redirect to agenda if a user has already logged in
app.use((req, res, next) => {

  // Check if the user is trying to view the agenda
  if(req.path.startsWith(hwPath)) {
    // Session has not been authenticated, redirect to the homepage
    if(req.cookies[COOKIE_ACCESS_TOKEN] === undefined) {
      res.redirect("/")
      return
    }
  }
  // Check if the user is trying to access the GitHub OAuth page
  else if(req.path.startsWith(githubRedirect)) {
    // Session has been authenticated, redirect to the agenda
    if(req.cookies[COOKIE_ACCESS_TOKEN] !== undefined) {
      res.redirect(hwPath)
      return
    }
  }
  
  // No redirecting necessary, continue as is
  next()
})

// Serve static files when necessary
app.use(express.static(staticDir))


////////////// GET REQUESTS ////////////////

// Setup handling of GET requests for homepage route
app.get('/', (request,  response) => {
  response.sendFile(staticDir + "/index.html")
})

// Handles GET request to login location for redirecting to GitHub
// This will then redirect to GitHub's OAuth page for authorization
app.get(githubRedirect,
  [
    cors({ origin: staticURL }),
    passport.authenticate("github", { scope: githubUserScope }),
  ],
  function(req, res) {
    // Do nothing, being redirect to GitHub
    // The server will need to wait for a response when callback is sent a GET request
  }
)

// Handles GET request to app's GitHub post-authorization location
// This obtains the authorization token to be used with the GitHub API
app.get(githubCallback,
  passport.authenticate("github"),
  function(req, res) {
    res.cookie(COOKIE_ACCESS_TOKEN, req.user.access_token)
    res.cookie(COOKIE_USER_ID, req.user.id)
    res.redirect(hwPath)
  }
)

// Setup handling for GET requesting homework from API
app.get(hwAPIPath, 
  async (req, res) => {
    const gitUserResponse = await
    fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        "Authorization": "token " + req.cookies[COOKIE_ACCESS_TOKEN]
      },
    })

    const userData = await gitUserResponse.json()
    const homeworkData = await homeworkCollection.findOne({_id: req.cookies[COOKIE_USER_ID]})
    const responseData = {
      name: userData.name,
      data: homeworkData.data,
    }

    res.writeHeader(200, "OK", {"Content-Type": "application/json"})
    res.end(JSON.stringify(responseData))
})

////// POST REQUEST ///////

/**
 * Adds new data to the homework database
 * @param {*} request 
 * @param {*} response 
 */
 async function addNewData(req, res) {
  const userID = {_id: req.cookies[COOKIE_USER_ID]},
        currUserHWData = await homeworkCollection.findOne(userID),
        hwData = req.body,
        subDate = hwData.subDate

  // Update database
  currUserHWData.data[subDate] = hwData
  await homeworkCollection.updateOne(userID, {
    $set: { data: currUserHWData.data }
  })

  res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  res.end(JSON.stringify(hwData)) 
}


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

app.delete(hwAPIPath, async (req, res) => {
  const userID = {_id: req.cookies[COOKIE_USER_ID]},
        currUserHWData = await homeworkCollection.findOne(userID),
        hwData = req.body,
        subDate = hwData.subDate

  // Update database
  delete currUserHWData.data[subDate]
  await homeworkCollection.updateOne(userID, {
    $set: { data: currUserHWData.data }
  })

  res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  res.end()
})


const listener = app.listen( process.env.PORT || port, () => {
  console.log( 'Your app is listening on: ' + staticURL + ":" + listener.address().port)
})
