const bodyParser = require('body-parser')
const express = require('express')
const mongodb = require('mongodb')
require('dotenv').config()
const app = express()
// var bodyparser = require('body-parser')


const uri = 'mongodb+srv://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.HOST
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let collection = null

client.connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db('a3').collection('data')
  })
  .then(__collection => {
    // store reference to collection
    collection = __collection
  })


let _id = 0

const appdata = []

const getPercentDead = function (dob, gender) {
  let year = dob.substr(0, 4)
  let month = dob.substr(5, 2)
  let day = dob.substr(8, 2)
  const today = new Date();
  const curYear = today.getFullYear()
  const curMonth = today.getMonth() + 1
  const curDay = today.getDate()
  if (curDay < day) { month++ }
  const age = (curYear - year) * 12 + (curMonth - month)
  let expectedDeath = 0
  switch (gender) {
    case 'Male':
      expectedDeath = 75.1 * 12
      break;
    case 'Female':
      expectedDeath = 80.5 * 12
      break;
    case 'Other':
      expectedDeath = 77.8 * 12
      break;
  }
  return `${((age / expectedDeath) * 100).toFixed(2)}%`
}

app.use(function (req, res, next) {
  console.log('url:', req.url)
  next()
})

app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use((request, response, next) => {
  if (collection !== null) {
    next()
  } else {
    response.status(503).send()
  }
})

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html')
})

app.post('/add', function (request, response) {
  console.log(request.body)
  const percentDead = getPercentDead(request.body.yourdob, request.body.yourgender)
  request.body.percentDead = percentDead
  collection.insertOne(request.body)
    .then(result => {
      console.log(result.insertedId.toString())
      request.body._id = result.insertedId.toString()
      console.log('ADD:')
      console.log(request.body)

      response.json(request.body).end()
    })
})

app.post('/update', function (request, response) {
  collection
    .updateOne(
      { _id: mongodb.ObjectId(request.body._id) },
      {
        $set: {
          yourname: request.body.yourname,
          yourdob: request.body.yourdob,
          yourgender: request.body.yourgender,
          percentDead: getPercentDead(request.body.yourdob, request.body.yourgender)
        }
      }
    )
    .then(function () {
      collection.findOne({ _id: mongodb.ObjectId(request.body._id) })
        .then(result => {
          console.log('UPDATE:')
          console.log(result)
          response.json(result).end()
        })
    })
})

app.post('/remove', function (request, response) {

  console.log('REMOVE:')
  console.log(request.body)
  collection
    .deleteOne({ _id: mongodb.ObjectId(request.body._id) })
    .then(function () { response.json(request.body) })
})

app.post('/all', function (request, response) {
  console.log("Sending appdata")
  // get array and pass to res.json
  collection.find({}).toArray()
    .then(function (result) {
      console.log(result)
      response.json(result).end()
    })
})

app.listen(process.env.PORT || 3000)