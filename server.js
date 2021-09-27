const fs   = require( 'fs' ),
      mime = require( 'mime' ),
      express = require('express'),
      body_parser = require('body-parser'),
      morgan  = require('morgan'),
      favicon = require('serve-favicon'),
      passport = require('passport'),
      GitHubStrategy = require('passport-github2').Strategy,
      mongodb = require('mongodb'),
      session  = require('express-session'),
      path  = require('path'),
      app     = express(),
      dir  = 'public/',
      port = 3001

require('dotenv').config();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(':method :url :status - :response-time ms'));

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

app.use(passport.initialize());

passport.serializeUser(function(user, cb){
  cb(null, user);
})

passport.deserializeUser(function(user, cb) {
  cb(null, user);
})

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://a3-david-mahany.glitch.me/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    cb(null, profile);
  }
));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication
    req.session.login = true;
    req.session.username = req.user.id;

    collection.findOne({ username: req.session.username }).then(result => {
      if(result === null){
        let data = {
          username: req.session.username,
          // note missing password field on github users
          tasks: []
        }
        collection.insertOne(data).then(result => {
          console.log(result);
          // this is just a guess on how to check if it was successful
          if(result.acknowledged && result.insertedId !== null) {
            res.redirect('/');
          }
        });
      } else {
        res.redirect('/');
      }
    });
});

app.post( '/login', body_parser.json(), (req,res)=> {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body )
  
  collection.findOne({ username: req.body.username }).then(result => {
    if(result !== null) {
      // note result.password only exists on non-github users, so this always fails for github users (as expected)
      if(result.password === req.body.password) {
        // define a variable that we can check in other middleware
        // the session object is added to our requests by the cookie-session middleware
        req.session.login = true
        req.session.username = req.body.username;
        
        // since login was successful, send the user to the main content
        // use redirect to avoid authentication problems when refreshing
        // the page or using the back button, for details see:
        // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
        res.redirect('index.html');
      }else{
        res.status(403);
        res.json({msg: "Incorrect login info."});
      }
    }else{
      res.status(403);
      res.json({msg: "Incorrect login info."});
    }
  });
});

app.post( '/signup', body_parser.json(), (req,res)=> {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  console.log( req.body )

  let data = {
    username: req.body.username,
    password: req.body.password, // this field is only on non-github users
    tasks: []
  }

  collection.findOne({ username: req.body.username }).then(result => {
    if(result === null){
      collection.insertOne(data).then(result => {
        console.log(result);
        // this is just a guess on how to check if it was successful
        if(result.acknowledged && result.insertedId !== null) {
          req.session.login = true
          req.session.username = req.body.username;

          res.redirect('index.html');
        }
      });
    }else{
      res.status(403);
      res.json({msg: "There is already a user with that username."});
    }
  });

  // res.redirect('index.html');
  
  // // below is *just a simple authentication example* 
  // // for A3, you should check username / password combos in your database
  // if( req.body.password === 'test' ) {
  //   // define a variable that we can check in other middleware
  //   // the session object is added to our requests by the cookie-session middleware
  //   req.session.login = true
  //   req.session.username = req.body.username;
    
  //   // since login was successful, send the user to the main content
  //   // use redirect to avoid authentication problems when refreshing
  //   // the page or using the back button, for details see:
  //   // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
  //   res.redirect('index.html');
  // }else{
  //   // password incorrect, redirect back to login page
  //   res.status(403);
  //   res.json({msg: "Incorrect login info."});
  // }
});

app.post( '/logout', (req,res)=> {
  req.session.destroy(function(err) {
    console.error("Failed to destroy session: " + err);
  })
  res.sendFile(__dirname + '/public/index.html');
})

// redirect unauthenticated users to login
app.use( function( req,res,next) {
  console.log(req.session.login);
  console.log(req.session.username);
  if( req.session.login === true || req.originalUrl === "/js/login.js" || req.originalUrl === "/robots.txt" )
    next()
  else
    res.sendFile( __dirname + '/public/login.html' )
});

app.use(express.static(dir));

// Set up MongoDB

const db_uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;

const client = new mongodb.MongoClient(db_uri, { useNewUrlParser: true, useUnifiedTopology:true });
let collection = null;

client.connect()
  .then( () => {
    return client.db('datatest1').collection('data');
  })
  .then(__collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then(console.log);

app.use( (req,res,next) => {
  if( collection !== null ) {
    next();
  }else{
    res.status( 503 ).send();
  }
});

// Endpoints

app.get('/', function(_req, response) {
  response.sendFile( __dirname + '/views/index.html' )
});

let appdata = [];

app.get('/get', function(req, response) {

  collection.findOne({ username: req.session.username }).then(result => response.json(result.tasks));

  // response.writeHead( 200, "OK", {'Content-Type': 'application/json' });
  // response.write(JSON.stringify(appdata));
  // response.end();
});

app.post( '/submit', body_parser.json(), function( request, response ) {
  console.log(request.body);
  const data = request.body;
  switch(data.action) {
    case "add":
      collection.findOne({ username: request.session.username }).then(result => {
        let tasks = result.tasks;

        // copying the fields manually is more secure than blindly copying the whole object
        tasks.push({
          task: data.payload.task,
          priority: data.payload.priority,
          creationDate: data.payload.creationDate,
          deadline: calcDeadline(data.payload),
        });

        collection.updateOne(
          { _id: mongodb.ObjectId( result._id ) },
          { $set: { tasks } }
        ).then(res => {
          console.log(res);
          collection.findOne({ username: request.session.username }).then(result => response.json(result.tasks));
        });
      });
      break;
    case "modify":
      collection.findOne({ username: request.session.username }).then(result => {
        let tasks = result.tasks;

        tasks[data.index].task = data.payload.task;
        tasks[data.index].priority = data.payload.priority;
        tasks[data.index].deadline = calcDeadline(tasks[data.index]);

        collection.updateOne(
          { _id: mongodb.ObjectId( result._id ) },
          { $set: { tasks } }
        ).then(res => {
          console.log(res);
          collection.findOne({ username: request.session.username }).then(result => response.json(result.tasks));
        });
      });
      break;
    case "delete":
      collection.findOne({ username: request.session.username }).then(result => {
        let tasks = result.tasks;

        tasks.splice(data.index, 1);

        collection.updateOne(
          { _id: mongodb.ObjectId( result._id ) },
          { $set: { tasks } }
        ).then(res => {
          console.log(res);
          collection.findOne({ username: request.session.username }).then(result => response.json(result.tasks));
        });
      });
      break;
    default:
      // invalid POST request
      response.writeHead(400);
      response.end();
      return;
  }
})

app.listen(process.env.PORT || port);

const calcDeadline = function(data) {
  let date = new Date(data.creationDate);
  date.setDate(date.getDate() + { low: 10, medium: 7, high: 4 }[data.priority]);
  return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}