
/*
const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000

const appdata = [
  {'name': 'm', 'score': 1999, 'rank': 1},
]

//get/post request that lets me get app data

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    if(request.url === "/submit-player-score"){

    } else if(request.url === "/delete-player-score"){
      
    }
    //if it's add, do add
    //if it's delete, do delete
    handlePost( request, response ) 
  }
})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 



  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''
  console.log(request.url)

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    console.log("data parsed successfully")
    console.log( JSON.parse( dataString ) )
    

    console.log("Before: ");
    for(let i = 0; i < appdata.length; i++){
      console.log(appdata[i]);
    }

    if(request.url === "/submit"){
      let newPlayerData = JSON.parse( dataString);
      addData(appdata, newPlayerData.playername, newPlayerData.playerscore);
    } else if(request.url === "/deleteScore"){
      console.log("poggies")
      let deleteRequest = JSON.parse(dataString);
      removeData(appdata, deleteRequest.playername);
    }
    

    console.log("After: " + appdata)
    for(let i = 0; i < appdata.length; i++){
      console.log(appdata[i]);
    }

    // ... do something with the data here!!!



    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    //if we submit a request that requires us to get the data
      //response.end(appdata)
   

    console.log(JSON.stringify(appdata))
    response.end(JSON.stringify(appdata))
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

server.listen( process.env.PORT || port )

*/

const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      app = express()

app.use( express.static('public') )
app.use( express.json() )

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

app.post( '/add', (req,res) => {
  // assumes only one object to insert
  collection.insertOne( req.body ).then( result => res.json( result ) )
})
  
app.listen( 3000 )


function addData(appdata, playerName, playerScore){

  console.log("New player score: " + playerScore);
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


  //Push the new data to appdata and then sort the appdata
  appdata.push({name: addedName, score: addedScore, rank: addedRank});
  appdata.sort((a, b) => {
      return a.rank - b.rank;
  });
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



