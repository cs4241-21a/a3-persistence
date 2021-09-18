const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      bodyparser = require('body-parser'),
      dotenv = require('dotenv').config(),
      app = express();

app.use( express.static('public') );
app.use( express.json() );

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
let userAccount = "";

app.get("/", (request, response) => {
  
  if (userAccount != null) {
    response.sendFile(__dirname + "/views/login.html")
  } else {
    response.sendFile(__dirname + "/views/index.html");
  }
  //response.sendFile(__dirname + "/views/login.html")
});

app.get("/index.html", (request, response) => {

  if (userAccount.length === 0) {
    response.sendFile(__dirname + "/views/login.html")
  } else {
    response.sendFile(__dirname + "/views/index.html");
  }
  //response.sendFile(__dirname + "/views/index.html");
});

/*app.get("/login.html", (request, response) => {

  if (userAccount.length === 0) {
    response.sendFile(__dirname + "/views/login.html")
  } else {
    response.sendFile(__dirname + "/views/index.html");
  }
  response.sendFile(__dirname + "/views/login.html");
});*/

app.get('/logout', function(request, response) {
  //request.logout
  response.ok = true;
  return response.end();
})

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db('SleepDataset').collection('SleepData')
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )

app.get('/api/getData', bodyparser.json(),async(request, response) => {
  const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true })
  await client.connect()
  const collection = client.db('SleepDataset').collection( 'SleepData' )
  const sleeps = await collection.find({username: userAccount}).toArray()
  await client.close()
  return response.json(sleeps)
  /*if (collection !== null) {
    collection.find({username: userAccount}).toArray()
    .then(result => response.json(result))
  }*/
}) 

app.post("/submit", bodyparser.json(), async(req,res) =>{
    console.log("body: ", req.body)
    
    console.log("username: ", req.body.username)

    const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true })
    await client.connect()
    const collection = client.db('SleepDataset').collection( 'SleepData' )
    req.body.username = userAccount
    console("req.body.username: ", req.body.username)
    await collection.insertOne( req.body )
    const dataInfo = await collection.find({username: userAccount}).toArray()
    await client.close()
    response.json(dataInfo)
    return response.end()
    /*collection.insertOne( req.body )
      .then( insertResponse => collection.findOne( insertResponse.insertedId ) ) 
      .then( findResponse   => res.json( findResponse ) )*/
})

//Add a route to remove a todo
app.post( '/remove', bodyparser.json(), function (req,res) {
    collection
      .deleteOne({ _id:mongodb.ObjectId( req.body.idElement ) })
      .then( result => res.json( result ) )
})

//Add a route to update a document
app.post( '/update', bodyparser.json(), function (req,res) {
    collection
      .updateOne(
        { _id:mongodb.ObjectId( req.body.id ) },
        { $set:{ 
          name:req.body.yourname,
          major:req.body.major,
          hours:req.body.hours,
          advice:req.body.advice } }
      )
      .then( result => res.json( result ) )
})

//Login

/*client.connect().then(()=> {
  collection = client.db("SleepDataset").collection("UserData");
})
let user = null;*/

app.post('/login', bodyparser.json(), async(req,response) => {

let userData = req.body
console.log("userData: ", userData);

let username = userData.username;
let password = userData.password;

//collection.find({username: username, password: password}).toArray().then(result => response.json(result))
//user = username
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
await client.connect()
const collection = client.db("SleepDataset").collection("UserData");
const user = await collection.find({username: username}).toArray()

  if (user.length === 0) {
  
    await collection.insertOne(userData)
    await client.close()
    userAccount = username
    response.ok = true
  
  } else {
    
    await client.close();
    console.log("password:", password)
    console.log("user:",JSON.stringify(user))
    
    if (user[0].password == password) {

      userAccount = username
      response.ok = false
  
    } else {
  
      userAccount = ""
      response.ok = false
      
    }
    return response.end()
  };
})

app.listen( 3000 )

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});