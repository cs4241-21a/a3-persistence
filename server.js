const { request, response } = require('express');
const express = require('express'),
      mongodb = require('mongodb'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json()) 
app.use(express.json());
app.use(express.urlencoded({extended:true})) 
app.use(cookieParser());

const uri = 'mongodb+srv://tester:tester123@cluster0.7vqa9.mongodb.net/';

const client = new mongodb.MongoClient( uri, {useNewUrlParser: true, useUnifiedTopology: true});
let collection = null;
let users_collection = null;

client.connect()
    .then( () => {
        //will only create collection if doesn't exist
        return client.db( 'test' ).collection( 'collection1' );
    })
    .then( __collection => {
        //store reference to collection
        collection = __collection;
        //blank query returns all documents
        return collection.find({ }).toArray()
    })
    .then( console.log )


client.connect()
    .then( () => {
        //will only create collection if doesn't exist
        return client.db( 'test' ).collection( 'collection2' );
    })
    .then( __users_collection => {
        //store reference to collection
        users_collection = __users_collection;
        //blank query returns all documents
        return users_collection.find({ }).toArray()
    })
    .then( console.log )


app.get("/", (request, response) => {
  if( collection !== null){
      //get array and pass to res.json
      collection.find({ }).toArray().then( result => response.json( result));
  }
});

app.post( '/add', express.json(), (request, response) => {
    console.log(request.body)
    let entry = request.body

    //adds expected delivery time
    let dTime = "unknown";
    const d = new Date();
    let hours;
    let minutes;
    if(entry.distance === "Not Far"){
      if(d.getHours() > 12){
        hours = d.getHours() - 12;
      }
      else{
        hours = d.getHours();
      }

      if(d.getMinutes() + 10 > 60){
        if(hours === 12){
          hours = 0
        }
        hours = hours + 1;
        minutes = d.getMinutes() + 10 - 60;
      }
      else{
        minutes = d.getMinutes() + 10;
      }
    }
    if(entry.distance === "Decently Far"){
      if(d.getHours() > 12){
        hours = d.getHours() - 12;
      }
      else{
        hours = d.getHours();
      }

      if(d.getMinutes() + 25 > 60){
        if(hours === 12){
          hours = 0
        }
        hours = hours + 1;
        minutes = d.getMinutes() + 25 - 60;
      }
      else{
        minutes = d.getMinutes() + 25;
      }
    }
    if(entry.distance === "Far"){
      if(d.getHours() > 12){
        hours = d.getHours() - 12;
      }
      else{
        hours = d.getHours();
      }

      if(d.getMinutes() + 40 > 60){
        if(hours === 12){
          hours = 0
        }
        hours = hours + 1;
        minutes = d.getMinutes() + 40 - 60;
      }
      else{
        minutes = d.getMinutes() + 40;
      }
      
    }
    if(minutes < 10){
      dTime = hours + ":0" + minutes
    }
    else{
      dTime = hours + ":" + minutes
    }

    timePlaced = d.getHours() + ":" + d.getMinutes(); 

    entry.time = timePlaced;
    entry.dropTime = dTime;
    entry.userID = request.cookies.userid;

    //assumes only one object to insert
    collection.insertOne( entry ).then(response.json(entry));
})

app.post('/delete', (request, response) => {
    console.log('deleting')
    console.log(request.body)
    collection.deleteOne( request.body ).then(response.json(request.body))
})


app.post('/update', (request, response) =>{
    
    let entry = request.body;

    let dTime = "unknown";
    const d = new Date();
    let hours;
    let minutes;
    if(entry.distance === "Not Far"){
      if(d.getHours() > 12){
        hours = d.getHours() - 12;
      }
      else{
        hours = d.getHours();
      }

      if(d.getMinutes() + 10 > 60){
        if(hours === 12){
          hours = 0
        }
        hours = hours + 1;
        minutes = d.getMinutes() + 10 - 60;
      }
      else{
        minutes = d.getMinutes() + 10;
      }
    }
    if(entry.distance === "Decently Far"){
      if(d.getHours() > 12){
        hours = d.getHours() - 12;
      }
      else{
        hours = d.getHours();
      }

      if(d.getMinutes() + 25 > 60){
        if(hours === 12){
          hours = 0
        }
        hours = hours + 1;
        minutes = d.getMinutes() + 25 - 60;
      }
      else{
        minutes = d.getMinutes() + 25;
      }
    }
    if(entry.distance === "Far"){
      if(d.getHours() > 12){
        hours = d.getHours() - 12;
      }
      else{
        hours = d.getHours();
      }

      if(d.getMinutes() + 40 > 60){
        if(hours === 12){
          hours = 0
        }
        hours = hours + 1;
        minutes = d.getMinutes() + 40 - 60;
      }
      else{
        minutes = d.getMinutes() + 40;
      }
      
    }
    if(minutes < 10){
      dTime = hours + ":0" + minutes
    }
    else{
      dTime = hours + ":" + minutes
    }
    
    request.body.dropTime = dTime;

    collection.findOneAndUpdate(
        {_id: request.body._id},
        {$set: {yourname: request.body.yourname,
            yourorder: request.body.yourorder, 
            distance: request.body.distance, 
            dropTime: request.body.dropTime}}
    ).then(response.json(request.body))

})

app.post('/login', (request, response) =>{
    let uName = request.body.username,
        psswd = request.body.password,
        userLogIn = {username: uName, password: psswd};
    
    users_collection.findOne(userLogIn)
    .then(user =>{   
        if(user){
            //login
            response.cookie('login', true)
            response.cookie('userid', user._id)
            response.cookie('username', user.username)
            response.redirect('main.html');
        }
        else{
            response.sendFile(__dirname + '/public/index.html');
        }
    })
})

app.post('/create', (request, response)=>{
    let newUName = request.body.newUser,
        newPsswd = request.body.newPassword,
            entry = {username: newUName, password: newPsswd};
    users_collection.insertOne( entry )
    .then(regRes => users_collection.findOne(regRes.insertedId))
    .then(user=>{
        response.cookie('login', true)
        response.cookie('userid', user._id)
        response.cookie('username', user.username)
        response.redirect('main.html')
    });
})

app.post('/saved', (request, response)=>{
    if(collection !== null){
        let search = request.body;
        search.userID = request.cookies.userid;
        collection.find(search).toArray().then( dataArr =>{
            response.json(dataArr);
        })
    }
})

app.listen(process.env.PORT || 3000)