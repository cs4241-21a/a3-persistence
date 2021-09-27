const express = require('express')

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

const PORT = 3000

const scores = {'Liam': 26}

app.get('/', (req, res) => {
  res.render('home', { csrfToken: req.csrfToken(), layout: false })
})

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
