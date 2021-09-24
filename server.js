const express = require( 'express' ),
      cookie  = require( 'cookie-session' ),
      mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      passport = require('passport'),
      DateTime = require('luxon'),
      morgan = require('morgan'),
      app = express()

require('dotenv').config()

var GitHubStrategy = require("passport-github-oauth20").Strategy
const GHUser = require("./models/user.js")
const todoItem = require("./models/todoitem.js")
const todoList = require("./models/todolist.js")
const localUser = require("./models/localuser.js")

app.use(passport.initialize())
app.use(passport.session())
//app.use(express.static('public'))
app.use(express.json())
app.use(morgan('combined'))

const saltRounds = 10

const { Schema } = mongoose;

mongoose.connect(process.env.DB_URL)

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  localUser.findOne({ username: user.username}, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GH_CLIENT_LOCAL,
      clientSecret: process.env.GH_SECRET_LOCAL,
      callbackURL: process.env.GH_CALLBACK_LOCAL,
    },
    async function (accessToken, refreshToken, profile, cb) {
      var user;

      if (await localUser.model.findOne({ username: profile.id }) == null) {
        console.log(profile)
        user = new localUser.model({ username: profile.id, displayname: profile.displayName, password: null, todolist: [], todocompleted: []})
        await user.save()
      } else {
        user = await localUser.model.findOne({ username: profile.id})
      }
      return cb(null, user)

      //GHUser.model.create({ id: profile.id, todolist: newlist}, function (err, user) {
      //  return cb(err, user);
      //});
    }
  )
);

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2]
}))

app.get("/github", passport.authenticate("github", { scope: ["user"] }));

app.get("/github/callback",
  passport.authenticate("github", { failureRedirect: "/?error=20" }),
  function (req, res) {
    req.session.login = true
    req.session.username = req.user.username
    req.session.displayname = req.user.displayname
    res.redirect("/")
  }
)

app.post('/register', async (req, res) => {
  if (req.body.password == "" || req.body.username == "") {
    res.redirect("/?error=40")
    return
  }

  if (await localUser.model.findOne({ username: req.body.username }) != null) {
    res.redirect("/?error=41")
    return
  }

  const hashed = await bcrypt.hash(req.body.password, saltRounds)

  const newuser = new localUser.model({username: req.body.username, displayname: req.body.username, password: hashed, todolist: [], todocompleted: []})

  await newuser.save()

  res.redirect('/?error=42')
})

app.post( '/login', async (req,res)=> {
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  //console.log( req.body )

  if (req.body.password == "" || req.body.username == "") {
    res.redirect("/?error=10")
    return
  }

  const user = await localUser.model.findOne({username: req.body.username})
  if (user == null) {
    res.redirect('/?error=11')
    return
  }

  const pwdresult = await bcrypt.compare(req.body.password, user.password)
  if (pwdresult != true) {
    res.redirect('/?error=12')
    return
  }

  // Auth complete, can store auth cookie & uname
  req.session.login = true
  req.session.username = user.username
  req.session.displayname = user.displayname

  //console.log(user)

  res.redirect('/')
})

app.post('/logout', (req, res, next) => {
    req.session.login = false
    req.session.username = ''
    req.session.displayname = ''
    res.redirect('/?error=30')
})

app.get('/getData', async (req, res) => {
  const user = await localUser.model.findOne({username: req.session.username})
  const todolist = user.todolist
  for (let item of todolist) {
      var nowdate = DateTime.DateTime.now()
      var tododate = DateTime.DateTime.fromFormat(item.duedate, "yyyy-LL-dd")
      var diffDays = tododate.diff(nowdate, 'days')
      item.importance = 100 - Math.ceil(item.priority * diffDays.toObject().days)
      if (item.importance > 100) {
        item.importance = 101
      }
  
      if (item.importance < 0) {
        item.importance = 0
      }
  }
  //res.writeHead(200, "OK", {"Content-Type": "text/plain"})
  res.send(JSON.stringify(todolist))
})

app.get("/getCompletedData", async (req, res) => {
  const user = await localUser.model.findOne({username: req.session.username})
  const todocompleted = user.todocompleted
  res.send(JSON.stringify(todocompleted))
})

app.post('/postData', async (req, res) => {
  const user = await localUser.model.findOne({username: req.session.username})
  user.todolist.push(req.body)
  await user.save()
  
  //res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  res.send("OK")
})

app.delete('/deleteData', async (req, res) => {
  const user = await localUser.model.findOne({username: req.session.username})
  user.todolist.splice(req.body.index, 1)
  await user.save()

  res.send("OK")
})

app.delete('/deleteData', async (req, res) => {
  const user = await localUser.model.findOne({username: req.session.username})
  user.todolist.splice(req.body.index, 1)
  await user.save()

  res.send("OK")
})

app.delete('/completeData', async (req, res) => {
  const user = await localUser.model.findOne({username: req.session.username})
  user.todocompleted.unshift(user.todolist[req.body.index])
  user.todolist.splice(req.body.index, 1)
  await user.save()

  res.send("OK")
})

app.patch('/patchData', async (req, res) => {
  const user = await localUser.model.findOne({username: req.session.username})
  const index = parseInt(req.body.index)

  user.todolist[index]['name'] = req.body.name
  user.todolist[index]['priority'] = req.body.priority
  user.todolist[index]['duedate'] = req.body.duedate
  user.todolist[index]['category'] = req.body.category

  await user.save()
  res.send("OK")
})

app.get("/", (req, res) => {
  if (req.session.login === true) {
    res.sendFile(__dirname + "/public/app.html")
  } else {
    res.sendFile(__dirname + "/public/index.html")
  }
})

app.get("/whoami", (req, res) => {
  res.send(req.session.displayname)
})

app.use( express.static('public') )

// add some middleware that always sends unauthenicaetd users to the login page
//app.use( function( req,res,next) {
//  var orig = req.originalUrl
//  console.log(req.url)
//  console.log(req.url == null)
//  console.log(req.url == undefined)
//  console.log(req.url == "")
//  if (req.originalURL == "") {
//    console.log("here")
//    if (req.session.login === true) {
//      res.sendFile(__dirname + "/public/app.html")
//    } else {
//      res.sendFile(__dirname + "/public/index.html")
//    }
//  }})

//app.get('/', (req, res) => {
//    res.sendFile(__dirname + "/public/app.html")
//})

// serve up static files in the directory public
const PORT = process.env.PORT || 3000;
app.listen( PORT )
