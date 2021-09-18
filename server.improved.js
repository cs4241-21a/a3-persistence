require('dotenv').config()
const express = require('express'),
  app = express(),
  compression = require('compression'),
  helmet = require('helmet'),
  mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient,
  uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/HotelReviews?retryWrites=true&w=majority`,
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }),
  port = 3000

let collection = null
client.connect(err => {
  collection = client.db('HotelReviews').collection('Reviews')
})

// Middleware to check connection to database
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.use(helmet())

app.use(compression())


app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/login.html')
})

const getOverallScore = function (
  cleanlinessScore,
  serviceScore,
  amenityScore
) {
  let sum = cleanlinessScore + serviceScore + amenityScore;
  return Math.round((sum / 3) * 10) / 10;
};

app.post('/login', express.json(), function(request, response) {
  collection.find({username: request.body.username}).toArray()
  .then((result) => {
    if(!result.length) {
      collection.insertOne({username: request.body.username, password: request.body.password})
      .then(insertResponse => collection.findOne(insertResponse.insertedId))
      .then(findResponse => {
        findResponse.new = true
        let arr = []
        arr.push(findResponse)
        response.json(arr)
      })
    }
    else{
      result[0].new = false
      response.json(result)
    }
  })
})

app.post('/table', express.json(), function(request, response) {
  collection.find({creator: request.body.userid}).toArray().then( result => response.json(result))
})

app.post('/submit', express.json(), function(request, response) {
  const overallScore = getOverallScore(
    request.body.cleanliness,
    request.body.service,
    request.body.amenity
  );

  collection.insertOne({
    creator: request.body.userid,
    hotel: request.body.hotel,
    location: request.body.location,
    startdate: request.body.startdate,
    cleanliness: request.body.cleanliness,
    service: request.body.service,
    amenity: request.body.amenity,
    overallexperience: overallScore,
  })
  .then(() => collection.find({creator: request.body.userid}).toArray())
  .then( result => response.json(result))
})

app.post('/delete', express.json(), function(request, response) {
  collection.deleteOne({_id:mongodb.ObjectId(request.body.id)})
  .then(() => {
    return collection.find({creator: request.body.userid}).toArray()
  })
  .then( result => response.json(result))
})

app.post('/edit', express.json(), function(request,response) {
  const overallScore = getOverallScore(
    request.body.cleanliness,
    request.body.service,
    request.body.amenity
  );
  collection.updateOne(
    {_id:mongodb.ObjectId(request.body.id)},
    {$set: {
      hotel: request.body.hotel,
      location: request.body.location,
      startdate: request.body.startdate,
      cleanliness: request.body.cleanliness,
      service: request.body.service,
      amenity: request.body.amenity,
      overallexperience: overallScore
    }}
  )
  .then(() => collection.find({creator: request.body.userid}).toArray())
  .then(result => response.json(result))
})

// automatically deliver all files in the public folder with the correct headers 
app.use( express.static('public'))

app.listen(process.env.PORT || port)

