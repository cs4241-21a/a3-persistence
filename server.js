import express from "express";
import { MongoClient } from "mongodb";

const port = 3000;

const uri = "mongodb+srv://a3-app:a3-app@cluster0.fe9fr.mongodb.net/";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

await client.connect();

await client.db("test").collection("hello").insertOne({ hi: 328 });

await client.close();

const app = express();

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
