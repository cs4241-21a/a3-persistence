require('dotenv').config()
const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const { Db } = require('mongodb')
const cookieSession = require('cookie-session')
const passport = require('passport');
const mongodbclient = require( './services/mongodb-service.js' )
var favicon = require('serve-favicon')
var compression = require('compression')
var morgan = require('morgan')
require('./services/passport-service.js')
const validateLoginMiddleware = require('./services/passport-auth.js')
const port = 3000

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))
app.use(express.json())
app.use(cookieSession({
  name: 'github-user',
  keys: [process.env.cookieKey1, process.env.cookieKey2],
  maxAge: 24 * 60 * 60 * 1000
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(compression())

app.get('/auth/login', (req, res) => {
  console.log("Redirecting to login page /auth/login")
  res.sendFile(path.join(__dirname, '/public/login.html'));
})

app.get('/auth/github', passport.authenticate('github', {
  scope: [ 'user:email' ]
}));

app.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/auth/error'
}), function(req, res) {
  res.redirect('/');
});

app.get('/auth/error', (req, res) => {
  res.writeHeader( 400, { 'Content-Type': 'text/plain' })
  res.end("Could not authenticate you with GitHub, error from OAuth2")
})

app.get('/auth/getUserID', validateLoginMiddleware, (req, res) => {
  res.writeHeader( 200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ 'username': req.user.emails[0].value , 'status': 200}))
})




app.get('/', validateLoginMiddleware, (req, res) => {
  console.log('Getting /')
  res.sendFile(path.join(__dirname, '/private/main.html'));
})




app.get('/api/lostitems', validateLoginMiddleware, (req, res) => {
  mongodbclient.getLostItems()
  .then(e => {
    sendData(res, e)
  })
})

app.get('/api/founditems', validateLoginMiddleware, (req, res) => {
  mongodbclient.getFoundItems()
  .then(e => {
    sendData(res, e)
  })
})

app.post('/api/update', validateLoginMiddleware, (req, res) => {
  mongodbclient.getElement(req.body._id)
  .then(item => {
    if (!item) {
      res.writeHead( 404, "Invalid item in database", {'Content-Type': 'text/plain' })
      res.end() 
      return; 
    }
    if (req.user.emails[0].value === item.emailme) {
      mongodbclient.update(req.body)
      .then(e => {
        if (e === false) {
          res.writeHead( 404, "Invalid UID", {'Content-Type': 'text/plain' })
          res.end()  
        } else {
          res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
          res.end()  
        }
      })  
    } else {
      res.writeHead( 403, "Unauthorized", {'Content-Type': 'text/plain' })
      res.end()  
    }
  })
})

app.post('/api/create', validateLoginMiddleware, (req, res) => {
  let data = req.body
  let filtered = {
    'item' : data.item,
    'when' : data.when,
    'where' : data.where,
    'description' : data.description,
    'photo' : data.photo,
    'emailme' : data.emailme,
    'timestamp' : Date.now()
  }
  let collection = "lostItems"
  if (data.found === true) { collection = "foundItems"; }
  mongodbclient.create(collection, filtered)
  .then(e => {
    if (e) {
      res.writeHeader( 200 )
      res.end()
    } else {
      res.writeHeader( 404 )
      res.end()
    }  
  })
})

app.post('/api/delete', validateLoginMiddleware, (req, res) => {
  mongodbclient.delete(req.body._id)
  .then((e) => {
    if (e) {
      res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      res.end()    
    } else {
      res.writeHead( 404, "UID not found", {'Content-Type': 'text/plain' })
      res.end()  
    }
  })
})

const sendData = function( response, data ) {
  for (let i = 0; i < data.length; i++) {
    let timestampDate = new Date(data[i].timestamp)
    let elapsed = ((Date.now() - timestampDate) / (24 * 60 * 60 * 1000));
    data[i].created = Math.round(elapsed)
  }
  response.writeHeader( 200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(data))
}

let listener = app.listen(process.env.PORT || port, (e) => {
  console.log(`Example app listening at http://localhost:${listener.address().port}`)
})