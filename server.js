const express = require('express')
const { MongoClient } = require('mongodb')

require('dotenv').config()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const serveStatic = require('serve-static')
const compression = require('compression')
const expressHandlebars  = require('express-handlebars')
const csurf = require('csurf')

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(compression())
app.use(serveStatic('public'))
app.use(csurf({ cookie: true}))
app.use(function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.engine('handlebars', expressHandlebars())
app.set('view engine', 'handlebars')

const PORT = process.env.PORT
if (PORT == null || PORT == '') {
  PORT = 8000
}

const client = new MongoClient(process.env.DB_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})

async function getScoresCollection() {
  await client.connect()
  const database = client.db(process.env.DB_NAME)
  let scoresCollection = database.collection(process.env.DB_COLLECTION_SCORES)
  return scoresCollection
}

app.get('/', (req, res) => {
  res.render('home', { csrfToken: req.csrfToken(), layout: false })
})

app.get('/scores', async (req, res) => {
  scores = await getScores()
  res.json(scores)
})

app.post('/score', async (req, res) => {
  const body = req.body
  incrementScore(body.username, body.score)
  scores = await getScores()
  res.json(scores)
})

app.post('/removeScore', async (req, res) => {
  const body = req.body
  removeScore(body.username)
  scores = await getScores()
  delete scores[body.username]
  console.log(scores)
  res.json(scores)
})

async function getScores() {
  let scores = {}

  const collection = await getScoresCollection()
  const cursor = await collection.find()
  if (await cursor.count() > 0) {
    await cursor.forEach(score => scores[score.username] = score.score)
  }
  console.log(scores)
  await client.close()
  return scores
}

async function incrementScore(username, score) {
  const collection = await getScoresCollection()
  await collection.updateOne({username}, {
      $inc: {
        score
      }
    },
    { upsert: true }
  )
  await client.close()
}

async function removeScore(username) {
  const collection = await getScoresCollection()
  await collection.deleteOne({username})
  await client.close()
}

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})
