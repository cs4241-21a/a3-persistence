const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      bodyParser = require( 'body-parser' ),
      cookie = require('cookie-session'),
      helmet = require('helmet'),
      app = express()

//var path = require('path');
///var favicon = require('serve-favicon');
//app.use(favicon(__dirname+'/public/img/mmico.ico'))
app.use( express.static('public') );
//app.use( helmet() );
app.use( express.json() );
app.use(
  cookie({
    name: "session",
    keys: ["cookieA", "cookieB"]
  })
);
const uri = 'mongodb+srv://'+'kwmcfatter'+':'+'howdyThere'+'@'+'kylewm.cui7b.mongodb.net'

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null


client.connect()
  .then( () => {
    return client.db( 'kylewm' ).collection( 'myCollection' )
  })
  .then( __collection => {
    collection = __collection
    return collection.find({ }).toArray()
  })
  .then( console.log )
  
// route to get all docs

app.get( '/entries', (req,res) => {
  if( collection !== null ) {
    // get array and pass to res.json
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})


app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/tracker", (request, response) => {
  response.sendFile(__dirname + "/views/tracker.html");
});
  
app.listen( 3000 )

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post("/register", bodyParser.json(), (request, response) => {
  console.log("registering works!");

  collection
    .find({ usr: request.body.usr })
    .toArray()
    .then(result => {
      if (result.length >= 1) {
        console.log(result)
        response.json({ login: false });
      } else {
        //user does not exist, create
        let newUser = {
          usr: request.body.usr,
          pwd: request.body.pwd,
          entries: []
        };

        console.log(newUser);
        collection.insertOne(newUser);
        collection.insertOne(newUser);
        console.log("registering");
        console.log(request.body.usr);
        request.session.usr = request.body.usr;
        console.log("name:");
        console.log(request.session.usr);
        console.log(request.session.usr);
        request.session.login = true;
        response.json({ login: true });
      }
    });
});

app.post("/login", bodyParser.json(), (request, response) => {
  console.log("login works!");
  collection
    .find({ usr: request.body.usr, pwd: request.body.pwd })
    .toArray()
    .then(result => {
      if (result.length >= 1) {
        request.session.usr = request.body.usr;
        request.session.login = true;
        console.log("valid login");
        console.log(request.session.usr);
        response.json({ login: true });
      } else {
        console.log("invalid login")
        response.json({ login: false });
      }
    });
});

app.post("/logout", bodyParser.json(), (request, response) => {
  if (request.session.login == true) {
    request.session.usr = "";
    request.session.login = false;

    response.json({ logout: true });
  }else{
    response.json({ logout: false })
  }
});


app.post( '/add', (req,res) => {
  // assumes only one object to insert
  collection.insertOne( req.body ).then( result => res.json( result ) )
})

app.get("/getname", bodyParser.json(), (request, response) => {
  console.log("getname called! ");
  console.log(request.session.login);
  console.log(request.session.usr);
  response.json({ usr: request.session.usr });
});

app.get("/getMMCounts", bodyParser.json(), (request, response) => {
  console.log("getMMcounts called!")
  collection
    .find({ usr: request.session.usr })
    .toArray()
    .then(result => {
      let entries = result[0].entries;
      console.log(result[0]);
      console.log(entries);
      console.log("entries^");
      response.json(entries);
    });
});

app.post("/logMMCount", bodyParser.json(), (request, response) => {
  collection
    .find({ usr: request.session.usr })
    .toArray()
    .then(result => {
      let entries = result[0].entries;
      entries.push({
        mmCount: request.body.mmCount,
        mmColor: request.body.mmColor
      });

      collection.updateOne(
        { _id: mongodb.ObjectId(result[0]._id) },
        { $set: { entries: entries } }
      );
      response.json(entries);
    });
});


app.post("/deleteEntry", bodyParser.json(), (request, response) => {
  collection
    .find({ usr: request.session.usr })
    .toArray()
    .then(result => {
      let entries = result[0].entries;

      if (entries[request.body.index]) {
        entries.splice(request.body.index, 1);
      }

      collection.updateOne(
        { _id: mongodb.ObjectId(result[0]._id) },
        { $set: { entries: entries } }
      );
      response.json(entries);
    });
});

app.post("/updateEntry", bodyParser.json(), (request, response) => {
  console.log("update entry called!")
  collection
    .find({ usr: request.session.usr })
    .toArray()
    .then(result => {
      let entries = result[0].entries;

      
      console.log(request.body);
      console.log("request.body^")
      let updatedEntry = {
        mmCount: request.body.mmCount,
        mmColor: request.body.mmColor,
        index: request.body.index
      };
      
      console.log(updatedEntry.mmCount);
      if (entries[request.body.index]) {
        entries[request.body.index] = updatedEntry;
      }

      collection.updateOne(
        { _id: mongodb.ObjectId(result[0]._id) },
        { $set: { entries: entries } }
      );

      response.json(entries);
    });
});
/*
app.post( '/remove', (req,res) => {
  collection
    .deleteOne({ _id:mongodb.ObjectId( req.body._id ) })
    .then( result => res.json( result ) )
})

app.post( '/update', (req,res) => {
  collection
    .updateOne(
      { _id:mongodb.ObjectId( req.body._id ) },
      { $set:{ name:req.body.name } }
    )
    .then( result => res.json( result ) )
})
*/