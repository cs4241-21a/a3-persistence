let nextID = 4; // If you have default ID's being set, make sure this one gets set to an available ID 

const appdata = [
  { 'name': 'AAA', 'score': 43, 'game': 'Mario Bros.', 'highscore': true, 'id': 0},
  { 'name': 'ABC', 'score': 67, 'game': 'Donkey Kong', 'highscore': true, 'id': 1},
  { 'name': 'ZZZ', 'score': 168, 'game': 'Street Racing', 'highscore': true, 'id': 2},
  { 'name': 'E', 'score': 2, 'game': 'Mario Bros.', 'highscore': false, 'id': 3}
];

const express       = require('express'),
      app           = express(),
      bodyparser    = require('body-parser'),
      port          = 3000;

// Make all files in 'public' available
app.use(express.static("public"));

// Make sure that index gets loaded anyway
app.get("/", (request, respone) => {
  response.sendFile(__dirname + "/index.html");
});

// Gets json when appropriate
app.use(bodyparser.json());

app.post("/update", (request, response) => {
  console.log("POST Request: Update");

  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
  response.end(JSON.stringify(appdata));
});

// Handles submit POST request
app.post("/submit", (request, response) => {
  console.log("POST Request: Submit");
  
  const jsonInput = request.body;

  console.log("POST Request Data:");
  console.log(jsonInput);

  if(jsonInput.id === -1) { // New submission
    // Set the ID
    jsonInput.id = nextID;
    nextID++;

    // Find if there is a highscore to replace
    let findHS = findHighscore(jsonInput.game);
    if(findHS !== -1) { // Found highscore, time to see if it's to be replaced
      if(jsonInput.score > appdata[findHS].score) { // Replace highscore
        appdata[findHS].highscore = false;
        jsonInput.highscore = true;
      }
    } else { // Did not find highscore, it's now the highscore
      jsonInput.highscore = true;
    }

    appdata.push(jsonInput); // Add the json info into appdata
    console.log("Submission Complete");

  } else { // Must be a modification
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
  }

  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
  response.end();
});

// Handles delete POST request
app.post("/delete", (request, response) => {
  console.log("POST Request: Delete");

  const jsonInput = request.body;

  console.log("POST Request Data:");
  console.log(jsonInput);

  // Only item in this JSON object is the ID; that's all we need
  for(let i = 0; i < appdata.length; i++) {
    if(appdata[i].id === jsonInput.id) { // ID Matches
      let hsStatus = appdata[i].highscore;
      let hsGame = appdata[i].game;
      appdata.splice(i, 1);
      console.log("Deletion Complete");

      if(hsStatus === true) { // We then need to find a new highscore
        let hsNew = findHighscore(hsGame); // Find the high score for a specific game
        if(hsNew !== -1) {
          appdata[hsNew].highscore = true;
        }
      }

      break; // Stop search
    }
  }

  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
  response.end();
});

// Takes a specific game and returns the position of the highscore for that game
// Returns -1 if that game doesn't exist or if no highscore exists
function findHighscore(game) {
  let hsCounter = -1;
  let hsScoreCounter = -1;
  
  for(let i = 0; i < appdata.length; i++) {
    if(appdata[i].game === game && appdata[i].score > hsScoreCounter) {
      hsScoreCounter = appdata[i].score;
      hsCounter = i;
    }
  }

  return hsCounter;
}

const listener = app.listen(process.env.PORT || port, () => {
  console.log("Server running");
  console.log("Listening on port " + listener.address().port);
});

/*
const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000;

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response );
  } else if( request.method === 'POST' ) {
    handlePost( request, response );
  }
});

// Takes a specific game and returns the position of the highscore for that game
// Returns -1 if that game doesn't exist or if no highscore exists
function findHighscore(game) {
  let hsCounter = -1;
  let hsScoreCounter = -1;
  
  for(let i = 0; i < appdata.length; i++) {
    if(appdata[i].game === game && appdata[i].score > hsScoreCounter) {
      hsScoreCounter = appdata[i].score;
      hsCounter = i;
    }
  }

  return hsCounter;
}

// Handle GET requests (don't touch this you fool, you moron)
const handleGet = function( request, response ) {
  console.log("GET Request URL: %s", request.url);
  const filename = dir + request.url.slice( 1 );

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' );
  } else {
    sendFile( response, filename );
  }
}

// Handle POST requests
const handlePost = function( request, response ) {

  // Create a string based on the data that comes with the POST request
  let dataString = '';
  request.on( 'data', function( data ) {
      dataString += data; 
  });

  // Continue with the POST request
  request.on( 'end', function() {

    if(request.url === '/update') { // Update request, nothing in the dataString, send appdata
      console.log("POST Request: Update");

      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
      response.end(JSON.stringify(appdata));
      return;
    }

    // Take the string and create a JSON object
    const jsonInput = JSON.parse(dataString);

    if(request.url === '/delete') { // Delete request
      console.log("POST Request: Delete");
      console.log("POST Request Data:");
      console.log(jsonInput);

      // Only item in this JSON object is the ID; that's all we need
      for(let i = 0; i < appdata.length; i++) {
        if(appdata[i].id === jsonInput.id) { // ID Matches
          let hsStatus = appdata[i].highscore;
          let hsGame = appdata[i].game;
          appdata.splice(i, 1);
          console.log("Deletion Complete");

          if(hsStatus === true) { // We then need to find a new highscore
            let hsNew = findHighscore(hsGame); // Find the high score for a specific game
            if(hsNew !== -1) {
              appdata[hsNew].highscore = true;
            }
          }

          break; // Stop search
        }
      }

    } else if(request.url === '/submit') { // Handle modify case as well
      console.log("POST Request: Submit");
      console.log("POST Request Data:");
      console.log(jsonInput);

      if(jsonInput.id === -1) { // New submission
        // Set the ID
        jsonInput.id = nextID;
        nextID++;

        // Find if there is a highscore to replace
        let findHS = findHighscore(jsonInput.game);
        if(findHS !== -1) { // Found highscore, time to see if it's to be replaced
          if(jsonInput.score > appdata[findHS].score) { // Replace highscore
            appdata[findHS].highscore = false;
            jsonInput.highscore = true;
          }
        } else { // Did not find highscore, it's now the highscore
          jsonInput.highscore = true;
        }

        appdata.push(jsonInput); // Add the json info into appdata
        console.log("Submission Complete");

      } else { // Must be a modification
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
      }      
    }

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
    response.end();
  })
}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

console.log("Server running");
server.listen( process.env.PORT || port );*/