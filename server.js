
const express = require("express")
const cookie  = require( 'cookie-session' )
const app = express() 



app.use( express.urlencoded({ extended:true }) )//meddleware 
app.use(express.json())

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

//const { ObjectID } = require('bson');
const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://a3u1:a3u1@a3-jpoulos000.aibxf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");

 // addUsers(collection)//used manually 
});


/*const addUsers = async () => { // stock

  const collection = client.db("test").collection("devices");
  await collection.insertOne({user: "Jared", password: "1234", appdata: [] })
  
  await collection.insertOne({user: "admin", password: "admin", appdata: [] })
}*/

const addUser =  (userIn, passwordIn) => { // stock

  const collection = client.db("test").collection("devices");
   collection.insertOne({user: userIn, password: passwordIn, appdata: [] })
  
}

app.get("/", (req, res) => {
  if(req.session.login){
    res.sendFile(__dirname + "/public/index.html")
  }
  res.sendFile(__dirname + "/public/signin.html")
})

const getappdata =  (username) => {
  const collection = client.db("test").collection("devices");
  return  collection.findOne({user:username}).appdata
}

const getUsername = ( username) => {
  const collection = client.db("test").collection("devices");
  return collection.findOne({user:username})
}


//--------------------------------------
 app.post( '/login',    async (req,res) =>{
    //{user: "name", password: "pass"}
    console.log(req.body)
      console.log("hit login")
      
  let dataObj =  req.body
  console.log(dataObj)



  let user = dataObj.user
  
  let foundJSON =  await getUsername(user)

  console.log(foundJSON)
  if(foundJSON != null){
    if(foundJSON.password===dataObj.password){
// define a variable that we can check in other middleware
    // the session object is added to our requests by the cookie-session middleware
    
    
      req.session.login = true
      req.session.user = user

    console.log("login sucess")
    // since login was successful, send the user to the main content=
    res.status(201).end();
    }
    else{
      // password incorrect, redirect back to login page
      res.status(202).end();

      //res.sendFile( __dirname + '/public/signin.html' )
    }
  }
    
  else{
    // user incorrect, redirect back to login page
    res.status(202).end();
    
  }

})

app.post( '/logout',  (req,res) =>{
  
    console.log("hit")
    req.session.login = false
    req.session.user = ""

    res.status(202).end();
})

app.post( '/signup',    async (req,res) =>{
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered

    //{user: "name", password: "pass"}
  console.log(req.body)
      
  let dataObj =  req.body
  console.log(dataObj)

  console.log("hit signup")


  let user = dataObj.user

  let password = dataObj.password
  
  let foundJSON =  await getUsername(user)

  console.log(foundJSON)

  if(foundJSON != null){

    //console.log("already exists")
    
    res.status(202).end();
    
  }
  else{
    // user incorrect, redirect back to login page
    
    console.log("Create new")

    await addUser(user, password)

    req.session.login = true
    req.session.user = user

    res.status(201).end();
  }

})

// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true ){
    next()}
  else{
    res.sendFile( __dirname + '/public/signin.html' )
    console.log("middleware") 
    //res.redirect("/signin")
   
  }
})

// serve up static files in the directory public
app.use( express.static('public', {extensions: ["html"]}) )
//---------------------------------------

/*app.post("/login", (req, res) => {  
  
})*/

app.post("/submit", async function (req, res) {


  const collection = client.db("test").collection("devices");
  let dbdata = await collection.findOne({user:req.session.user})

  let appdata = dbdata.appdata

  console.log(dbdata.appdata)
  let dataObj =  req.body

  if(appdata == null){
    console.log("400")
    res.status(500).end() //sends a json object as response
  }
  

  if(dataObj.id >= appdata.length){
    console.log("400")
    res.status(400) //sends a json object as response
  }
    else{
    if(dataObj.id == -1){ //indicates add
      dataObj.id = appdata.length
      appdata.push(dataObj)
      console.log("add")
    }
    else if(dataObj.load == -1) //indicates deletion
    {
      console.log("deletion")
      
      newappdata = []
      for(let i = 0; i < dataObj.id; i++){
        newappdata.push(appdata[i])
        
      }
      
      for(let j = (dataObj.id+1); j < appdata.length; j++){
        
          let aline = appdata[j]
          aline.id = aline.id - 1

          newappdata.push(aline)
      }
    
      appdata = newappdata
    }
    else{ // indicates modify
      appdata[dataObj.id] = dataObj
    }

    //load re-calculation
    let sortnames = []
    
    for (let i = 0; i < appdata.length; i++){//start with sorted list of names
      let aline = appdata[i]
      sortnames.push(aline.name)
    }
    sortnames.sort()
    let allnames = []
    let namescount = []
    let lastname = sortnames[0]
    allnames.push(sortnames[0])
    namescount.push(1)
    let countindex = 0;
    for (let i = 1; i < sortnames.length; i++){//get counts
      if(!(lastname === sortnames[i])){
        allnames.push(sortnames[i])
        namescount.push(1)
        lastname = sortnames[i]
        countindex++
      }
      else{
        namescount[countindex] =  namescount[countindex] + 1
      }
    }

  

    for (let i = 0; i < appdata.length; i++){
      let aline = appdata[i]

      aline.load = namescount[(allnames.indexOf(aline.name))]

      appdata[i] = aline
    }

   
    //res.json(appdata)
  }

  await collection.updateOne({user: "admin", password: "admin", appdata: appdata })
 

  res.json(appdata)
})

app.listen(3000)
