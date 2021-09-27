const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      {MongoClient} = require('mongodb')


app.use( express.static("public"))


let collection = null
main().catch(console.error);



app.get("/", (req, res) => [
  res.sendFile(__dirname + "/views/index.html")
])

app.get("/results", (req, res) => [
  res.sendFile(__dirname + "/views/results.html")
])

app.get("/tasks", (req, res) => {
  console.log("Request for tasks")
  res.json()
})

app.post("/submit", bodyParser.json(), (req, res) => {
  console.log("Received something")
  console.log(JSON.stringify( req.body ))
  
  collection.insertOne( req.body ).then( result => res.json( result ) )
})


async function main() {
  const uri = "mongodb+srv://"+process.env.USER+":"+process.env.PASS+"@"+process.env.HOST
  console.log(uri)
  const client = new MongoClient(uri, { useNewUrlParser: true})
  
  try {
    await client.connect()
    .then( () => {
      return client.db( 'DatabaseName' ).collection( 'CollectionName' )
    })
    .then( __collection => {
      collection = __collection
      return collection.find({ }).toArray()
    })
    .then( console.log )

    await listDatabases(client)
  }catch (e) {
      console.error(e);
  } finally {
  }
}

async function listDatabases(client){
    let databasesList = await client.db().admin().listDatabases()
 
    console.log("Databases:")
    databasesList.databases.forEach(db => console.log(` - ${db.name}`))
}

app.listen( 3000 )