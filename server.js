const
    port = 3300,
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require("path"),
    favicon = require("serve-favicon"),
    timeout = require("connect-timeout"),
    responseTime = require('response-time'),
    cookie  = require( 'cookie-session' );
const {ObjectId} = require("mongodb");

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://a3-user:6BTVRjXHm6dZ9Rt@a3-persistence.iokop.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.json())
app.use(favicon(path.join(__dirname, 'favicon.ico')))
app.use(timeout('5s'))
app.use(responseTime())

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

app.post("/login", ((req, res) => {
  let user = req.body
  console.log(`Attempting to login ${user.username}`)

  client.connect(err => {
    client.db("a3db").collection("users").find({}).toArray().then(data => {
      console.log(data)
      if (data.length === 0) {
        res.send(JSON.stringify({"status": "invalid username or password"}))
        return
      }
      let found = false;
      data.forEach(u => {
        if (user.username === u.username && user.password === u.password) {
          req.session.login = true
          req.session.username = user.username
          console.log(`successfully logged in ${user.username}`)
          res.send(JSON.stringify({"status": "success"}))
          found = true;
        }
      });
      if (!found) {
        res.send(JSON.stringify({"status": "invalid username or password"}))
      }
    });
  });

}))

app.post("/create", ((req, res, next) => {
  let user = req.body
  console.log(`Creating user ${user.username}`)
  client.connect(err => {
    const users = client.db("a3db").collection("users");
    users.insertOne({username: user.username, password: user.password}).then((result) => {
      console.log(result)
      client.close();
      req.session.login = true
      console.log(req.session.username)
      console.log(`successfully logged in ${user.username}`)
      res.send(JSON.stringify({"status": "success"}))
    })
  });
}))

app.use( function( req,res,next) {
  if(req.session.login) {
    //console.log("user logged in")
    next()
  }
  else if (req.originalUrl.endsWith("login.js") || req.originalUrl.endsWith(".css") || req.originalUrl.endsWith(".txt")) {
    next()
  }
  else {
    console.log("user not logged in")
    res.sendFile( __dirname + '/public/login.html' )
  }
})

app.use(express.static('public'))


app.get("/database", (req, res) => {
  console.log(`Sending data`)
  res.set('Content-Type', 'application/json')
  client.connect(err => {
    client.db("a3db").collection("entries").find({username: req.session.username}).toArray().then(data => {
      console.log(data)
      res.send(JSON.stringify(data))
    });
  });
})

app.post("/delete", (req, res) => {
  let id = req.body.id
  client.connect(err => {
    client.db("a3db").collection("entries").deleteOne({_id: ObjectId(id)}).then(result => {
      console.log(result)
      res.send(JSON.stringify(result))
    })
  });
})

app.post('/submit', (req, res) => {
  console.log(req.body)
  let entry = req.body
  console.log(`Received: ${entry}`)
  entry['className'] = getClassName(entry.gradYear)
  entry['username'] = req.session.username
  res.set('Content-Type', 'application/json')
  res.send(JSON.stringify(entry))
  client.connect(err => {
    const entries = client.db("a3db").collection("entries");
    if (entry._id !== "") {
      let id = entry._id
      delete entry["_id"]
      entries.updateOne({_id: ObjectId(id)}, {$set:
            {
              name: entry.name,
              major: entry.major,
              gradYear: entry.gradYear,
              highlight: entry.highlight,
              className: entry.className
            }
      }).then((response) => {
        console.log(response)
        client.close()
      })
    } else {
      delete entry["_id"]
      entries.insertOne(entry).then(() => {
        client.close();
      })
    }
  });
})

function getClassName(gradYear) {
  if (gradYear === '2022') {
    return 'Senior'
  } else if (gradYear === '2023') {
    return 'Junior'
  } else if (gradYear === '2024') {
    return 'Sophomore'
  } else {
    return 'Freshman'
  }
}

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
