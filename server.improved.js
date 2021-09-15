  require('dotenv').config()
  const express = require('express'),
  app = express(),
  //bodyParser = require('body-parser'),
  mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient,
  uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/HotelReviews?retryWrites=true&w=majority`,
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }) 

  let collection = null
  client.connect(err => {
    collection = client.db('HotelReviews').collection('Reviews')
  })

  appdata = [
  {
    'hotel': 'Best Resort',
    'location': 'Miami',
    'cleanliness': 9,
    'service': 8,
    'amenity': 7,
    'overallexperience': 8,
  },
  {
    'hotel': 'Roadside Inn',
    'location': 'Boston',
    'cleanliness': 5,
    'service': 5,
    'amenity': 5,
    'overallexperience': 5,
  },
];

port = 3000;

// automatically deliver all files in the public folder with the correct headers 
app.use( express.static( 'public' ))

app.get('/', function(request, response) {
  response.sendFile(__dirname + 'public/index.html')
})

const getOverallScore = function (
  cleanlinessScore,
  serviceScore,
  amenityScore
) {
  let sum = cleanlinessScore + serviceScore + amenityScore;
  return Math.round((sum / 3) * 10) / 10;
};

app.post('/table', function(request, response) {
  response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' })
  response.end(JSON.stringify(appdata))
})

app.post('/submit', express.json(), function(request, response) {
  const overallScore = getOverallScore(
    request.body.cleanliness,
    request.body.service,
    request.body.amenity
    );
  appdata.push({
    hotel: request.body.hotel,
    location: request.body.location,
    cleanliness: request.body.cleanliness,
    service: request.body.service,
    amenity: request.body.amenity,
    overallexperience: overallScore,
  });
  response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
  response.end(JSON.stringify(appdata));
})

app.post('/delete', express.json(), function(request, response) {
  const overallScore = getOverallScore(
    request.body.cleanliness,
    request.body.service,
    request.body.amenity
  );
  request.body['overallexperience'] = overallScore;
  let index = -1;
  for (let i = 0; i < appdata.length; i++) {
    if (JSON.stringify(appdata[i]) === JSON.stringify(request.body)) {
      index = i;
    }
  }
  appdata.splice(index, 1);
  response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
  response.end(JSON.stringify(appdata));
})

app.post('/edit', express.json(), function(request,response) {
  const overallScoreForOriginal = getOverallScore(
    request.body[0].cleanliness,
    request.body[0].service,
    request.body[0].amenity
  );
  const overallScore = getOverallScore(
    request.body[1].cleanliness,
    request.body[1].service,
    request.body[1].amenity
  );
  request.body[0]['overallexperience'] = overallScoreForOriginal;
  let index = -1;
  for (let i = 0; i < appdata.length; i++) {
    if (JSON.stringify(appdata[i]) === JSON.stringify(request.body[0])) {
      index = i;
    }
  }
  appdata.splice(index, 1, {
    hotel: request.body[1].hotel,
    location: request.body[1].location,
    cleanliness: request.body[1].cleanliness,
    service: request.body[1].service,
    amenity: request.body[1].amenity,
    overallexperience: overallScore,
  });
  response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
  response.end(JSON.stringify(appdata));
})

app.listen(process.env.PORT || port)

