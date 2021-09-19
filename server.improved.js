const mime = require( 'mime' ),
    port = 3000,
    express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    app = express(),
    ScoreEntry = require('./models/leaderboardEntry.js'),
    bodyParser = require("body-parser");
require('dotenv').config();

const {response, request} = require("express");

// connect to mongodb & listen for requests
const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => app.listen(port))
    .catch(err => console.log(err));

//register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(morgan('dev'));
app.use((req,res,next) => {
    res.locals.path = req.path;
    next();
});

app.get('/submit', (req,res) =>{
    const entry = new ScoreEntry({
        yourname: 'Aidan',
        score: 1000,
        rank: 6
    })
    entry.save()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/all-scores', (req,res) => {
    ScoreEntry.find()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/', (req,res) => {
    res.redirect('/index');
})
app.get('/leaderboard', (req,res) => {
    ScoreEntry.find().sort({rank: 0})
        .then(result => {
            res.render('leaderboardPage', {leaderboards: result, title: 'Leaderboard'});
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/index', (req, res) => {
    ScoreEntry.find({rank: {$lte: 5}}).sort({rank: 0})
        .then(result => {
            res.render('index', {leaderboards: result, title:"Game"});
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/chat', (req, res) =>{
    res.render('chat',{title:"Chat Page"});
});

// 404 page
app.use((req,res) => {
    res.status(404).render('404',{title: '404'})
})


/*
//const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
//let collection = null

client.connect()
    .then( () => {
        // will only create collection if it doesn't exist
        return client.db( 'Trash' ).collection( 'leaderboard' )
    })
    .then( __collection => {
        // store reference to collection
        collection = __collection
        // blank query returns all documents
        return collection.find({ }).toArray()
    })
    .then( console.log )

// route to get all docs
app.get( '/updatePage', (req,res) => {
    if( collection !== null ) {
        // get array and pass to res.json
        collection.find({ }).toArray().then( result => res.json( result ) )
    }
})


app.use( (req,res,next) => {
    if( collection !== null ) {
        next()
    }else{
        res.status( 503 ).send()
    }
})

app.post( '/submit', bodyParser.json(), (req,res) => {
    // assumes only one object to insert
    //check if name already has entry
    //delete old score if new one is higher
    //let idValue = "";
    collection.insertOne( req.body )

    //collection.deleteOne({ "_id" : mongodb.ObjectId("61441091c6a54aa91f2c3f85") })
    collection.updateOne(
        { _id:mongodb.ObjectId("6144084d3ca77b27e4a42889") },
        {$set:{'rank':1 }}
    ).then(dbresponse => {
        //idValue = dbresponse.insertedId.id
        //console.log(idValue)
        res.json((dbresponse))
    });
*/

    //calcRankMongo(); //recalculate the rank of all entries in db
//})


/*
app.use(express.static('./public/'));
app.listen( port);

app.post("/submit", bodyParser.json(), (request, response) =>{
    addRow(request.body);
    response.writeHead(200,"OK", {'Content-Type': 'text/plain'});
    response.end();
});

app.get("/updatePage", (request,response) =>{
    //console.log(appdata);
    sendAppData(response, appdata);
});

app.post("/delete", bodyParser.json(), (request,response) =>{
    deleteRow(request.body['id']);
    response.writeHead(200,"OK", {'Content-Type': 'text/plain'});
    response.end();
});

app.post("/modify", bodyParser.json(), (request, response) =>{
    modifyRow(request.body);
    response.writeHead(200,"OK", {'Content-Type': 'text/plain'});
    response.end();
});

const appdata = [
    {'yourname': 'Greg', 'score': 745, 'rank': 1},
    {'yourname': 'Mark', 'score': 687, 'rank': 2},
    {'yourname': 'Liam', 'score': 590, 'rank': 3}
]*/

/*const server = http.createServer( function( request,response ) {
    if( request.method === 'GET' ) {
        handleGet( request, response )
    }else if( request.method === 'POST' ){
        handlePost( request, response )
    }
})

const handleGet = function( request, response ) {
    const filename = dir + request.url.slice(1)

    if (request.url === '/') {
        sendFile(response, 'public/index.html')
    } else if (request.url === '/updatePage'){
        sendAppData(response, appdata);
    } else{
        sendFile( response, filename )
    }
}

const handlePost = function( request, response ) {
    let dataString = ''

    request.on( 'data', function( data ) {
        dataString += data
    })

    request.on( 'end', function() {
        const json = JSON.parse(dataString)
        // ... do something with the data here!!!
        if(request.url === '/submit') {
            addRow(dataString);
        } else if (request.url === '/delete'){
            deleteRow(dataString);
        } else if (request.url === '/modify'){
            modifyRow(dataString);
        }
        console.log("appdata:\n" + JSON.stringify(appdata));
        response.writeHead(200,"OK", {'Content-Type': 'text/plain'});
        response.end();

    })
}*/

function sendAppData(response, data){
    const type = mime.getType(appdata);
    response.writeHead(200,{'Content-Type': type});
    response.write(JSON.stringify(data));
    response.end();
}

function addRow(dataString) {
    let jsonApp = dataString;
    jsonApp['score'] = parseInt(jsonApp['score']);
    jsonApp['rank'] = 0;
    for(let i = 0; i < appdata.length; i++){
        let user = appdata[i];

        if (jsonApp['yourname'] === user.yourname && (parseInt(jsonApp['score']) > user.score)){
            deleteRow(i + 1);
        } else if (jsonApp['yourname'] === user.yourname && (parseInt(jsonApp['score']) <= user.score)) {
            // return error message
            return;
        }
    }
    appdata.push(jsonApp);
    calcRank();
    console.log(appdata);
}

function deleteRow(dataString) {
    let rankDel = appdata[dataString - 1].rank
    appdata.splice(dataString - 1, 1);
    updateRank(rankDel);
}

function modifyRow(dataString) {
    let jsonApp = dataString;
    for(let user of appdata){
        if (user.yourname === jsonApp['newName']){
            return true;
        }
    }
    for (let user of appdata){
        if (user.yourname === jsonApp['oldName']){
            user.yourname = jsonApp['newName'];
            return false;
        }
    }
}


function calcRank(){
    // for each rank of value rank or lower add 1 to number
    let newRank = appdata.length;
    for(let user of appdata){
        let rank = user.rank
        if (rank === 0){
            //Calculate rank value
            let tempRank = Infinity;
            for(let otherUser of appdata){
                if((parseInt(user.score) >= parseInt(otherUser.score)) && (tempRank > otherUser.rank) && (otherUser.rank !== 0)){
                    tempRank = otherUser.rank;
                }
                if(otherUser.rank >= tempRank){
                    otherUser.rank++;
                }
            }
            if (tempRank !== Infinity){
                newRank = tempRank;
            }
            user.rank = newRank;
        }
    }
} //calculates and updates ranks when users are added
function updateRank(rankDel){
    for(let user of appdata){
        if (user.rank > rankDel){
            user.rank--;
        }
    }
    calcRank();
} //updates ranks when users are deleted

/*const sendFile = function( response, filename ) {
    const type = mime.getType( filename )

    fs.readFile( filename, function( err, content ) {

        // if the error = null, then we've loaded the file successfully
        if( err === null ) {

            // status code: https://httpstatuses.com
            response.writeHeader( 200, { 'Content-Type': type })
            response.end( content )

        }else{


            // file not found, error code 404
            response.writeHeader( 404 )
            response.end( '404 Error: File Not Found' )

        }
    })
}

server.listen( process.env.PORT || port )*/
