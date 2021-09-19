const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      bodyparser = require('body-parser'),
      dotenv = require('dotenv').config(),
      app = express();

app.use( express.static('public') )
app.use( express.json() )

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null
let account = "";

client.connect()
  .then( () => {
    return client.db( 'SleepDataset' ).collection( 'SleepData' )
  })
  .then( __collection => {
    collection = __collection
    return collection.find({ }).toArray()
  })
  .then( console.log )
  
// route to get all docs
/*app.get( '/', (req,res) => {
  res.sendFile(__dirname + "/views/index.html");
})*/

//New//
/*app.get("/index.html", (request, response) => {
  if(account.length == 0){
    response.sendFile(__dirname + "/views/login.html")
  } else {
    response.sendFile(__dirname + "/views/index.html")
  }
});
//New//
app.get("/", (request, response) => {
  if(account != null){
    response.sendFile(__dirname + "/views/login.html")
  } else {
    response.sendFile(__dirname + "/views/index.html")
  }
});*/

//New//
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
  //response.sendFile(__dirname + "/views/index.html");
});
//New//
app.get("/login.html", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});
//New//
app.get("/index.html", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

//New//
app.get("/sleep", (req, res) => {
  if (collection !== null) {
    collection
      .find({username:user})
      .toArray()
      .then(result => res.json(result));
  }
});

app.post("/submit", bodyparser.json(), function(req,res) {
    console.log('body: ', req.body)

      /*collection.insertOne( req.body )
      .then( insertResponse => collection.findOne( insertResponse.insertedId ) ) 
      .then( findResponse   => res.json( findResponse ) )*/

      //New//
      /*const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
      await client.connect()
      const collection = client.db("SleepDataset").collection("SleepData");
      req.body.username = account;
      console.log("usernmae:", req.body.username)
      await collection.insertOne(req.body)
      const appdata = await collection.find({username: account}).toArray()
      await client.close()
      res.json(appdata)
      return res.end()*/

      //New//
      
      req.body.username = user

      collection.insertOne( req.body )
      .then( insertResponse => collection.findOne( insertResponse.insertedId ) ) 
      .then( findResponse   => res.json( findResponse ))
    })
  
//Add a route to remove a todo
app.post( '/remove', (req,res) => {
    collection
      .deleteOne({ _id:mongodb.ObjectId( req.body.idElement) })
      .then( result => res.json( result ) )
})

//Add a route to update a document
app.post( '/update', (req,res) => {
    collection
      .updateOne(
        { _id:mongodb.ObjectId( req.body.id ) },
        { $set:{ 
          yourname:req.body.yourname,
          major:req.body.major,
          hours:req.body.hours,
          advice:req.body.advice
         } }
      )
      .then( result => res.json( result ) )
})
//logout button prevents adding to table for some reason

//New//
let loginCollection = null;
client.connect().then(() => {
  loginCollection = client.db("SleepDataset").collection("UserData");
});
let user = null;
app.post("/login", bodyparser.json(), function (req, res) {

  /*var userInfo = request.body
  console.log(userInfo)
  var username = userInfo.username
  var password = userInfo.password

  const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect()
  const collection = client.db("SleepDataset").collection("UserData");
  const user = await collection.find({username: username}).toArray()
  if(user.length === 0){
    await collection.insertOne(userInfo)
    await client.close()
    account = username
    response.ok = true;
  }
  else {
    await client.close()
    if(user[0].password == password){
      account = username
      response.ok = false;
    }
    else {
      account = ""
      response.ok = false;
    }
  }
  return response.end()*/
  loginCollection
    .find({ username: req.body.username, password: req.body.password })
    .toArray()
    .then(result => res.json(result));
  user = req.body.username;

});

app.post('/logout', bodyparser.json(), function(req,res){
  user = null
})

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

app.listen( 3000 )