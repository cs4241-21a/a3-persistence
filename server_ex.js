const express = require('express'),
  mongodb = require('mongodb'),
  serveStatic = require('serve-static'),
  bodyParser = require('body-parser')
  app = express(),
  cookie = require('cookie-session'),
  dir = 'public/',
  port = 3000 
  ObjectID = require('mongodb').ObjectID,
  morgan = require('morgan'),
  favicon = require('serve-favicon'),
  path = require('path')

require('dotenv').config();
app.use(morgan('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

const faces = ["(・`ω´・)", ";;w;;", "owo", "UwU", ">w<", "^w^", "(･.◤)", "^̮^", "(>人<)", "( ﾟヮﾟ)", "(▰˘◡˘▰)"];
const emojis = ["❤", "🤣", "😍", "😜", "😝", "😬", "🤪", "😳"];

const uri = 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let db = null;

client.connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db('assignment_3')
  })
  .then(__db => {
    // store reference to collection
    db = __db
  })


app.use(serveStatic('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookie({
  name: 'session',
  keys: ['Lucce', 'Janey']
}))

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/public/login.html`)
});

app.post('/login', async function (req, res) {
  let name = req.body.name;
  let pass = req.body.pass;
  let newUser = false;

  let result = await db.collection('users').findOne({ _id: name });

  if (!result) {
    let obj = {
      _id: name,
      pass: pass
    }

    let firstRecord = {
      "from": "God",
      "to": name,
      "fancyFont": false,
      "oworeplace": 0,
      "message": "Hello! Welcome to the message board!",
      "fromowo": owoify("God", 0),
      "messageowo": owoify("Hello! Welcome to the message board!", 0)
    }

    appdata = obj.records;
    db.collection("users").insertOne(obj);
    db.collection("records").insertOne(firstRecord)
    newUser = true;
    console.log("new user detected")
  }

  if (newUser || result.pass === pass) {
    req.session.login = true;
    req.session.username = name;
    res.redirect(`/message_board.html`)
  } else {
    // password incorrect, redirect back to login page
    res.sendFile(__dirname + '/public/login_failed.html')
  }
});

app.get('/getMessagesTo', async function (req, res) {
  let query = { to: req.session.username };
  let appdata = [];
  let results = await db.collection("records").find(query); 
  results.forEach(function (elt, idx) {
    appdata.push(elt);
  }).then(() => {
    res.send(JSON.stringify(appdata))
  })

});

app.get('/getMessagesFrom', async function (req, res) {
  let query = { from: req.session.username };
  let appdata = [];
  let results = await db.collection("records").find(query);
  results.forEach(function (elt, idx) {
    appdata.push(elt);
  }).then(() => {
    res.send(JSON.stringify(appdata))
  })
})

app.post('/submit', bodyParser.json(), async function (req, res) {
  let obj = {
    from: req.session.username,
    to: req.body.name,
    fancyFont: req.body.fancyFont,
    oworeplace: req.body.checkedRadio,
    message: req.body.message,
    fromowo: owoify(req.session.username, req.body.checkedRadio),
    messageowo: owoify(req.body.message, req.body.checkedRadio)
  }
  await db.collection('records').insertOne(obj);

  res.send(JSON.stringify({
    obj: obj,
    loggedInUser: req.session.username
  }));
});

app.post('/update', bodyParser.json(), async function (req, res) {
  const query = {
    _id: ObjectID(req.body.dbid)
  }
  const resultSet = await db.collection('records').findOne(query);
  let updateFields;
  if (resultSet.message === req.body.message && resultSet.oworeplace === req.body.checkedRadio) {
    updateFields = {
      $set: {
        fancyFont: req.body.fancyFont
      }
    }
  } else {
    updateFields = {
      $set: {
        fancyFont: req.body.fancyFont,
        oworeplace: req.body.checkedRadio,
        message: req.body.message,
        messageowo: owoify(req.body.message, req.body.checkedRadio)
      }
    }
  }

  const updateResults = await db.collection('records').updateOne(query, updateFields);
  console.log("Number updated: " + updateResults.modifiedCount)

  res.send("It worked");
});

app.post('/delete', bodyParser.json(), async function (req, res) {
  const query = {
    _id: ObjectID(req.body.dbid)
  }
  const result = await db.collection('records').deleteOne(query);
  console.log("Number deleted: " + result.deletedCount);
  res.send("wahoo");
});

function owoify(text, expReplace) {
  let v = text.replace(/[lr]/g, 'w').replace(/[LR]/g, 'W').replace(/n[aeiou]/g, 'ny').replace(/N[aeiou]/g, 'Ny').replace(/N[AEIOU]/g, 'NY');
  let numExclaimations = 0;
  switch (expReplace) {
    case 0: // text faces
      numExclaimations = (v.match(/!/g) || []).length;
      for (let i = 0; i < numExclaimations; i++) {
        v = v.replace('!', " " + faces[getRandomInt(0, faces.length)] + " ");
      }
      break;
    case 1: // emojis
      numExclaimations = (v.match(/!/g) || []).length;
      for (let i = 0; i < numExclaimations; i++) {
        v = v.replace('!', " " + emojis[getRandomInt(0, emojis.length)] + " ");
      }
      break;
  }
  return v;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

app.listen(process.env.PORT || port)
