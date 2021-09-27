const { urlencoded, request } = require('express');
//
const express = require( 'express' ),
      cookie  = require( 'cookie-session' ),
      mongodb = require( 'mongodb' ),
      cors = require('cors'),
      app = express()

app.use( express.static( __dirname ))
app.use( express.json() )
app.use( express.urlencoded({ extended:true }) )
app.use( cors() )
// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))


const uri = 'mongodb+srv://a3:a3password@cluster0.9zsah.mongodb.net/'

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let dataCollection = null
let accountCollection = null

client.connect()
  .then( () => {
    console.log("Connecting...")
    // will only create collection if it doesn't exist
    return client.db( 'a3Database' ).collection( 'a3Collection' ) 
    }).then( _collection => {
      dataCollection = _collection
      return dataCollection.find({ }).toArray()
    })
        .then(console.log)
    .then( () => {
      return client.db( 'a3Database' ).collection( 'a3Accounts' ) 
      }).then( _collection => {
         accountCollection = _collection
         return accountCollection.find({ }).toArray()
          })
            .then(console.log)
    .catch( () => {console.log("Connection to database failed!")})


class Account{
    constructor(username, password) {
      this._id = username
      this.password = password
    }
  }

app.post( '/register', (req, res) => {
  console.log(req.body)
  accountCollection
  .findOne(
    {_id: req.body.username} , {password: 1}
    ).then( (account) => {
        if (account === null) {
          newAccount = new Account(req.body.username, req.body.password)
          accountCollection
            .insertOne(newAccount)
              .then( () => {
                req.session.login = true
                res.sendFile( __dirname + '/public/main.html' )
              })   
        } else {
          res.sendFile( __dirname + '/public/index_register_fail.html' )
        }
      }) 
  }) 

  app.post( '/login', (req, res) => {
    console.log(req.body)
    accountCollection
    .findOne(
      {_id: req.body.username, password: req.body.password} , {}
      ).then( (account) => {
          if (account === null) {
            res.sendFile( __dirname + '/public/index_login_fail.html' )
          } else {
            console.log("Logging you in: " + account)
            req.session.login = true
            res.sendFile( __dirname + '/public/main.html' )
        }
      }) 
    }) 

// add some middleware that always sends unauthenicaetd users to the login page
app.use(function( req,res,next) {
  console.log("Inside app.use(/ ...")
  if( req.session.login === true ) {
    next()
  }
  else {
    console.log("Login failed")
    res.sendFile( __dirname + '/public/index.html' )
  }
})

/*
app.get( function ( req, res) {
  console.log("I'm supposed to send index or main.html")
  if( req.session.login === true ) {
    res.sendFile( __dirname + '/public/main.html' )
  }
  else {
    console.log("Login failed")
    res.sendFile( __dirname + '/public/index.html' )
  }
})
*/

app.get( '/logout', (req, res) => {
  console.log("Logging out")
  req.session.login = false;
  res.status(200).send("Logged out successfuly")
  //res.sendFile( __dirname + '/public/index.html')
  //next()
})

// route to get all docs
app.get( '/', (req,res) => {
  res.sendFile( __dirname + '/public/main.html')
})

app.get('/login', (req, res) => {
  res.redirect( '/')
})

app.get('/register', (req, res) => {
  res.redirect( '/')
})


// parse application/x-www-form-urlencoded

class PostRequest {
  constructor(type) {
    this.type = type.requestType;
  }
}

class TableEntry {
  constructor(data) {
     this._id = data[0];
     this.fname = data[1];
     this.lname = data[2];
     this.sex = data[3]
     this.ageClass = data[4]; 
     this.dateJoined = data[5];
     this.membershipType = data[6];
     this.expireDate = data[7];
   }
}

  app.post( '/add', (req, res) => {
    parseBody(req, res, verifyEntry)
  })
 
  app.post( '/modify', (req, res) =>  {
    parseBody(req, res, verifyEntry)
  })
  
  app.post ( '/delete', (req, res) => {
    parseBody(req, res, deleteEntry)
  })

// route to get all docs
app.get( '/retrieve', (req,res) => {
  console.log("Received /retrieve request!")
  if( dataCollection !== null ) {
    // get array and pass to res.json
    dataCollection.find({ }).toArray().then( result => res.json( result ) )
  }
})



function parseBody(req, res, next) {
  let dataString = ''
    req.on( 'data', function( data ) {
      dataString += data 
    })
    
    req.on('end', function () {
      newRequest = JSON.parse ( dataString )
      console.log(newRequest)
    
      switch (newRequest.requestType) {
        case 'add':
        case 'modify':
          verifyEntry(newRequest, res, calculateExpireDate)
          break;
        case 'delete':
          deleteEntry(newRequest, res, returnTableContents)
          break;
        default: 
          res.status(400).send('parseBody: Bad Request Type!');
      }
    })   
}


function verifyEntry (req, res, next) {
d = new Date(req.dateJoined)
  dateIsValid = (d.getTime() === d.getTime())
  if (req.fname === '' || req.lname === '' || !dateIsValid
    ||  req.ageClass === '' || req.membershipType === '')
    {
      res.status(400).send('verifyEntry: Bad Request!')
    }

    switch (req.requestType) {
      case 'add':
        next(req, res, calculateNewId)
        break;
      case 'modify':
        next(req, res, modifyEntry)
        break;
      default:
        res.status(500).send('verifyEntry: IDK What Happened Here!');

  }
}

function calculateExpireDate (req, res, next) {
expireDate = new Date(req.dateJoined)

switch (req.membershipType) { 
  case 'Monthly':
    expireDate.setMonth(expireDate.getMonth() + 1)
    break;
  case 'Yearly': 
    expireDate.setFullYear(expireDate.getFullYear() + 1)
    break;
  case 'Lifetime':
    expireDate.setFullYear(expireDate.getFullYear() + 100)
    break;
  default:
    console.log('calculateExpireDate: Unknown membership type' + entry.membershipType)
}

month = (expireDate.getMonth() + 1)
date = expireDate.getDate()

let stringMonth = month
if (month < 10) {
  stringMonth = '0' + stringMonth
} 
let stringDate = date
if (date < 10) {
  stringDate = '0' + stringDate
}

req.expireDate = expireDate.getFullYear() + '-' + stringMonth + '-' + stringDate
switch(req.requestType) {
    case 'add':
      next(req, res, addEntry)
      break;
    case 'modify':
      next(req, res, returnTableContents)
      break;
    default:
      res.status(500).send('calculateExpireDate: IDK What Happened Here!');
}
}

function calculateNewId(req, res, next) {
console.log("Inside calculateNewId")
if( dataCollection !== null ) {
  // get array and pass to res.json
  dataCollection.find({ }).toArray()
    .then( function (result) {
      result.sort((a,b) => a._id > b._id ? -1 : 1)
      if (result.length === 0) {
        req._id = 1;
      } else {
        latestRecord = result[0]
        req._id = latestRecord._id + 1
        console.log(latestRecord)
    }
    next(req, res, returnTableContents) 
  })
} else{
  console.log("calculateNewId: dataCollection is null")
}
}

function returnTableContents(req, res) {
console.log("Inside returnTableContents")
if( dataCollection !== null ) {
  // get array and pass to res.json
  dataCollection.find({ }).toArray().then( result => res.json( result ) )
} else {
  console.log("returnTableContents: dataCollection is null")
}
}

function addEntry(req, res, next) {
newTableEntry = new TableEntry((Object.values(req)).slice(1))
dataCollection
  .insertOne(Object.assign({}, newTableEntry))
    .then(next(req, res))
}

function modifyEntry(req, res, next) {

modifiedTableEntry = (Object.values(req)).slice(1)
dataCollection
      .updateOne(
        {_id: parseInt(req._id)}, [
          {$set:{ fname: req.fname, 
                lname: req.lname,
                sex: req.sex,
                ageClass: req.ageClass,
                dateJoined: req.dateJoined,
                membershipType: req.membershipType,
                expireDate: req.expireDate
              }
          }
       ]
      ).then(next(req, res))
}

function deleteEntry(req, res, next) {
  dataCollection
      .deleteOne( {_id: parseInt(req._id)})
      .then(next(req, res))
}


  
app.listen(process.env.PORT || 3000)
