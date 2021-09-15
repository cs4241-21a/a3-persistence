const express = require( 'express' ),
    mongodb = require( 'mongodb' ),
    app = express(),
    port = 3000

app.use( express.static('public') )
app.use( express.json() )

// make sure to substitute your username / password for tester:tester123 below!!! 
const uri = 'mongodb+srv://hmkyriacou:bHYCiPtad5DtBOKH@a3-cluster.wk5nt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
          // will only create collection if it doesn't exist
          return client.db( 'dataset' ).collection( 'test' )
        })
  .then( __collection => {
          // store reference to collection
          collection = __collection
          // blank query returns all documents
          return collection.find({ }).toArray()
        })
  .then( console.log )

app.listen(port, () => {
    console.log(`Listening at https://localhost:${port}`)
})
