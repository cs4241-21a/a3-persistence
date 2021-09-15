require('dotenv').config()
const express = require('express')
const app = express()
const { Db } = require('mongodb')
const mongodbclient = require( './services/mongodb-service.js' )
const port = 3000

app.use(express.json())
app.use(express.static('public/'))

app.get('/api/lostitems', (req, res) => {
  mongodbclient.getLostItems()
  .then(e => {
    sendData(res, e)
  })
})

app.get('/api/founditems', (req, res) => {
  mongodbclient.getFoundItems()
  .then(e => {
    sendData(res, e)
  })
})

app.post('/api/login', (req, res) => {
  res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  res.end()  
})

app.post('/api/update', (req, res) => {
  mongodbclient.update(req.body)
  .then(e => {
    if (dt === undefined) {
      res.writeHead( 404, "Invalid UID", {'Content-Type': 'text/plain' })
      res.end()  
    } else {
      res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      res.end()  
    }
  })
})

app.post('/api/create', (req, res) => {
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

app.post('/api/delete', (req, res) => {
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

app.listen(process.env.PORT || port, (e) => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})