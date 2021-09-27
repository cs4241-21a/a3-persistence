const express = require( "express" ),
      mongoose = require( "mongoose" ),
      path = require("path"),
      cookie  = require( "cookie-session" ),
      app = express();

const AUTH = true;

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

// cookie middleware
app.use( cookie({
  name: "session",
  keys: ["key100", "key200"]
}))

// Define Mongoose Schema
const userSchema = mongoose.Schema({
  userName: {type: String, unique: true, required: true},
  password: {type: String, required: true}
})

let User = mongoose.model("User", userSchema);

const patientSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true}
})

let Patient = mongoose.model("Patient", patientSchema);

// Connect Mongoose to the server
mongoose.connect("mongodb+srv://tester:tester123@cluster0.qxfom.mongodb.net/datatest?retryWrites=true&w=majority", () => {
  console.log("Connected to MongoDB Atlas");
})

// Set up routing

app.get("/", function( req, res ){
  res.sendFile(path.join(__dirname+"/public/index.html"));
});

app.post("/login", (req, res) => {
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

// add some middleware that always sends unauthenicated users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/index.html' )
})

// serve up static files in the directory public
app.use( express.static('public') )

// Start up the server
app.listen(3000, () => {
   console.log('Server listening on 3000');
})