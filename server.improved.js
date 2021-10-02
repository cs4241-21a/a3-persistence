const bodyParser = require('body-parser')
const express = require('express')
const mongodb = require('mongodb')
const crypto = require('crypto')
const cookie = require('cookie-session')
require('dotenv').config()
const app = express()
const favicon = require('serve-favicon')
// var bodyparser = require('body-parser')


const uri = 'mongodb+srv://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.HOST
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let data = null
let logins = null

client.connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db('a3').collection('data')
  })
  .then(collection => {
    // store reference to collection
    data = collection
  })
  .then(() => {
    return client.db('a3').collection('logins')
  })
  .then(collection => {
    logins = collection
  })

const activeSessions = []

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

const validatePassword = function (user, pass) {
  const hash = crypto.pbkdf2Sync(pass, user.salt, 1000, 64, `sha512`).toString(`hex`)
  return hash === user.hash
}

const createUser = function (user) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(user.password, salt, 1000, 64, `sha512`).toString(`hex`)
  const userObj = { username: user.username, salt: salt, hash: hash }
  logins.insertOne(userObj)
    .then(result => {
      console.log('ADD USER:')
      console.log(user.username)
    })
}

app.use(favicon(__dirname + '/public/images/' + 'favicon.ico'))

app.use(function (req, res, next) {
  console.log('url:', req.url)
  next()
})

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use((request, response, next) => {
  if (data !== null) {
    next()
  } else {
    console.log(data)
    response.status(503).send()
  }
})

app.use(cookie({
  name: 'session',
  keys: [process.env.KEY1, process.env.KEY2]
}))

app.post('/add', function (request, response) {
  console.log(request.body)
  const percentDead = getPercentDead(request.body.yourdob, request.body.yourgender)
  request.body.percentDead = percentDead
  request.body.owner = request.session.username
  data.insertOne(request.body)
    .then(result => {
      console.log(result.insertedId.toString())
      request.body._id = result.insertedId.toString()
      console.log('ADD:')
      console.log(request.body)

      response.json(request.body).end()
    })
})

app.post('/update', function (request, response) {
  data
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
      data.findOne({ _id: mongodb.ObjectId(request.body._id) })
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
  data
    .deleteOne({ _id: mongodb.ObjectId(request.body._id) })
    .then(function () { response.json(request.body) })
})

app.post('/all', function (request, response) {
  // get array and pass to res.json
  data.find({ owner: request.session.username }).toArray()
    .then(function (result) {
      console.log(result)
      response.json(result).end()
    })
})

app.post('/login', function (request, response) {
  console.log(request.body)
  logins.findOne({ username: request.body.username })
    .then(result => {
      console.log(result)
      if (result === null) {
        createUser(request.body)
        request.session.login = true
        request.session.username = request.body.username
        console.log('created user')
        return response.redirect('/index.html')
      } else {
        if (validatePassword(result, request.body.password)) {
          request.session.login = true
          request.session.username = result.username
          console.log('successful login')
          return response.send({
            message: 'Login Success'
          })
        } else {
          request.session.login = false
          console.log('failed login')
          return response.status(200).send({
            message: 'Wrong Password'
          })
        }
      }
    })
})

app.post('/signout', function (request, response) {
  request.session.login = false
  console.log('logging user out')
  response.redirect('/login.html')
})

app.get('/js/login.js')

app.get('/login.html', function (req, res) {
  res.sendFile(__dirname + '/public/login.html')
})

app.get('/css/signin.css', function (request, response) {
  response.sendFile(__dirname + '/public/css/signin.css')
})

app.get('/robots.txt', function (request, response) {
  response.sendFile(__dirname + '/public/robots.txt')
})

app.use(function (req, res, next) {
  if (req.session.login === true)
    next()
  else {
    console.log('failed load')
    res.redirect('/login.html')
  }
})

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/index.html')
})

app.use(express.static('public'))

app.listen(process.env.PORT || 3000)