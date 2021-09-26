const express = require( "express" ),
      mongoose = require( "mongoose" ),
      app = express();

app.use(express.json());
app.use(express.urlencoded());

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
app.post("/createUser", (req, res) => {
  let newUser = new User({
    userName: request.body.userName,
    password: request.body.password
  });
  newUser.save().then( () => {
    console.log("Created a new user.");
  })
})

// Start up the server
app.listen(3000, () => {
   console.log('Server listening on 3000');
})