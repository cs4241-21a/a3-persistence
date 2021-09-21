
////////////////////////////
//INITIAL SETUP/MIDDLEWARE//
////////////////////////////

const express = require( 'express' ),
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
    return client.db( 'Webware4241' ).collection( 'scoredata' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )

app.use( cookie ({
  name: 'session',
  keys: ['username', 'password']
}))
  
// route to get all docs
app.get( '/', (req,res) => {
  if( collection !== null ) {
    // get array and pass to res.json
    //debugger
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})

// get request for username
app.get( '/currentUser', (req, res) => {
  collection.find({name: req.session.username }).toArray().then( result => res.json( result ) )
})

//


/////////////////
//POST REQUESTS//
/////////////////

app.post( '/login', (req,res)=> {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered

  let loginUsername = req.body.username;
  let loginPassword = req.body.password;



  collection.find(({name: loginUsername})).toArray()
  .then(foundUsername =>{

    if(foundUsername.length > 0){
      //find user's password in the similar object
      let databasePassword = foundUsername[0].password;
  
      //check to see if the entered and database passwords line up
      if(loginPassword === databasePassword){

        //If so, perform cookie operations and redirect to main
        req.session.login = true
        req.session.username = loginUsername
        
        
        res.redirect( 'main.html' )
      } else {

        //reject user for bad password
        res.sendFile( __dirname + '/public/index.html' )
      }
    } else {
      //reject user for bad username
      res.sendFile( __dirname + '/public/index.html' )
    }
  }  
  )
})

//NOT REQUIRED
app.post( '/logout', (req,res)=> {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered

  let loginUsername = req.body.username;
  let loginPassword = req.body.password;



  collection.find(({name: loginUsername})).toArray()
  .then(foundUsername =>{

    if(foundUsername.length > 0){
      //find user's password in the similar object
      let databasePassword = foundUsername[0].password;
  
      //check to see if the entered and database passwords line up
      if(loginPassword === databasePassword){

        //If so, perform cookie operations and redirect to main
        req.session.login = true
        req.session.username = loginUsername
        
        
        res.redirect( 'main.html' )
      } else {

        //reject user for bad password
        res.sendFile( __dirname + '/public/index.html' )
      }
    } else {
      //reject user for bad username
      res.sendFile( __dirname + '/public/index.html' )
    }
  }  
  )
})

app.post( '/register', (req,res)=> {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  let regUsername = req.body.username;
  let regPassword = req.body.password;


  collection.find({name: regUsername}).toArray()
  .then(foundUsername => {
    if(foundUsername.length === 0) {

      //If so, perform cookie operations and redirect to main
      //req.session.login = true;
      //req.session.username = regUsername;

      //make a new user entry and insert it into the user collection
      let newUserObject = makeUserObject(regUsername, regPassword);
      collection.insertOne( newUserObject ).then( result => res.json( result ) )
      //reject user for bad username
      res.sendFile( __dirname + '/public/index.html' )
      return;

  
      // define a variable that we can check in other middleware
      // the session object is added to our requests by the cookie-session middleware
      
      
      // since login was successful, send the user to the main content
      // use redirect to avoid authentication problems when refreshing
      // the page or using the back button, for details see:
      // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
      
    }else{
      // We already created the user, don't bother
    }
  })
  
})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/index.html' )
})

// serve up static files in the directory public
app.use( express.static('public') )

app.post( '/submit', (req,res) => {

  // assumes only one object to insert
  if(req.body.hasOwnProperty("playername") && req.body.hasOwnProperty("playerscore")){

    //Update the score object of the player
    updatePlayerScore(req.session.username, req.body.playerscore);
    
    //Sort player data
    sortPlayerData();

    collection.find({ }).sort({rank: 1}).toArray().then( result => res.json( result ) )
    
  } else {
    console.log("Invalid parameters!");
  }
})

app.post( '/delete', (req,res) => {

  // assumes only one object to insert
  if(req.body.hasOwnProperty("playername") && req.body.hasOwnProperty("playerscore")){

    //Delete the score object of the player
    deletePlayerScore(req.body.playername);
    
    //Sort player data
    sortPlayerData();

    collection.find({ }).sort({rank: 1}).toArray().then( result => res.json( result ) )
    
  } else {
    console.log("Invalid parameters!");
  }
})

app.listen( 3000 )




////////////////////
//HELPER FUNCTIONS//
////////////////////

/**
 * 
 * @param {*} playerName - name of the player whose score is being updated
 * @param {*} playerScore - score value that will be replaced
 */
function updatePlayerScore(playerName, playerScore){
  collection.find(({name: playerName})).toArray()
  .then(foundUsername => {
    collection.updateOne(
      {_id: foundUsername[0]._id},
      {$set: {score: playerScore}}

      
      
    )
  })
}

/**
 * function that deletes the name of the player
 * @param {*} playerName - name of the player whose data is to be deleted
 */
function deletePlayerScore(playerName){
  collection.find({name: playerName}).toArray()
  .then(foundUsername => {
    collection.update(
      {$pull: foundUsername}
    )
  })
}

/**
 * 
 */
function sortPlayerData(){
  //sort in order of score
  collection.aggregate(
    [
      {$sort: {score: -1}}
    ]
  ).toArray().then(sorted_data => {
    console.log("Sorted data: " + sorted_data)
    //update the document in order using ids you got back
    for(let i = 0; i < sorted_data.length; i++){
      collection.updateOne(
        {_id: sorted_data[i]._id},
        {$set: {rank: i+1}}
        
      )
    }

    collection = sorted_data;
  })
}

/**
 * 
 * @param {*} username - username of user
 * @param {*} userPassword - password of user
 * @returns 
 */
function makeUserObject(username, userPassword){
  return {name: username, password: userPassword, score: 0, rank: 0};
}

//Removes a piece of data from the table
function removeData(appdata, row){

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