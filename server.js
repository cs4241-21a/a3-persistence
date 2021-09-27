const express = require('express'),
  mongodb = require('mongodb'),
  morgan = require('morgan'),
  responseTime = require('response-time'),
  timeout = require('connect-timeout'),
  serveStatic = require('serve-static'),
  helmet = require('helmet'),
  app = express()

require('dotenv').config()

app.use(express.static('public'))
app.use(express.json())
app.use(timeout('5s'))
app.use(morgan('tiny'))
app.use(haltOnTimedout)
app.use(responseTime((req, res, time) => {
  console.log("Response Time: " + req.method, req.url, time + 'ms');
}));
app.use(haltOnTimedout)
app.use(serveStatic('public'))
app.use(haltOnTimedout)
app.use(helmet())
app.use(haltOnTimedout)

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

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

app.post('/login', (req, res) => {
  let formData = req.body
  let query = { username: req.body.username }

  userCollection.findOne(query).then(
    result => {
      if (result != null) {
        if (result.password === req.body.password) {
          formData._id = result._id.toString()
        }
        else {
          formData.status = "Bad"
        }
      }
      else {
        userCollection.insertOne(req.body).then(
          result => {
            formData._id = result.insertedId.toString()
          })
      }
      res.json(formData)
    })
})

app.post('/fill', (req, res) => {
  let query = { username: req.body.username }

  collection.find(query).toArray(function (err, result) {
    if (err) { throw err }
    else {
      res.json(result)
    }
  })
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
