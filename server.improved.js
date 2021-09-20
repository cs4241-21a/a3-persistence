const mime = require( 'mime' ),
    port = 3000,
    express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    app = express(),
    ScoreEntry = require('./models/leaderboardEntry.js'),
    UserEntry = require('./models/login.js'),
    cookie = require( 'cookie-session'),
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
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use( cookie({
    name: 'session',
    keys: ['key1','key2']
}))

app.post('/signUp', async (req, res) => {
    const entry = new UserEntry({
        username: req.body.username,
        password: req.body.password
    })
    // check if username exists
    if (await checkUsername(req.body.username)) {
        entry.save()
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                console.log(err);
            });
        res.render('login')
    }
    res.render('signUpPage')
    //return error warning that username is already taken
})

async function checkUsername(user,){
    let array = [];
    await UserEntry.find({username: {$eq: user}})
        .then(result =>{
            array = result;
        })
    if (array.length >= 1 ){
        return false;
    }
    return true;
}

async function checkUsernamePassword(user, pass){
    let array = [];
    await UserEntry.find({username: {$eq: user}, password: {$eq:pass}})
        .then(result =>{
            array = result;
        })
    if (array.length >= 1 ){
        return false;
    }
    return true;
}

app.post('/login', (req,res)=> {
    console.log(req.body)
    if (checkUsernamePassword(req.body.username,req.body.password)){
        req.session.login = true
        res.redirect('/index');
    } else {
        res.render('login');
    }
})
app.use( function( req,res,next) {
    if(req.url === '/signUpPage'){
        res.render('signUpPage');
        return;
    }
    if( req.session.login === true ) {
        next()
    } else {
        res.render('login')
    }
})

// serve up static files in the directory public
app.use(express.static('public'));
app.use((req,res,next) => {
    res.locals.path = req.path;
    next();
});



app.post('/submit', bodyParser.json(), async (req, res) => {
    let rankAdd = await findRank(req.body.score);
    const entry = new ScoreEntry({
        yourname: req.body.yourname,
        score: parseInt(req.body.score),
        rank: rankAdd
    })
    let evalScore = await(alreadyInSystem(req.body.yourname))
    if(evalScore === -1){
        await updateRankMongo(rankAdd);
        entry.save()
            .then(result => {
                res.send(result);
            })
            .catch(err => {
                console.log(err);
            });
        return;
    }
    if (evalScore >= rankAdd){
        console.log("here")
        await updateRankMongo(rankAdd);
        await deleteRankMongo(evalScore);
        ScoreEntry.findOneAndUpdate({yourname: {$eq: req.body.yourname}}, {score: parseInt(req.body.score), rank: rankAdd})
            .then( result =>{

            })
    }
});

async function alreadyInSystem(name){
    let score = -1;
    let array = [];
    await ScoreEntry.find({yourname: {$eq: name}})
        .then(result =>{
            array = result;
        })
    if (array.length >= 1 ){
        score = array[0].rank;
        return score;
    }
    return score;
}

async function deleteRankMongo(rankDel){
    await ScoreEntry.updateMany({rank: {$gt: rankDel}}, {$inc: {rank: -1}})
        .then(response => {
            console.log("updated")
        })
}

async function updateRankMongo(rankAdd){
    await ScoreEntry.updateMany({rank: {$gte: rankAdd}}, {$inc: {rank: 1}})
        .then(response => {
            console.log("updated")
        })
}

app.get('/all-scores', (req,res) => {
    ScoreEntry.find()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
});

async function findRank(newScore) {
    let dataArray = [];
    await ScoreEntry.find()
        .then(result => {
            dataArray = result;
        })
    let tempRank = dataArray.length + 1;
    dataArray.forEach(data => {
        if (newScore >= data.score) {
            if (tempRank > data.rank) {
                tempRank = data.rank;
            }
        }
    })
    return tempRank;
}

app.get('/', (req,res) => {
    res.redirect('/index');
})

app.get('/signUpPage', (req,res) =>{
    res.render('signUpPage');
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

app.get('/login', (req,res) => {
    res.render('login', {title:"Chat Page"})
})

// 404 page
app.use((req,res) => {
    res.status(404).render('404',{title: '404'})
})

