// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const session = require('express-session');
const app = express();
const bodyparser = require('body-parser');
const mongodb = require('mongodb');
const cookie  = require('cookie-session');
var userName = null;

// app.use( express.urlencoded({ extended:true }) )
app.set('trust proxy', 1) // trust first proxy

app.use( cookie({
  user: 'session',
  keys: ['key1', 'key2']
}))


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get('/index', (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get('/regist', (request, response) => {
  response.sendFile(__dirname + "/views/regist.html");
});

app.get('/login', (request, response) => {
  response.sendFile(__dirname + "/views/login.html");
});

app.get('/loginfail', (request, response) => {
  response.sendFile(__dirname + "/views/loginfail.html");
});


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://YangLyu:${process.env.PASS}@cluster0.hug98.mongodb.net/datatest?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// collection1 is for store user information
// collection2 is for manipulate the data
// database is just for the database we are using, which is datatest
let collection1 = null
let collection2 = null
let database = null

client.connect(err => {
  database = client.db("datatest");
  collection1 = database.collection("test");
  collection2 = database.collection("dataset");
});


app.post('/getTable', (req, res) => {
  console.log(req.session.user);
  collection2.find({username: req.session.user}).toArray(function(err, docs) {
      if(err) {
        console.log("Get data fail!")
      } else {
        if( docs.length >= 0) {
          res.json( docs )
        } else {
          console.log("Get data fail!")
        }
      }
    })
})


app.post('/signup', bodyparser.json(), function(req, res) {
  collection1.insertOne( req.body )
  .then( dbresponse => {
    console.log( dbresponse )
    // console.log( dbresponse.insertedId )
    res.json( {id:dbresponse.insertedId} )
  })
})


app.post('/signin', bodyparser.json(), function(req, res) {
  collection1.find(req.body).toArray(function(err, docs) {
    if(err) {
      res.json( {result:"fail"} )
    } else {
      if (docs.length > 0) {
        // console.log(docs)
        // successful login!
        // grad the username and save it in the session!
        // req.session.user = req.body.username;
        // req.session.save();
        // send the success message to the front end!
        // console.log('session222', req.session.user);
        req.session.login = true;
        req.session.user = req.body.name;
        // userName = req.body.username;
        console.log('username will display here:', req.session.user)
        
        res.json( {result:"success"} )
      } else {
        res.json( {result:"fail"} )
      }
    }
  })
})


app.post('/addData', bodyparser.json(), function(req, res) {
  
  const string1  = `{
  "username": "${req.session.user}"
  }`;
 
  const string2 = JSON.stringify(req.body);
 
  const obj1 = JSON.parse(string1);
  const obj2 = JSON.parse(string2);
  
  const mergedObject = {
    ...obj1,
    ...obj2
  };
  
  collection2.insertOne( mergedObject )
  .then( dbresponse => {
    collection2.find({username:req.session.user}).toArray(function(err, docs) {
      if(err) {
        console.log("Add in data fail!")
      } else {
        if( docs.length > 0) {
          res.json( docs )
        } else {
          console.log("Add in data fail!")
        }
      }
    })
  })
})


app.post('/deleteData', bodyparser.json(), function(req, res) {
  collection2.deleteOne({ name:req.body.name, username:req.session.user})
  .then(dbresponse => {
    collection2.find({username:req.session.user}).toArray(function(err, docs) {
      if(err) {
        console.log("Get data fail!")
      } else {
        if( docs.length > 0) {
          res.json( docs )
        } else {
          console.log("Get data fail!")
        }
      }
    })
  })  
})


app.post( '/update', bodyparser.json(), function(req,res) {
  collection2.updateOne(
    { name:req.body.name, username:req.session.user },
    { $set:{ savings:req.body.savings, cost:req.body.cost, balance:req.body.balance} }
  )
  .then(dbresponse => {
    collection2.find({username:req.session.user}).toArray(function(err, docs) {
      if(err) {
        console.log("Get data fail!")
      } else {
        if( docs.length > 0) {
          res.json( docs )
        } else {
          console.log("Get data fail!")
        }
      }
    })
  })
})


app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/views/login.html' )
})
