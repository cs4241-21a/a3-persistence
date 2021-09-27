const express = require("express"),
  mongodb = require("mongodb"),
  bodyParser = require("body-parser"),
  cookie = require("cookie-session"),
  morgan = require("morgan"),
  app = express();


app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());

const path = require("path");

morgan(":method :url :status :res[content-length] - :response-time ms");

const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://evallabbe:${process.env.DBPASS}@a3cluster.ybyse.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let PCollection = null;
client
  .connect()
  .then(() => {
    //will only create collection if doesn't exist
    return client.db("PizzaDB").collection("PizzaCollection");
  })
  .then(__PCollection => {
    //store reference to collection
    PCollection = __PCollection;
    //blank query returns all documents
    return PCollection.find({}).toArray();
  });

app.get("/", (req, res) => {
  if (PCollection !== null) {
    PCollection.find({})
      .toArray()
      .then(result => res.json(result));
  }
});

app.get('/data', (req, res) => {
  if (PCollection !== null) {
    PCollection.find({ }).toArray().then( result => res.json( result ) )
  }
})


//---------------------Post Stuff-------------------//

app.post( '/add', (req,res) => {
  // assumes only one object to insert
  PCollection.insertOne( req.body )
  .then( insertResponse => PCollection.findOne(insertResponse.insertedId) )
  .then( findResponse => res.json( findResponse))
})



app.listen(process.env.PORT || 3000 )