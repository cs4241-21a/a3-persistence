require("dotenv").config();
const mongodb = require("mongodb");
const crypto = require("crypto");
const cookie = require("cookie-session");
const favicon = require("serve-favicon");
const serveStatic = require("serve-static");
const express = require("express");
const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require("constants");
const app = express();

//middleware
app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(serveStatic("public/"));
app.use(express.json());

app.use((req,res,next) => {
  if(users !== null){
    next();
  }else{
    res.status(503).send();
  }
});

app.use(express.urlencoded({extended: true}));
app.use(cookie({
  name: "session",
  keys: [crypto.randomBytes(20).toString("hex"), crypto.randomBytes(20).toString("hex")]
}));



//connect to mongodb
const dbName = "test";

const uri = `mongodb+srv://${process.env.USR}:${process.env.PASS}@${process.env.HOST}`;
const client = new mongodb.MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let users = null;
let userData = null;

client.connect()
  .then(() => {
    return [client.db(dbName).collection("users"),
            client.db(dbName).collection("user_data")];
  })
  .then(__collection => {
    users = __collection[0]
    userData = __collection[1]
  })


//get requests
app.get("/robots.txt", (req, res) => {
  res.sendFile(__dirname + "/robots.txt");
})
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/main.html", (req, res) => {
  res.sendFile(__dirname + "/views/main.html");
})

//get the username of the user associated with this session
app.get("/username", (req, res) => {
  res.json({user: req.session.user});
})

app.get("/edit-order.html", (req, res) => {
  res.sendFile(__dirname + "/views/edit-order.html");
})

app.get("/order-info", (req, res) => {
  const num = req.query.num;
  const user = req.session.user;

  userData.find({user}).toArray()
  .then((data) => {
    const orders = data[0].orders;
    let order = null;
    
    for(let i = 0; i < orders.length; i++){
      if(orders[i].num.toString() === num){
        order = orders[i];
        break;
      }
    }

    res.json(order);
  })
})

app.get("/new-user.html", (req, res) => {
  res.sendFile(__dirname + "/views/new-user.html");
})


//post requests
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  users.find({
    username
  })
  .toArray()
  .then((data) => {
    if(data.length === 1){//user found
      if(data[0].password === password){//correct password
        req.session.user = username;
        req.session.pass = password;
        res.redirect("/main.html");
      }else{//incorrect password
        res.redirect("/");
      }
    }else{//user not found
      req.session.user = username;
      req.session.pass = password;
      res.redirect("/new-user.html");
    }
  })
})

//make a new user
//req.body = {}
app.post("/new-user", (req, res) => {
  users.insertOne({username: req.session.user, password: req.session.pass});
  userData.insertOne({user: req.session.user, orders: []})
  .then(() => res.redirect("main.html"));
})

//req.body = {}
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
})

//get a list of orders for a specified user
app.post("/user-orders", (req,res) => {
  userData.find(req.body).toArray()
  .then((data) => {
    res.json(data[0].orders);
  })
})

//req.body = {num: <order number>}
app.post("/delete-order", (req, res) => {
  userData.find({user: req.session.user}).toArray()
  .then((data) => {
    let orders = data[0].orders;
    const id = data[0]._id.toString();


    for(let i = 0; i < orders.length; i++){
      if(orders[i].num.toString() === req.body.num.toString()){
        orders = orders.filter(item => item !== orders[i]);
      }
    }

    userData.updateOne(
      {_id:mongodb.ObjectId(id)},
      {$set:{orders}}
    )
    .then(result => res.json(result));
  })
})

//req.body = {flavor, toppings, cone, notes}
app.post("/add-order", (req, res) => {
  userData.find({user: req.session.user}).toArray()
  .then((data) => {
    let orders = data[0].orders;
    const id = data[0]._id.toString()

    //find the lowest available number
    orders.sort(function(a, b){return a.num-b.num});
    let num = orders.length+1;
    for(let i = 0; i < orders.length; i++){
      if(orders[i].num !== (i+1)){
        num = i+1
        break;
      }
    }

    orders.splice(num-1, 0, {
      num,
      flavor: req.body.flavor,
      toppings: req.body.toppings,
      cone: req.body.cone,
      notes: req.body.notes
    })

    userData.updateOne(
      {_id:mongodb.ObjectId(id)},
      {$set:{orders}}
    )
    .then(result => res.json(result));
  })
})

//subit an edit to the database
//req.body = {num, flavor, toppings, cone, notes}
app.post("/submit-edit", (req, res) => {
  userData.find({user: req.session.user}).toArray()
  .then((data) => {
    let orders = data[0].orders;
    const id = data[0]._id.toString()
    
    for(let i = 0; i < orders.length; i++){
      if(orders[i].num.toString() === req.body.num.toString()){
        orders[i] = {
          num: req.body.num,
          flavor: req.body.flavor,
          toppings: req.body.toppings,
          cone: req.body.cone,
          notes: req.body.notes
        }
        break;
      }
    }

    userData.updateOne(
      {_id:mongodb.ObjectId(id)},
      {$set:{orders}}
    )
    .then(result => res.json(result));
  })
})

//middleware
app.use((req,res,next) => {
  username = req.session.user;
  password = req.session.pass;
  
  users.find({
    username,
    password
  })
  .toArray()
  .then((data) => {
    if(data.length === 1){//valid cookie
      next()
    }else{//invalid cookie, send user to login page
      res.sendFile(__dirname + "/views/index.html");
    }
  })
})


//listener
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


