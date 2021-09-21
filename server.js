require('dotenv').config()
const express = require('express'), 
      mongodb = require('mongodb'),
      bodyparser = require('body-parser'),
      morgan = require('morgan'),
      cookieParser = require('cookie-parser'),
      app = express()

app.use(express.json())
app.use(bodyparser.json()) //why depricated?
app.use(express.urlencoded({ extended:true})) 
app.use(morgan("tiny"))
app.use(cookieParser())

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection_data = null
let collection_users = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db('Database0').collection('Collection0')
  })
  .then( __collection_data => {
    // store reference to collection
    collection_data = __collection_data
    // blank query returns all documents
    return collection_data.find({ }).toArray()
  })
  .then(console.log)

  client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db('Database0').collection('Collection1')
  })
  .then( __collection_users => {
    // store reference to collection
    collection_users = __collection_users
    // blank query returns all documents
    return collection_users.find({ }).toArray()
  })
  .then(console.log)

  // route to get all docs
app.post( '/data', (req,res) => {
  if(collection_data !== null) {
    let body = req.body
    body.userId = req.cookies.userid

    collection_data.find(body).toArray().then(result => {
      if(result === null){
        res.json([])
      }
      else{
        res.json(result)
      }
    })
  }
})

app.post('/add', (req,res) => {
  // assumes only one object to insert
  let doc = req.body
  doc.tcal = doc.cal * doc.numserv
  doc.userId = req.cookies.userid

  collection_data.insertOne(doc)
  .then(insertResponse => collection_data.findOne(insertResponse.insertedId))
  .then(findResponse => res.json(findResponse))
})

app.post('/remove', (req,res) => {
  // assumes only one object to remove  
  collection_data.deleteOne({ _id:mongodb.ObjectId( req.body._id)})
  .then(result => res.json(result))
})

app.post('/update', (req,res) => {
  // assumes only one object to update  
  const newcal = req.body.cal
  const newserv = req.body.numserv
  const newtcal = newcal * newserv
  collection_data.updateOne(
    { _id:mongodb.ObjectId( req.body._id)},
    { $set:{cal:newcal, numserv:newserv, tcal:newtcal}})
  .then(result => res.json(result))
})

app.post('/login', (req,res) => {
  //login here
  const loginuser = {'username': req.body.username, 'password': req.body.password}
  collection_users.findOne(loginuser)
  .then(user => {
    console.log(user)
    if(user === null){
      res.sendFile( __dirname + '/public/index.html' )
    }
    else{
      res.cookie('login', true)
      res.cookie('userid', user._id)
      res.cookie('username', user.username)
      res.redirect( 'main.html')
    }
  })
})

app.post('/register', (req,res) => {
  //register here
  const registeruser = {'username': req.body.newusername, 'password': req.body.newpassword}
  collection_users.insertOne(registeruser)
  .then(insertResponse => collection_users.findOne(insertResponse.insertedId))
  .then(user => {
    res.cookie('login', true)
    res.cookie('userid', user._id)
    res.cookie('username', user.username)
    res.redirect( 'main.html')
  })
})

app.get('/logout', (req,res) => {
  res.cookie('login', false)
  res.cookie('userid', "")
  res.cookie('username', "")
  res.sendFile( __dirname + '/public/index.html')
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.use(express.static('public'))

app.listen(3000 || process.env.PORT)
