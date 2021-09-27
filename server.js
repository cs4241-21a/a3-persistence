const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      app = express()

app.use( express.static('public') )
app.use( express.json() )
app.use( express.urlencoded( {extended : true}  ) )

console.log("hi")
const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null
let user_data = null
let username = null
client.connect() 

app.get( '/login.html', (req,res) => {
  res.sendFile(__dirname + "/views/login.html")
})
app.get( '/logout', ( request, response ) => {
  response.redirect( "/login.html" )
})
app.get( '/index.html', (req,res) => {
  res.sendFile(__dirname + "/views/index.html")
})

app.get( '/user', (req,res) => {
  res.end(username)
})

app.post( '/update', async (req,res) => {
  await loadData(username)
  res.writeHead( 200, "OK", { 'Content-Type': 'application/json' } )
  res.end( JSON.stringify( user_data ) )
})

app.post( '/addnew', async ( request, response ) => {
  let json = request.body
  console.log(json.name)
  addMaterial(json.name, calcDens(json.mass, json.volume), parseInt(json.mass), parseInt(json.volume), parseInt(json.cost), calcCost(json.mass, json.cost))
  response.redirect("/index.html")
  
})

app.post( '/login', async ( request, response ) => {
  let json = request.body
  console.log(json)
  
  
  switch(await checkUser (json.username, json.password)) {
  case "success":
    username = json.username
    user_data = client.db('character_saver').collection('characters')
    response.redirect("/index.html");
    await loadData(json.username)
    break;
  case "fail":
    response.redirect( "/login.html" )
    break;
  case "no_user":
    createUser(json.username, json.password)
    break;
  default:

}
})

app.listen( 3000 )



// check username and passowrd
const checkUser = async function( username, password ) { 
  let users = client.db('character_saver').collection('users')
  // check username
  return users.findOne( { username: username } )
  .then( user => {
    if ( user ) {
      // check password
      if ( user.password === password ) {
        return "success"
      }
      return "fail"
    }
    return "no_user"
  })
}

// create new user
const createUser = async function (username, password) {
  console.log("create")
  let users = client.db('character_saver').collection('users')
  users.insertOne( { username: username, password: password } )
}

// load user data
const loadData = async function (username) {
  console.log("loading")
  user_data = await client.db('character_saver').collection('characters').find({ user: username }).toArray()
  console.log(user_data)
}

const addMaterial = async function (name, density, mass, volume, cost, totcost){
  let users = client.db('character_saver').collection('characters')
  users.insertOne( { user: username, name: name, density: density, mass: mass, volume: volume, cost: cost, totcost: totcost } )
}

const calcDens = function (mass, volume){
  return mass/volume
}

const calcCost = function (mass, cost){
  return mass * cost
}