const express = require( "express" ),
      mongoose = require( "mongoose" ),
      path = require("path"),
      cookie  = require( "cookie-session" ),
      favicon = require('serve-favicon'),
      helmet = require("helmet"),
      User = require("./public/models/User.js"),
      Speedrun = require("./public/models/Speedrun.js"),
      app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

// favicon middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// cookie middleware
app.use( cookie({
  name: "session",
  keys: ["key100", "key200"]
}))

// Connect Mongoose to the server
mongoose.connect("mongodb+srv://tester:tester123@cluster0.qxfom.mongodb.net/datatest?retryWrites=true&w=majority", () => {
  console.log("Connected to MongoDB Atlas");
})

// Set up routing

app.get("/", function( req, res ){
  res.sendFile(path.join(__dirname+"/public/index.html"));
});

app.post("/login", (req, res) => {
  req.session.login = false
  User.findOne({ userName: req.body.userName }, function(err, user) {
    if (err === null && user === null) {
      console.log("Creating new user: " + req.body.userName);
      let newUser = new User({
        userName: req.body.userName,
        password: req.body.password
      });
      newUser.save().then( () => {
        console.log("Created a new user.");
        console.log(newUser.userName);
      })
      res.redirect("index.html");
    }
    else if (err === null && user !== null) {
      if (user.password === req.body.password) {
        console.log("Successful login for user: " + user.userName);
        req.session.login = true;
        req.session.userName = user.userName;
        res.redirect("main.html");
      }
      else {
        // password incorrect, redirect back to login page
        console.log("Unsuccessful login for user: " + user.userName);
        res.sendFile( __dirname + '/public/index.html' )
      }
    }
  })
})

app.post( '/addSpeedrun', (req,res) => {
  let newSpeedrun = new Speedrun({
    userName: req.session.userName,
    inGameTimer: req.body.inGameTimer,
    totalDeaths: req.body.totalDeaths,
    totalStrawberries: req.body.totalStrawberries,
    inputType: req.body.inputType,
    platform: req.body.platform,
    dateCompleted: req.body.dateCompleted
  });
  newSpeedrun.save().then( () => {
    console.log("Added a new speedrun:");
    console.log(newSpeedrun);
  })
  //collection.insertOne( req.body )
  //  .then( insertResponse => collection.findOne( insertResponse.insertedId ) ) 
  //  .then( findResponse   => res.json( findResponse ) )
  res.redirect("main.html");
})

app.delete( "/removeSpeedrun", (req, res) => {
  mongoose.findByIdAndDelete(req.body.dbid);
  print("Deleted Speedrun with Id: " + req.body.dbid);
  res.redirect("main.html");
})

// add some middleware that always sends unauthenicated users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/index.html' )
})

// static middleware: serve up static files in the directory public
app.use( express.static('public') )

// Sets "X-Content-Type-Options: nosniff"
app.use(helmet.noSniff());

// Start up the server
app.listen(3000, () => {
   console.log('Server listening on 3000');
})