
const express = require("express")
const cookie  = require( 'cookie-session' )
const app = express() 

app.use( express.urlencoded({ extended:true }) )
app.use(express.json())
app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

const { ObjectID } = require('bson');
const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://a3u1:a3u1@a3-jpoulos000.aibxf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");

 // addUsers(collection)//used manually 
});


const addUsers = async () => {

  const collection = client.db("test").collection("devices");
  await collection.insertOne({user: "Jared", password: "1234", appdata: [] })
  
  await collection.insertOne({user: "admin", password: "admin", appdata: [] })


}



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/signin.html")
})

const getappdata = async () => {
  const collection = client.db("test").collection("devices");
  return await collection.findOne({user:req.session.username}).appData
}

const getUsername = ( username) => {
  const collection = client.db("test").collection("devices");
  return collection.findOne({user:username})
}


//--------------------------------------
 app.post( '/login',    async (req,res) =>{
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered

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
    req.session.username = user
    req.session.login = true
    
    // since login was successful, send the user to the main content=
    res.redirect( '/index' )
    }
    else{
      // password incorrect, redirect back to login page
      res.redirect( '/signin' )
      //res.sendFile( __dirname + '/public/signin.html' )
    }
  }
    
  else{
    // password incorrect, redirect back to login page
    res.redirect(  '/signin' )
  }

 
})

// add some middleware that always sends unauthenicaetd users to the login page
/*app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.sendFile( __dirname + '/public/index.html' )
})*/

// serve up static files in the directory public
app.use( express.static('public', {extensions: ["html"]}) )
//---------------------------------------

/*app.post("/login", (req, res) => {  
  
})*/

app.post("/submit", (req, res) => {

  appdata = getappdata()

  let dataObj =  req.body

  if(dataObj.id >= appdata.length){
    res.json({peepee:"poopoo"}) //sends a json object as response
  }
    else{
    if(dataObj.id == -1){ //indicates add
      dataObj.id = appdata.length
      appdata.push(dataObj)
    }
    else if(dataObj.load == -1) //indicates deletion
    {
      
      
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
      appdata[dataObj.id] = dataString
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

    response.writeHead( 200, "OK", {'appdata': appdata })
    response.end(appdata)
  }
  


  res.json({peepee:"poopoo"}) //sends a json object as response
})

app.listen(3000)
