// I've got no idea what this is and how it got here
const { json } = require('body-parser');
const { ObjectId } = require('bson');
const res = require('express/lib/response');

// MongoDB Stuff
const mongodb     = require('mongodb'),
      dbClient    = mongodb.MongoClient,
      assert      = require('assert'),
      MongoURL    = "mongodb+srv://quantum:bloodhouse@project-a3-db.jyoep.mongodb.net/ArcadeDatabase?retryWrites=true&w=majority";

let arcadeDatabase  = null,
    databaseClient  = null; // See if there's an eventual use for this

// Express server stuff
const express       = require('express'),
      app           = express(),
      bodyparser    = require('body-parser'),
      favicon       = require('serve-favicon'),
      path          = require('path'),
      port          = 3000;

require('dotenv').config();

// Github OAuth Stuff
const passport      = require('passport'),
      session       = require('express-session');
      GitHubStrategy = require('passport-github').Strategy,
      axios         = require('axios');

// Initialize connection to MongoDB
dbClient.connect(MongoURL).then( (client) =>{
  arcadeDatabase = client.db("ArcadeDatabase"); // This references the database
  clientTest = client; // This is the client object (used for closing the connection)
  console.log("Database connected");
});

// Making sure this comes first (avoid processing any other middleware for a simple favicon request)
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Make all files in 'public' available
app.use(express.static("public"));

// Gets json when appropriate
app.use(bodyparser.json());

// Handle session token
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUnitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  cb(null, id);
});

// Handles Github OAuth
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: "https://a3-michael-lai.herokuapp.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    cb(null, profile);
    /*User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    });*/
  }
));

const isAuth = (request, response, next) => {
  console.log("Checking");
  if(request.user) {
    next();
  } else {
    response.redirect("/login");
  }
}

// Make sure that index gets loaded anyway
app.get("/", isAuth, (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

// Handles login GET request
app.get("/login", (request, response) => {
  if(request.user) {
    return response.redirect("/");
  }
  response.sendFile(__dirname + "/public/login.html");
});

app.get("/logout", (request, response) => {
  request.logOut();
  request.redirect("/login");
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
  res.redirect('/');
});

// Handles update GET request
app.get("/update", checkDBConnection, (request, response) => {
  console.log("GET Request: Update");
  getGameDatabase().then( (result) => {
    console.log(result);
    response.writeHead( 200, "OK", {'Content-Type': 'application/json' });
    response.end(JSON.stringify(result));
  });
});

// Handles submit POST request
app.post("/submit", async (request, response) => {
  console.log("POST Request: Submit");
  
  const jsonInput = request.body;

  console.log("POST Request Data:");
  console.log(jsonInput);

  if(jsonInput._id === null) { // New submission
    // Find if there is a highscore to replace
    let currentHS = await findHighscore(jsonInput.game);

    if(currentHS !== null) { // Found highscore, time to see if it's to be replaced
      console.log("Found Highscore", currentHS.score);
      if(jsonInput.score > currentHS.score) { // Replace highscore
        jsonInput.highscore = true; // Update to true locally

        let targetID = { _id: mongodb.ObjectId(currentHS._id)}; // Update to false in the database
        let updateJSON = { $set: { highscore: false } }
        await updateDatabaseItem(targetID, updateJSON);
      }
    } else { // Did not find highscore, it's now the highscore
      jsonInput.highscore = true;
    }

    await addDatabaseItem(jsonInput); // Add the item to the database
    console.log("Submission Complete");
    //response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
    //response.end();

  } else { // Must be a modification
    let searchID = { _id: mongodb.ObjectId(jsonInput._id) }
    let JSONMatch = await searchDatabaseItem(searchID);

    let updateName = { $set: { name: jsonInput.name } }
    await updateDatabaseItem(searchID, updateName); // Update the name

    // First, check if there's a game change
    if(JSONMatch.game === jsonInput.game) { // Same game

      if(JSONMatch.highscore === true) { // If it was the highscore
        let updateScore = { $set: { score: jsonInput.score } }
        await updateDatabaseItem(searchID, updateScore); // Update the score

        let findHS = await findHighscore(jsonInput.game); // Find the highscore

        console.log(findHS._id.valueOf());
        console.log(JSONMatch._id.valueOf());

        let objectID1 = JSONMatch._id;
        let objectID2 = findHS._id;

        if( !objectID1.equals(objectID2) ) { // If the ID's are different
          // The highscore is now a different entry
          let updateHSFalse = { $set: { highscore: false } };
          await updateDatabaseItem(searchID, updateHSFalse);
          let targetID = { _id: mongodb.ObjectId(findHS._id) };
          let updateHSTrue = { $set: { highscore: true } };
          await updateDatabaseItem(targetID, updateHSTrue);
        }

      } else if(JSONMatch.highscore === false) { // If it wasn't the highscore
        let findHS = await findHighscore(jsonInput.game); // Find current highscore
        
        let updateScore = { $set: { score: jsonInput.score } }
        await updateDatabaseItem(searchID, updateScore); // Update the score

        if(findHS.score < jsonInput.score) { // If the replacement score is greater
          // It is the highscore now
          let updateHSTrue = { $set: { highscore: true } };
          await updateDatabaseItem(searchID, updateHSTrue);
          let targetID = { _id: mongodb.ObjectId(findHS._id) };
          let updateHSFalse = { $set: { highscore: false } };
          await updateDatabaseItem(targetID, updateHSFalse);
        }
      }

    } else { // Different game
      let previousGame = JSONMatch.game; // Save the previous game
      let newGameCurrentHS = await findHighscore(jsonInput.game); // Grab the highscore for the game that we're switching to
      
      let updateGame = { $set: { game: jsonInput.game } }
      await updateDatabaseItem(searchID, updateGame); // Update the game

      // First, update the highscore for the previous game
      let previousGameHS = await findHighscore(previousGame);
      if(previousGameHS !== null) { // If there is a new highscore
        let targetID = { _id: mongodb.ObjectId(previousGameHS._id) };
        let updateHSTrue = { $set: { highscore: true } }; // Update it to true
        await updateDatabaseItem(targetID, updateHSTrue);
      }

      // Then, update the highscore for the new game
      let updateScore = { $set: { score: jsonInput.score } }
      await updateDatabaseItem(searchID, updateScore); // Update the score
      
      if(newGameCurrentHS !== null) { // There is a current highscore
        let newGameUpdateHS = await findHighscore(jsonInput.game);

        let objectID1 = JSONMatch._id;
        let objectID2 = newGameUpdateHS._id;

        if(objectID1.equals(objectID2)) { // We found itself, New highscore
          let updateHSTrue = { $set: { highscore: true } };
          await updateDatabaseItem(searchID, updateHSTrue);
          let targetID = { _id: mongodb.ObjectId(newGameCurrentHS._id) };
          let updateHSFalse = { $set: { highscore: false } };
          await updateDatabaseItem(targetID, updateHSFalse);

        } else { // Make sure that the highscore is set to false
          let updateHSFalse = { $set: { highscore: false } };
          await updateDatabaseItem(searchID, updateHSFalse);
        }
      } else { // There isn't a current highscore
        let updateHSTrue = { $set: { highscore: true } };
        await updateDatabaseItem(searchID, updateHSTrue);
      }
    }
    console.log("Modification Complete");
  }

  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
  response.end();
});

// Handles delete POST request
app.post("/delete", async (request, response) => {
  console.log("POST Request: Delete");

  const jsonInput = request.body;

  console.log("POST Request Data:");
  console.log(jsonInput);
  const searchID = { _id: mongodb.ObjectId(jsonInput._id) };

  let result = await searchDatabaseItem(searchID);
  let hsStatus = result.highscore;
  await deleteDatabaseItem(searchID);
  if(hsStatus === true) {
    let hsNew = await findHighscore(result.game); // Find the high score for a specific game
    if(hsNew !== null) {
      const targetID = { _id: mongodb.ObjectId(hsNew._id)};
      hsNew.highscore = true;
      const updateJSON = { $set: { highscore: true } }
      await updateDatabaseItem(targetID, updateJSON);
    }
  }
  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
  response.end();
});

// Takes a specific game and MongoDB client and returns the JSON object of that highscore
// Returns -1 if that game doesn't exist or if no highscore exists
async function findHighscore(game) {
  let result = await arcadeDatabase.collection("GameData").find({}).toArray();
  let hsItem = null;
  let hsScoreCounter = -1;
  
  for(let i = 0; i < result.length; i++) {
    if(result[i].game === game && result[i].score > hsScoreCounter) {
      hsScoreCounter = result[i].score;
      hsItem = result[i];
    }
  }
  
  console.log(hsItem);
  return hsItem;
}

async function getGameDatabase() {
  let gameData = await arcadeDatabase.collection("GameData").find({}).toArray();
  console.log("Grabbed game database");
  return gameData;
}

async function addDatabaseItem(jsonItem) {
  await arcadeDatabase.collection("GameData").insertOne(jsonItem).then(result => {
    console.log("Addition Complete", jsonItem);
  });
}


async function deleteDatabaseItem(jsonID) {
  console.log(jsonID);
  await arcadeDatabase.collection("GameData").deleteOne(jsonID);
  console.log("Deletion Complete:", jsonID);
}


async function updateDatabaseItem(targetItem, updatedItem) {
  let result = await arcadeDatabase.collection("GameData").updateOne(targetItem, updatedItem);
  if(result.modifiedCount === 1) {
    console.log("Updated:", targetItem);
  }
}


async function searchDatabaseItem(jsonID) {
  let result = await arcadeDatabase.collection("GameData").findOne(jsonID);
  console.log("Search Complete:", result);
  return result;
}

// Middleware for checking the database connection
function checkDBConnection(request, response, next) {
  if( arcadeDatabase !== null) {
    console.log("Mongo database connection check: Complete");
    next()
  } else {
    console.log("Mongo database connection check: Failed");
    response.status( 503 ).send()
  }
}

// Run the listener on a port
const listener = app.listen(process.env.PORT || port, () => {
  console.log("Server running");
  console.log("Listening on port " + listener.address().port);
});

// Example code for MongoDB
/*MongoClient.connect(MongoURL, function(err, client) {
  if( err ) {
    console.log("Unable to connect to MongoDB server", err);
    return res.send("Unable to connect to database server");
  } else {
    console.log("Connected to MongoDB server");
    let gameCollection = client.collection("GameData");
    let userCollection = client.collection("UserInfo");
  }
  
  client.close();
});*/