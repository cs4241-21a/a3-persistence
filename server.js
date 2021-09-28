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

// Make sure that index gets loaded anyway
app.get("/", (request, respone) => {
  response.sendFile(__dirname + "/index.html");
});

// Gets json when appropriate
app.use(bodyparser.json());

// Handles login GET request
app.get("/login", (request, response) => {
  response.sendFile(__dirname + "/login.html");
});

app.get("/user", (request, response) => {
  response.sendFile(__dirname + "/user.html");
})

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
app.post("/submit", (request, response) => {
  console.log("POST Request: Submit");
  
  const jsonInput = request.body;

  console.log("POST Request Data:");
  console.log(jsonInput);

  if(jsonInput._id === null) { // New submission
    // Find if there is a highscore to replace
    findHighscore(jsonInput.game).then( (currentHS) => {
      if(currentHS !== null) { // Found highscore, time to see if it's to be replaced
        console.log("Found Highscore", currentHS.score);
        if(jsonInput.score > currentHS.score) { // Replace highscore
          jsonInput.highscore = true; // Update to true locally

          const targetID = { _id: mongodb.ObjectId(currentHS._id)}; // Update to false in the database
          const updateJSON = { $set: { highscore: false } }
          updateDatabaseItem(targetID, updateJSON);
        }
      } else { // Did not find highscore, it's now the highscore
        jsonInput.highscore = true;
      }
      addDatabaseItem(jsonInput).then( () => {
        response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
        response.end();
      });
    });

  } else { // Must be a modification
    db.collection("GameData").find({}).toArray(function(err, result) {
      for(let i = 0; i < appdata.length; i++) {
        if(appdata[i].id === jsonInput.id) { // ID Matches
          
          appdata[i].name = jsonInput.name; // First, set the name

          // First, check if there's a game change
          if(appdata[i].game === jsonInput.game) { // Same game

            if(appdata[i].highscore === true) { // If it was the highscore
              appdata[i].score = jsonInput.score;
              let findHS = findHighscore(jsonInput.game);
              if(findHS !== i) {
                // The highscore is now a different entry
                appdata[i].highscore = false;
                appdata[findHS].highscore = true;
              }
              
            } else if(appdata[i].highscore === false) { // If it wasn't the highscore
              let findHS = findHighscore(jsonInput.game);
              appdata[i].score = jsonInput.score;
              if (appdata[findHS].score < jsonInput.score) {
                // It is the highscore now
                appdata[i].highscore = true;
                appdata[findHS].highscore = false;
              }
            }

          } else { // Different game
            let previousGame = appdata[i].game; // Save the previous game
            let newGameCurrentHS = findHighscore(jsonInput.game); // Grab the highscore for the game that we're switching to
            
            appdata[i].game = jsonInput.game; // Change game in appdata

            // First, update the highscore for the previous game
            let previousGameHS = findHighscore(previousGame);
            if(previousGameHS !== -1) { // If there is a new highscore
              appdata[previousGameHS].highscore = true;
            }

            // Then, update the highscore for the new game
            appdata[i].score = jsonInput.score;
            if(newGameCurrentHS !== -1) { // There is a current highscore
              let newGameUpdateHS = findHighscore(jsonInput.game);
              if(i === newGameUpdateHS) { // New highscore
                appdata[i].highscore = true;
                appdata[newGameCurrentHS].highscore = false;
              }
            } else { // There isn't a current highscore
              appdata[i].highscore = true;
            }

          }

          console.log("Modification Complete");

          break;  // Stop search
        }
      }
    });
  }

  //response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
  //response.end();
});

// Handles delete POST request
app.post("/delete", (request, response) => {
  console.log("POST Request: Delete");

  const jsonInput = request.body;

  console.log("POST Request Data:");
  console.log(jsonInput);
  const searchID = { _id: mongodb.ObjectId(jsonInput._id) };

  searchDatabaseItem(searchID).then( (result) => {
    let hsStatus = result.highscore;
    deleteDatabaseItem(searchID).then( () => {
      if(hsStatus === true) {
        let hsNew = findHighscore(result.game); // Find the high score for a specific game
        if(hsNew !== -1) {
          const targetID = { _id: result._id};
          hsNew.highscore = true;
          updateDatabaseItem(targetID, hsNew);
        }
      }
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
      response.end();
    });  
  });
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