const express = require( 'express' ),
      bodyParser = require('body-parser'),
      mongodb = require( 'mongodb' ),
      cookie = require("cookie-session"),
      app = express()

app.use( express.static('public') )
app.use( express.json() )

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )
// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

const uri = "mongodb+srv://TestUser:Mario35@cluster0.oxb6m.mongodb.net/"


const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'Webware4241' ).collection( 'userdata' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )

  
// route to get all docs
app.get( '/', (req,res) => {
  if( collection !== null ) {
    // get array and pass to res.json
    //debugger
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})

app.post( '/submit', bodyParser.json(), (req,res) => {
  // assumes only one object to insert
  console.log(req.body);
  if(req.body.hasOwnProperty("playername") && req.body.hasOwnProperty("playerscore")){
    let requestBodyVar = req.body;
    addData(requestBodyVar, req.body.name, req.body.score);
    collection.insertOne( requestBodyVar ).then( result => res.json( result ) )
  } else {
    console.log("Invalid parameters!");
  }
  
  //Check to make sure this is typical user data
  //collection.insertOne( req.body ).then( result => res.json( result ) )
})
  
app.listen( 3000 )


function addData(appdata, playerName, playerScore){

  let addedName = playerName;
  let addedScore = parseInt(playerScore);

  let addedRank;
  let currentScore;
  let isRankPlaced;
  for(let i = 0; i < appdata.length; i++){
      if(!isRankPlaced){
        currentScore = appdata[i].score;
        console.log("Examining " + appdata[i].name + " in rank " + appdata[i].rank)

        //Check to see if the new score exceeds the analyzed score
        if(addedScore > currentScore){
            console.log(addedScore + " is higher than " + currentScore + " in rank" + appdata[i].rank)
            //If it does
            // -give the current rank to the added rank 
            // -lower the added rank
            addedRank = i+1;
            appdata[i].rank += 1;
            isRankPlaced = true;
        }
      } else {
          //Lower the rank of the other appdata 
          appdata[i].rank += 1;
      }
      
  }

  //If this is the lowest score, indicate it's the last rank
  if(!isRankPlaced){
    addedRank = appdata.length + 1;
  }

  appdata = {name: addedName, score: addedScore, rank: addedRank};
}

//Removes a piece of data from the table
function removeData(appdata, row){
  console.log("CURRENT ROW: " + row)

  //remove data
  let isItemRemoved = false;
  for(let element of appdata){
    if(element.name === row){
      appdata.splice(element.rank-1, 1);
      isItemRemoved = true;
      break;
    }
  }
  if(!isItemRemoved){
    console.log("Something fishy is happening...");
  } else {
    //Reassign item ranks
    for(let i = 0; i < appdata.length; i++){
      appdata[i].rank = i+1;
    }
  }
}



