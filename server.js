const express = require('express'),
  mongodb = require('mongodb'),
  morgan = require('morgan'),
  app = express()

require('dotenv').config()

app.use(express.static('public'))
app.use(express.json())
app.use(morgan('tiny'))

const uri = 'mongodb+srv://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.HOST

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

let collection = null
let userCollection = null

client.connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db('Database1').collection('test')
  })
  .then(__collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({}).toArray()
  })

client.connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db('Database1').collection('users')
  })
  .then(__collection => {
    // store reference to collection
    userCollection = __collection
    // blank query returns all documents
    return userCollection.find({}).toArray()
  })

app.post('/submit', (req, res) => {
  let year = req.body.year
  let d = new Date()
  let age = d.getFullYear() - year

  let formData = req.body
  formData.age = String(age);

  collection.insertOne(req.body).then(
    result => {
      formData._id = result.insertedId.toString()
      res.json(formData)
    })
})

app.post('/remove', (req, res) => {
  collection
    .deleteOne({ _id: mongodb.ObjectId(req.body._id) })
    .then(result => res.json(result))
})

app.post('/edit', (req, res) => {
  collection.updateOne(
    { _id: mongodb.ObjectId(req.body._id) },
    { $set: { yourname: req.body.yourname, make: req.body.make, model: req.body.model, year: req.body.year, plateNum: req.body.plateNum, age: req.body.age } }
  )
    .then(result => res.json(result))
})

app.listen(3000)
