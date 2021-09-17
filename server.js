const { query, response } = require('express'); //might not need
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const express = require( 'express' );
const mongodb = require( 'mongodb' );
const cookie = require( 'cookie-session' );
const app = express();

const clientID = '6293d146755b88e66857';
const clientSecret = '5c1676202596fb930a9a5b4e94d469b95d184d1f';

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))


passport.serializeUser(function(user, done){
  done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user);
})

passport.use(new GitHubStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: "http://localhost:3000/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/error', (req, res) => res.send('Unknown Error'))
app.get('/github/callback',passport.authenticate('github', { failureRedirect: '/auth/error' }),
function(req, res) {
  res.redirect('/res?id=' + req.user.id);
});


app.get('/res', (req, res) => {
  req.session.id = req.query.id;
  res.redirect("results.html")
})

app.get( '/logout', (req, res) => {
  req.session.id = '';
  req.logout();
  res.redirect('/');
})

app.use( express.static('public') )
app.use( express.json() )

// make sure to substitute your username / password for tester:tester123 below!!! 
const uri = 'mongodb+srv://mydbuser:sd4A47HHLOuJ7rQJ@cluster0.yb8hn.mongodb.net/'

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'raceresults' ).collection( 'raceone' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })

app.get( '/results', (req,res) => {
  if( collection !== null ) {
    collection.find({ userID: req.session.id }).sort({ avg: 1 }).toArray().then( result => res.json( result ) )
  }
})

app.post( '/submit', (req,res) => {
  // assumes only one object to insert
  const dataJSON = req.body;
  let avg = dataJSON.time / dataJSON.laps;
  dataJSON.avg = avg;
  dataJSON.userID = req.session.id;
  collection
    .findOne({ name:dataJSON.name, team:dataJSON.team, userID:dataJSON.userID })
    .then( function (result) { 
      return result;
    })
    .then(function (data) {
      if(data === null) {
        collection.insertOne( dataJSON ).then( result => res.json( result ))
      } else {
        collection.replaceOne( { name:dataJSON.name, team:dataJSON.team, userID:dataJSON.userID }, dataJSON ).then( result => res.json( result ))
      }
    })
})


app.post( '/remove', (req,res) => {
  // removes an instance matching request body
  collection.deleteOne( req.body ).then( result => res.json( result ) )
})

  
app.listen( process.env.PORT || 3000 )

// const http = require("http"),
//   fs = require("fs"),
//   // IMPORTANT: you must run `npm install` in the directory for this assignment
//   // to install the mime library used in the following line of code
//   mime = require("mime"),
//   dir = "public/",
//   port = 3000;

// /* default data is empty */
// const appdata = [];

// const server = http.createServer(function (request, response) {
//   if (request.method === "GET") {
//     handleGet(request, response);
//   } else if (request.method === "POST") {
//     handlePost(request, response);
//   }
// });

// const handleGet = function (request, response) {
//   const filename = dir + request.url.slice(1);

//   if (request.url === "/") {
//     sendFile(response, "public/index.html");
//   } else {
//     sendFile(response, filename);
//   }
// };

// /* interact with sumbit and remove requests, able to interact with existing data
// by matching the name and team */
// const handlePost = function (request, response) {
//   let dataString = "";

//   request.on("data", function (data) {
//     dataString += data;
//   });

//   /* check if the request is adding or removing data */
//   if (request.url === "/submit") {
//     request.on("end", function () {
//       const dataJSON = JSON.parse(dataString);
//       let avg = dataJSON.time / dataJSON.laps;
//       dataJSON.avg = avg;
//       let modified = false;
//       for (let i = 0; i < appdata.length; i++) {
//         if (
//           appdata[i].name.toUpperCase() === dataJSON.name.toUpperCase() &&
//           appdata[i].team.toUpperCase() === dataJSON.team.toUpperCase()
//         ) {
//           appdata[i] = dataJSON;
//           modified = true;
//         }
//       }
//       if (!modified) {
//         appdata.push(dataJSON);
//       }
//       /* sorting data by fastest average time */
//       appdata.sort(function (a, b) {
//         return a["avg"] - b["avg"];
//       });
//       response.writeHead(200, "OK", { "Content-Type": "text/plain" });
//       response.end(JSON.stringify(appdata));
//     });
//   } else if (request.url === "/remove") {
//     request.on("end", function () {
//       const dataJSON = JSON.parse(dataString);
//       for (let i = 0; i < appdata.length; i++) {
//         if (
//           appdata[i].name.toUpperCase() === dataJSON.name.toUpperCase() &&
//           appdata[i].team.toUpperCase() === dataJSON.team.toUpperCase()
//         ) {
//           appdata.splice(i, 1)
//         }
//       }
//       /* sorting data by fastest average time */
//       appdata.sort(function (a, b) {
//         return a["avg"] - b["avg"];
//       });
//       response.writeHead(200, "OK", { "Content-Type": "text/plain" });
//       response.end(JSON.stringify(appdata));
//     });
//   }
// };

// const sendFile = function (response, filename) {
//   const type = mime.getType(filename);

//   fs.readFile(filename, function (err, content) {
//     // if the error = null, then we've loaded the file successfully
//     if (err === null) {
//       // status code: https://httpstatuses.com
//       response.writeHeader(200, { "Content-Type": type });
//       response.end(content);
//     } else {
//       // file not found, error code 404
//       response.writeHeader(404);
//       response.end("404 Error: File Not Found");
//     }
//   });
// };

// server.listen(process.env.PORT || port);
