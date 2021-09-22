const express   = require("express"),
        dotenv = require('dotenv').config(),
        bodyParser = require("body-parser"),
        mongodb = require( 'mongodb' ),
        cookie  = require( 'cookie-session' ),
        favicon = require('serve-favicon'),
        path = require('path'),
        app     = express();


app.use( express.urlencoded({ extended:true }) )

app.use( favicon(path.join(__dirname, 'public/assets', 'binky.png')) )


app.use( cookie({
    name: 'session',
    keys: ['key1', 'key2']
}))

// // add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
    if(req.url.includes('.html') || req.url === '/') {
        if (req.session.login === true) {
            console.log("url: ", req.url)
            next()
        } else {
            console.log("else: ", req.url)
            res.sendFile(__dirname + '/public/index.html')
        }
    }
    else {
        next()
    }
})

// app.use( cookie({ name: 'session',  keys: ['key1', 'key2'] }))// cookie middleware! The keys are used for encryption and should be changed

app.get('/main.html', function(req, res) {
    console.log("test")
    res.sendFile( __dirname+'/public/main.html')
})


app.use(express.static('public'));
app.use(express.json());
app.use( (req,res,next) => {
    if( collection !== null ) {
        next()
    }else{
        res.status( 503 ).send()
    }
})

// DATABASE
// const uri = 'mongodb+srv://ikatz:password12345@a3-ikatz.p1gmm.mongodb.net/';
const uri = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+process.env.DB_HOST;
console.log(uri)
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null
let login_collection = null

client.connect()
    .then( () => {
        // will only create collection if it doesn't exist
        return client.db( 'shopping_list' ).collection( 'my_list' )
    })
    .then( __collection => {
        // store reference to collection
        collection = __collection
        // blank query returns all documents
        return collection.find({ }).toArray()
    })

client.connect()
    .then( () => {
        // will only create collection if it doesn't exist
        return client.db( 'shopping_list' ).collection( 'login_info' )
    })
    .then( __collection => {
        // store reference to collection
        login_collection = __collection
        // blank query returns all documents
        return login_collection.find({ }).toArray()
    })

// route to get all docs
app.get( '/load', (req,res) => {
    if( collection !== null ) {
        // get array and pass to res.json
        collection.find({ id:req.session.username }).toArray().then( result => res.json( result ) )
    }
})

// Listen on port 3000 for dev or whatever heroku wants
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// app.get("/load", (request, response) => {
//     // response.json(appdata)
// })


app.post("/submit", bodyParser.json(), (request, response) => {
    let json_to_manipulate = request.body
    let today = new Date().toLocaleDateString()
    let deadline = new Date(today)

    if(json_to_manipulate["urgency"]) { deadline.setDate(deadline.getDate() + 1) }
    else { deadline.setDate(deadline.getDate() + 7); }

    json_to_manipulate["creation_date"] = today;
    json_to_manipulate["deadline"] = deadline.toLocaleDateString();
    json_to_manipulate['id'] = request.session.username

    collection.insertOne( json_to_manipulate ).then( result => response.json( result ) )
})

app.post( '/delete', (req,res) => {
    // console.log("In remove server.js")
    // console.log(req.body._id)
    collection
        .deleteOne({ _id:mongodb.ObjectId( req.body._id ) })
        .then( result => res.json( result ) )
})

app.post( '/update', (req,res) => {
    console.log(req.body.json)
    collection
        .updateOne(
            { _id:mongodb.ObjectId( req.body.id ) },
            { $set:{    'list_entry':req.body.json['list_entry'],
                        'quantity': req.body.json['quantity'],
                        'urgency': req.body.json['urgency'] } }
        )
        .then( result => res.json( result ) )
})

app.post( '/get_item', (req,res) => {
    let id_to_update = req.body._id
    collection.find(mongodb.ObjectId( req.body._id )).toArray().then( result => res.json( result) )
    // console.log(json)
        // .toArray().then( result => res.json( result ) )
})



app.post('/login', bodyParser.json(), (req, res) => {
    login_collection.find({ username:req.body.username }).toArray().then( result => {
        if(result[0] !== undefined) {
            if(req.body.password === result[0].password) {
                req.session.login = true
                req.session.username = req.body.username
                res.redirect( '/main.html' )
            }else{
                req.session.login = false
                req.session.username = null
                // password incorrect, redirect back to login page
                res.sendFile( __dirname + '/public/index.html' )
            }
        }
    })
})

app.post('/new_user', bodyParser.json(), function(req, res){
    console.log(req.body)
    login_collection.insertOne( req.body ).then( result => {
        req.session.login = true
        req.session.username = req.body.username
        res.redirect( '/main.html' )
    } )

})