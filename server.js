const express = require('express')

const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(express.static('public'))

const DIR = 'public/'
const PORT = 3000

const scores = {'Liam': 26}

app.get('/scores', (req, res) => {
  res.json(scores)
})

app.post('/score', (req, res) => {
  const body = req.body
  console.log(body)
  if (scores[body.username]) {
    scores[body.username] += body.score
  } else {
    scores[body.username] = body.score
  }
  res.json(scores)
})

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})
