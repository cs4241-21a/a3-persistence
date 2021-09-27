const express    = require('express'),
      mongodb    = require('mongodb'),
      cookie     = require ('cookie-session'),
      cookieparser = require('cookie-parser'),
      bodyparser = require('body-parser'),
      env = require('dotenv').config()
      

      
const favicon = require('serve-favicon')
const iconPath = __dirname+'/public/favicon.ico';
const app = express()

const uri = 'mongodb+srv://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.HOST
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection = null;
client.connect()

app.use(express.json())
app.use(cookieparser())
app.use(bodyparser.json())
app.use(express.urlencoded({
   extended: true 
  }))

app.use(cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.post( '/add', (req,res) => {
  collection = client.db('Scoreboard').collection('Entries')
  collection.findOne({Username: req.session.username}).then(user => {
    if (user === null) {
      if (req.body.money === "") {
        let playerData = {
          'Username': req.session.username,
          'gender': req.body.gender,
          'money': 100
        }
        collection.insertOne(playerData)
      } else {
        let playerData = {
          'Username': req.session.username,
          'gender': req.body.gender,
          'money': parseInt(req.body.money)
        }
        collection.insertOne(playerData)
      }
    } else {
        collection.updateOne({Username: req.session.username},{$set:{money: parseInt(req.body.money)}})
      }
  })
  res.redirect("main.html")
})

app.post('/removeAcc', (req,res) => {
  collection = client.db('Accounts').collection('Users')
  collection.deleteOne({"username": `${req.session.username}`})
  collection = client.db('Scoreboard').collection('Entries')
  collection.deleteOne({"Username": `${req.session.username}`})
  req.session.login = false;
  res.redirect("index.html")
})

app.post('/removeScore', (req,res) => {
  collection = client.db('Scoreboard').collection('Entries')
  collection.deleteOne({"Username": `${req.session.username}`})
  res.redirect("main.html")
})

app.get('/getUserInfo', (req,res) => {
  collection = client.db('Scoreboard').collection('Entries')
  collection.findOne({Username: req.session.username}).then(user => {
    res.send(JSON.stringify(user))
  })
})

app.get('/getAllScores', (req,res) => {
  collection = client.db('Scoreboard').collection('Entries')
  collection.find({}).toArray((err, result) => {
    if (err) throw (err)
    res.send(JSON.stringify(result))
    console.log(result)
  })
  res.status(200)
})

app.post('/accountManage', (req,res) => {
  res.redirect("accountManage.html")
})

app.post('/viewScores', (req,res) => {
  res.redirect("scoreboard.html")
})

app.post('/returnToMain', (req,res) => {
  res.redirect("main.html")
})

app.post('/updateAccPage', (req,res) => {
  res.redirect("updateAccount.html")
})

app.post('/updateAcc', (req,res) => {
  let oldUsername = req.session.username
  collection = client.db('Scoreboard').collection('Entries')
  collection.updateOne({"Username": `${oldUsername}`},
  {$set:{Username: req.body.username}})

  collection = client.db('Accounts').collection('Users')
  collection.updateOne({"username": `${oldUsername}`},
  {$set:{username: req.body.username, password: req.body.password}})
  req.session.username = ""
  req.session.login = false
  res.redirect("index.html")
})

// even with our static file handler, we still
// need to explicitly handle the domain name alone...
app.get('/', function(request, response) {
  response.sendFile( __dirname + '/public/index.html' )
})

app.post( '/login', (req,res)=> {
  let account = {
    'username': req.body.username,
    'password': req.body.password
  }
  collection = client.db('Accounts').collection('Users')
  collection.findOne(account).then((user) =>{
    if(user !== null) {
      req.session.login = true
      req.session.username = req.body.username
      res.redirect('main.html')
    } else {
      res.sendFile( __dirname + '/public/index.html' )
    }
  })
})

app.post( '/register', (req,res) => {
  collection = client.db('Accounts').collection('Users')
  collection.findOne({username: req.body.username}).then((user) => {
    if (user == null) {
      const account = {
        'username': req.body.username,
        'password': req.body.password
      }
      collection.insertOne(account).then(() => {
        req.session.login = true
        req.session.username = req.body.username
        res.redirect('main.html')
      })
    }
    else {
      res.sendFile(__dirname + '/public/index.html')
    }
  })
})

app.post( '/submit', (req, res) => {
  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end(JSON.stringify())
})

app.use(function(req,res,next) {
  if(req.session.login === true || req.originalUrl === "/index.js") {
    next()
  }
  else {
    res.sendFile( __dirname + '/public/index.html' )
  }
})

app.use(express.static('public'))
app.use(favicon(iconPath))

const listener = app.listen(process.env.PORT, function() {
    console.log( 'Your app is listening on port ' + listener.address().port )
  })
