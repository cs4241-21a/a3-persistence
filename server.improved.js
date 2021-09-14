const http = require('http'),
  fs = require('fs'),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require('mime'),
  dir = 'public/',
  port = 3000;

const appdata = [
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

const server = http.createServer(function (request, response) {
  if (request.method === 'GET') {
    handleGet(request, response);
  } else if (request.method === 'POST') {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === '/') {
    sendFile(response, 'public/index.html');
  } else {
    sendFile(response, filename);
  }
};

const getOverallScore = function (
  cleanlinessScore,
  serviceScore,
  amenityScore
) {
  let sum = cleanlinessScore + serviceScore + amenityScore;
  return Math.round((sum / 3) * 10) / 10;
};

const handlePost = function (request, response) {
  let dataString = '';

  request.on('data', function (data) {
    dataString += data;
  });

  request.on('end', function () {
    switch (request.url) {
      case '/table':
        {
          response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
          response.end(JSON.stringify(appdata));
        }
        break;

      case '/submit':
        {
          const json = JSON.parse(dataString);
          const overallScore = getOverallScore(
            json.cleanliness,
            json.service,
            json.amenity
          );
          appdata.push({
            hotel: json.hotel,
            location: json.location,
            cleanliness: json.cleanliness,
            service: json.service,
            amenity: json.amenity,
            overallexperience: overallScore,
          });
          response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
          response.end(JSON.stringify(appdata));
        }
        break;
      case '/delete':
        {
          const json = JSON.parse(dataString);
          const overallScore = getOverallScore(
            json.cleanliness,
            json.service,
            json.amenity
          );
          json['overallexperience'] = overallScore;
          let index = -1;
          for (let i = 0; i < appdata.length; i++) {
            if (JSON.stringify(appdata[i]) === JSON.stringify(json)) {
              index = i;
            }
          }
          appdata.splice(index, 1);
          response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
          response.end(JSON.stringify(appdata));
        }
        break;

      case '/edit':
        {
          const json = JSON.parse(dataString);
          const overallScoreForOriginal = getOverallScore(
            json[0].cleanliness,
            json[0].service,
            json[0].amenity
          );
          const overallScore = getOverallScore(
            json[1].cleanliness,
            json[1].service,
            json[1].amenity
          );
          json[0]['overallexperience'] = overallScoreForOriginal;
          let index = -1;
          for (let i = 0; i < appdata.length; i++) {
            if (JSON.stringify(appdata[i]) === JSON.stringify(json[0])) {
              index = i;
            }
          }
          appdata.splice(index, 1, {
            hotel: json[1].hotel,
            location: json[1].location,
            cleanliness: json[1].cleanliness,
            service: json[1].service,
            amenity: json[1].amenity,
            overallexperience: overallScore,
          });
          response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
          response.end(JSON.stringify(appdata));
        }
        break;

      default:
        console.log('Hit default case in post switch statement');
    }
  });
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { 'Content-Type': type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end('404 Error: File Not Found');
    }
  });
};

server.listen(process.env.PORT || port);
