/*
    Middle-ware is a function that sits in between request and response and does
    some type of data processing

    app.use --> applied to every request from client (not necessarily always the best option)

    Middle-ware used in project:
        - body-parser
        - morgan
        - cookie-session
        - noAccess: my own middleware that checks to see if there are cookies showing that 
                    the user is logged in

*/
const express = require('express')
const bodyParser = require('body-parser') // body-parser is a middle-ware
const mongodb = require('mongodb');
const cookie = require('cookie-session')
const morgan = require('morgan')
// const session = require('express-session')


const app = express()



const uri = "mongodb+srv://CS4241:CS4241DatabasePassword@tipcalculator.wbgat.mongodb.net/TipCalculator?retryWrites=true&w=majority";

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let receipt_collection = null
let accounts_collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'tip_calculator' ).collection( 'saved_receipts' )
  })
  .then( __collection => {
    
    receipt_collection = __collection

  })

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'tip_calculator' ).collection( 'accounts' )
  })
  .then( __collection => {
    
    accounts_collection = __collection

  })

// use express.urlencoded to get data sent by default form actions
// or GET requests
// app.use( express.urlencoded({ extended:true }) )



// use express.urlencoded to get data sent by default form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

// cookie middleware! The keys are used for encryption and should be
// changed
app.use( cookie({
    name: 'session',
    keys: ['key1', 'key2']
  }))

app.use(morgan('common'))


// add some middleware that always sends unauthenticated users to the login page
// app.use( function( req,res,next) {
//     if( req.session.login === true ) {
//         // console.log("req.session.login === true", req.session.login === true)
//         res.sendFile(__dirname + "/public/receipts.html");
//         // next()
//     }
//     else {
//         // console.log("req.session.login === true", req.session.login === true)
//         // res.sendFile( __dirname + '/public/login.html' )
//         next()
//     }
// })


noAccess = function(req, res, next){
    if( req.session.login === true ) {
        // console.log("req.session.login === true", req.session.login === true)
     
        next()
    }
    else {
        // console.log("req.session.login === true", req.session.login === true)
        // res.sendFile( __dirname + '/public/login.html' )
        res.redirect('login.html');
    }
}




app.get("/", noAccess, (req, res) => {
    console.log("main page")

    res.sendFile(__dirname + "/receipts.html");    
})

app.get('/receipts', noAccess, (req, res) => {
    res.sendFile(__dirname + "/receipts.html");
})

app.get('/receipts.html', noAccess, (req, res) => {
    res.sendFile(__dirname + "/receipts.html");    
})


app.get("/create_account", (req, res) => {
    res.sendFile(__dirname + "/public/create_account.html");
})


app.post('/login', (req,res)=> {
    // express.urlencoded will put your key value pairs 
    // into an object, where the key is the name of each
    // form field and the value is whatever the user entered
    
    // below is *just a simple authentication example* 
    // for A3, you should check username / password combos in your database
    accounts_collection.find(req.body).toArray()
    .then( dbJSON => {
        if(dbJSON.length > 0){
            // define a variable that we can check in other middleware
            // the session object is added to our requests by the cookie-session middleware
            req.session.login = true
            res.redirect('receipts.html' )
        }
        else{
            // password incorrect, redirect back to login page
            res.redirect('login.html')
        }
    });
})

app.get('/login.html', (req, res) => {
    console.log("In get login");


    // console.log("req.session: ", req.session)
    // res.json()
    res.sendFile(__dirname + '/public/login.html');
})


app.post('/logout', logOutUser, (req, res) => {
    console.log("In post method");


    // console.log("req.session: ", req.session)
    // res.json()
    res.redirect('/login.html');
})

function logOutUser(req, res, next){
    console.log("in logOutUser middleware");
    // req.session.login = false
    // delete req.session
    req.session = null
    next()
}


// Make all the files in 'public' available
app.use(express.static('public'))




// app.get("/create_account", (request, response) => {
//     response.sendFile(__dirname + "/public/create_account.html");
// })

// app.get("/receipts", (request, response) => {
//     response.sendFile(__dirname + "/receipts.html");
// })



app.post("/create_account", bodyParser.json(), (request, response) => {

    json = request.body

    accounts_collection.insertOne(json)
    .then( result => {
                   
        request.session.login = true

        // console.log(result)
        // response.json( result) 
        response.redirect('receipts.html')
    })
    
})

/* 
    post is part of REST API
    GET retrieves data to server
    POST is good for adding data to server (the data won't be visible inside the url)
    bodyParser adds a piece of data onto our body property of the response object that contains the parsed json
*/

app.post("/add", bodyParser.json(), (request, response) => {

    // curl --request "POST" "127.0.0.1:5500/add" -d '{ "num_of_people": "2", "amount_due": "$23", "tip":"$23.00"}' -H "Content-Type: application/json"

    const json = request.body;

    let num_of_people = parseFloat(json.num_of_people.replace(",", ""));
    let amount_due = parseFloat(json.amount_due.replace("$","").replace(",", ""));
    let tip = parseFloat(json.tip.replace("$","").replace(",", ""));


    let price_per_person = (amount_due + tip) / num_of_people;
    json['price_per_person'] = "$" + price_per_person.toFixed(2).toString();

    receipt_collection.insertOne(json)
        .then( result => response.json(result) )
})

app.post("/find_user_receipts", bodyParser.json(), (request, response) => {

    receipt_collection.find({email: request.body.email}).toArray()
        .then( dbJSON => response.json(dbJSON));

})

app.post("/find_receipt", bodyParser.json(), (request, response) => {

    receipt_collection.find({_id:mongodb.ObjectID(request.body.id)}).toArray()
        .then( dbJSON => response.json(dbJSON));
})

app.post('/delete_receipt', bodyParser.json(), (request, response) =>
    receipt_collection  
        .deleteOne({_id:mongodb.ObjectID(request.body.id)})
        .then( result => response.json(result))
)


app.post('/update_receipt', bodyParser.json(), (request, response) => {

    const json = request.body;

    // Recalculate the new amount per person
    let num_of_people = parseFloat(json.num_of_people.replace(",", ""));
    let amount_due = parseFloat(json.amount_due.replace("$","").replace(",", ""));
    let tip = parseFloat(json.tip.replace("$","").replace(",", ""));

    let price_per_person = (amount_due + tip) / num_of_people;


    json['price_per_person'] = "$" + price_per_person.toFixed(2).toString();

 

    // Update the values in the database
    receipt_collection
        .updateMany(
            {_id:mongodb.ObjectID(json.id)},
            {$set: {num_of_people: json.num_of_people,
                    amount_due: json.amount_due,
                    tip: json.tip,
                    calc_1: json.calc_1,
                    calc_2: json.calc_2,
                    calc_3: json.calc_3,
                    tip_percentage: json.tip_percentage,
                    price_per_person: json.price_per_person
                 }}
        )
        .then( () => {



            receipt_collection.find({_id:mongodb.ObjectID(json.id)}).toArray()
            .then( dbJSON =>response.json(dbJSON[0]));
            
            // curl --request "POST" "127.0.0.1:5500/update" -d '{ "id": "6147535c975aa18729a879e0", "amount_due" : "$100.00", "tip" : "$100", "calc_1" : "$13.00", "calc_2" : "$13.00", "calc_3" : "$13.00", "tip_percentage" : "20%", "price_per_person" : "$100.00"}' -H "Content-Type: application/json"

        })
})





app.post('/get_user', bodyParser.json(), (request, response) => {
    console.log("Sending over", logged_in_user);
    response.json(logged_in_user);
})



// Tells the app to listen on port 3000
app.listen(3000)