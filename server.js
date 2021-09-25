const express = require('express'),
      mongodb = require('mongodb'),
      app = express(),
      bodyParser = require('body-parser'),
      logger = require('morgan'),
      responseTime = require('response-time'),
      timeout = require('connect-timeout'),
      cookieParser = require('cookie-parser');
      

require('dotenv').config();

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(timeout('5s'))
app.use(logger('tiny'))
app.use(haltOnTimedout)

app.use(responseTime((req, res, time) => {
  console.log("Response Time: " + req.method, req.url, time + 'ms');
}));

app.use(haltOnTimedout)
app.use(cookieParser())

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null;
let user = null;
let userInfo = null;

client.connect()
  .then( () => {
    return client.db( 'SleepDataset' ).collection( 'SleepData' )
  })
  .then( __collection => {
    collection = __collection
    return collection.find({ }).toArray()
  })
  .then( console.log )
  
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
  console.log("Cookies: ", request.cookies)
});

app.get("/login.html", (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get("/index.html", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/sleep", (req, res) => {
  if (collection !== null) {
    collection.find({username:user}).toArray()
      .then(result => res.json(result));
  }
});

app.post("/submit", bodyParser.json(), function(req,res) {
    console.log('body: ', req.body)
     
      req.body.username = user

      collection.insertOne(req.body)
      .then( insertResponse => collection.findOne( insertResponse.insertedId ) ) 
      .then( findResponse   => res.json( findResponse ))
    })
  
//Add a route to remove a todo
app.post( '/remove', (req,res) => {
    collection
      .deleteOne({ _id:mongodb.ObjectId( req.body.idElement) })
      .then(result => res.json(result))
})

//Add a route to update a document
app.post( '/update', (req,res) => {
    collection
      .updateOne({ _id:mongodb.ObjectId( req.body.id ) },
        {$set:{ 
          yourname:req.body.yourname,
          major:req.body.major,
          hours:req.body.hours,
          advice:req.body.advice
         }}
      )
      .then( result => res.json( result ) )
})

client.connect().then(() => {
  userInfo = client.db("SleepDataset").collection("UserData");
});

app.post("/login", bodyParser.json(), function (req, res) {

  userInfo.find({ username: req.body.username, password: req.body.password }).toArray()
    .then(result => res.json(result));
  user = req.body.username;
});

app.post('/logout', bodyParser.json(), function(req,res){
  user = null
})

app.post('/signin', bodyParser.json(), function(req, res) {
  userInfo.insertOne(req.body)
      .then( insertResponse => userInfo.findOne( insertResponse.insertedId)) 
      .then( findResponse   => res.json(findResponse))
      user = req.body.username
})

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

app.listen(process.env.PORT || 3000)