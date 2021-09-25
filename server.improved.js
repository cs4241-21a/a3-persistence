
const
      env = require('dotenv').config(),
      http = require('http'),
      fs = require('fs'),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require('mime'),
      dir = 'public/',
      port = 3000,
      express = require('express'),
      bodyparser = require( 'body-parser' ),
      cookie  = require( 'cookie-session' ),
      db = require('mongodb'),
      app = express(),
      bcrypt = require("bcrypt"),
      passport = require('passport')

const initializePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')



app.use( express.static('public') )
//app.use( bodyparser.json())
app.use(express.json())
//app.use(express.urlencoded({extended:false}))
// cookie middleware! The keys are used for encryption and should be
// changed
app.use(bodyparser.urlencoded({ extended: false }));
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.use(flash())
app.use(session({
  secret:process.env.SESSION_SECRET,
  name:'token',
  resave:false,
  saveUninitialized:false,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 //设置过期时间是一天
  },
  rolling: true,
}))


// middleware to check connection
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})
const hasLoggedIn = (request, response, next) => {
  if (request.session.username) {
    next();
  } else {
    response.redirect('/login.html');
  }
};
let records = [
  { entertainment: 10, food: 25, other: 23, total: 58, date: '2021-08-25'},
  { entertainment: 5,  food: 30, other: 30, total: 65, date: '2021-08-28' },
  { entertainment: 30, food: 30, other: 0,  total: 60, date: '2021-09-01'}
]

const client = new db.MongoClient( process.env.URI, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null //accounts
let collection_records = null //records of users
let username = null //store user's username who has logged in

client.connect()
    .then( () => {
      // will only create collection if it doesn't exist
      collection_records = client.db('account_books').collection('record1')
      return client.db( 'account_books' ).collection( 'book1' )
    })
    .then( __collection => {
      // store reference to collection
      collection = __collection
      // blank query returns all documents
      return collection.find({ }).toArray()
    })
   // .then( arr => console.log(arr[0].records[0]) )

// route to get all docs
app.get( '/',  (req,res) => {
    // get array and pass to res.json
    res.sendFile( __dirname + '/public/login.html' )
    //collection.find({ }).toArray().then( result => res.json( result ) )
})

app.get( '/data', hasLoggedIn,  (req,res) => {
  // get array and pass to res.json
  res.sendFile( __dirname + '/public/data.html' )
  //collection.find({ }).toArray().then( result => res.json( result ) )
})

app.get('/register', (req, res) => {
   res.sendFile(__dirname +'/public/register.html')
  }
)

app.get('/login' , (req, res) => {
      res.sendFile(__dirname +'/public/login.html')
    }
)

app.post('/register', (req,res) =>{

  collection.insertOne( req.body )
      .then(result => {
            const json = {}
            json.isSuccessful=true
            json.errorMsg = 'create account successfully!'
            res.writeHead( 200, "OK", {'Content-Type': 'application/json' })
            res.end(JSON.stringify(json))}
        )

})

app.post('/login', (req,res) =>{

 // console.log(req.body)
  collection.find( {username: req.body.username,password: req.body.password} ).toArray()
      .then(arr => {
        if(arr.length===0){
          const json = {}
          json.isSuccessful=false
          json.errorMsg = 'account does not exist!'
          res.writeHead( 200, "OK", {'Content-Type': 'application/json' })
          res.end(JSON.stringify(json))
        }else{
          const json = {}
          json.isSuccessful=true
          json.errorMsg = 'log in successful!'
          req.session.username = req.body.username
          username = req.body.username
          res.writeHead( 200, "OK", {'Content-Type': 'application/json' })
          res.end(JSON.stringify(json))
        }
      }
      )

})



app.post('/load',(req, res) => {
  const json = {}
  collection_records.find({ username: req.session.username}).toArray()
    .then( arr => {
       // console.log(arr[0])
        json.records = arr
     // console.log(json,'json')
      return json
    }).then(json=>{
    res.writeHead( 200, "OK", {'Content-Type': 'application/json' })
    res.end(JSON.stringify(json))
  })

})

app.post('/add',(req, res) => {
  const record = req.body
  record.total = record.entertainment + record.food + record.other
  record.date = new Date().toISOString().slice(0,10)
  const json = {}
  json.username = username
  json.entertainment = record.entertainment
  json.food = record.food
  json.other = record.other
  json.total = record.entertainment + record.food + record.other
  json.date = new Date().toISOString().slice(0,10)
  collection_records.insertOne( json ).then( result =>{
    //console.log(result)
    res.json( result )}  )

})

app.post('/delete',(req, res) => {
  const record = req.body
  const checked = record.checked
  const mutable = checked.map(ele => db.ObjectId(ele))
  //console.log(checked)
  collection_records.deleteMany(
      {
        _id:{
          $in:mutable
        }

  }).then(result =>{
    //console.log(result)
    res.json( result )
  })

})

app.post('/edit',(req, res) => {
  const edited = req.body
  console.log(edited)
  const total = edited.entertainments + edited.foods + edited.others

  collection_records.updateOne(
      { _id: db.ObjectId(req.body.index) },
      { $set:
            {
              entertainment: edited.entertainments,
              food: edited.foods,
              other: edited.others,
              total: total
            }
      }
  ).then(result=>{
    console.log(result)
  })

})


app.listen(process.env.PORT)
