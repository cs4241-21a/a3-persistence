// CONSTANT VARIABLES
const express = require('express')
const bodyParser = require('body-parser');
const cookieSession = require("cookie-session");
const serveStatic = require("serve-static");
const timeout = require("connect-timeout")
const path = require("path");

const app = express()
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Ashwin:Pai@a3-webware-ashwin.fyarv.mongodb.net/A3-Webware-MongoDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Instance Variables
let currentUser = null;

// EXPRESS APP.USE STATEMENTS
app.use(bodyParser.json());
app.use(serveStatic(path.join(__dirname, '/public/')));
app.use( express.urlencoded({ extended:true }) )
app.use( cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
    numHits: 0
}))
app.use(timeout('1000s'))

app.delete("/deleteEntry", async (req, res) =>{
    await handleDelete(req.body);
})

let DATABASE = "A3-Webware-MongoDB"
let COLLECTION_NAME = "Car-Entry-Holder"
async function handleDelete(searchCriteria){
    searchCriteria["userID"] = currentUser
    console.log( "Attempting to Delete Entry with ", searchCriteria)
    await client.connect()
    let db = client.db(DATABASE)
    await db.collection(COLLECTION_NAME)
        .deleteOne(
            {"car_name": searchCriteria.car_name, "userID": searchCriteria.userID}, function(err, obj){
        if(err) throw err;
        console.log("Document was found");
        console.log(obj)
    })
}

/**
 * POST request that is responsible for loading in the entry's that are associated with a userID.
 *
 */
app.post("/getUserInformation",  async (req, res) => {
    let userEntries = []
    await getUserInformation(req.body.userID).then((response) => {
        return response;
    }).then((dataList) =>{
        for(let i = 0; i < dataList.length; i++){
            userEntries.push(dataList[i])
        }
    })
    respObj = {entries: userEntries}
    if(userEntries.length === 0){console.log("Empty User")}
    res.send(JSON.stringify(respObj))
})

/**
 * POST request that will insert the body into mongoDB.
 */
app.post("/submit", (req, res) =>{
    addEntry(req.body)
})

app.get('/getUser', (req, res) =>{
    let body = {"user": currentUser}
    console.log("Current User is ", currentUser);
    res.send(JSON.stringify(body));
})

/**
 *  POST request that handles the user logging in
 */
app.post('/login', (req, res) =>{
    handlePost(req.body).then(function(validUser){
        if(req.session.login === true){
            console.log("Welcome Back", req.session.authID)
        }
        let resObj;
        if (validUser) {
            currentUser = req.body.username;
            req.session.login = true;
            req.session.authID = req.body.username;
            resObj = {
                username: req.body.username,
                loggedIn: validUser
            }
            res.send(resObj)
        }
    })
})

/**
 *  When a user is properly authenticated it will send them to the loggedIn.html webpage.
 */
app.get('/loggedIn', (req, res) => {
    res.sendFile(__dirname + '/public/loggedIn.html')
})

/**
 * handlePost is responsible for handling the incoming POST request associated with "login" button
 * @param json
 */
let handlePost = async function(json){
    let username = json.username;
    let password = json.password;
    let validUser = false;
    await doesUserExist(username, password).then(function(result){
        validUser = result;
        return result;
    })
    if(validUser){
        console.log("Sending User to Main Screen")
        return validUser;
    }else console.log("Try Again!")
}

/**
 * doesUserExists checks to see if a User {Username, Password} returns true if authenticated false otherwise.
 * @param username
 * @param password
 * @returns {Promise<boolean>}
 */
async function doesUserExist(username, password){
    try{
        await client.connect()
        let authenticated = false;
        await checkUser(client, username, password).then(function(token){
            authenticated = token;
        });
        return authenticated
    }catch (e) {
        console.error(e);
    }finally{await client.close();}
}

/**
 * connectDatabase is the function that checks to see if a user is authenticated (they have a user login) stored
 * in the MongoDB
 *
 * @param client - MongoDB Client
 * @param username - username (sorry for bad security)
 * @param password - password (sorry for bad security)
 * @returns {boolean}
 */
let LOGIN_DATABASE_AUTHENTICATION = "A3-Webware-MongoDB"
let LOGIN_COLLECTION = "User-Login"
async function checkUser(client, username, password){
    let authenticated = false;
    let db = client.db(LOGIN_DATABASE_AUTHENTICATION)
    await db.collection(LOGIN_COLLECTION).find().forEach(function(user){
        if(user.username === username && user.password === password){
            console.log("Found a User with Matching Credentials")
            authenticated = true
        }
    })
    return authenticated
}

/**
 * getUserInformation is a function that returns all car-entrys that are associated with a userID.
 *
 * @param userID
 * @returns {*[]}
 */
async function getUserInformation(userID){
    let userEntries = []

    await client.connect()
    let db = client.db(LOGIN_DATABASE_ENTRY)
    await db.collection(LOGIN_COLLECTION_CAR).find({userID}).toArray()
        .then((result) => {
            return result
        }).then((dataList) =>{
            for(let i = 0; i < dataList.length; i++){
                userEntries.push(dataList[i])
            }
        })
     return userEntries;
}

/**
 * addEntry adds the entry into the Car-Entry-Holder Database
 * @type {string}
 */
let LOGIN_DATABASE_ENTRY = "A3-Webware-MongoDB"
let LOGIN_COLLECTION_CAR = "Car-Entry-Holder"
async function addEntry(body){
    if(currentUser !== null){
        body["userID"] = currentUser;
        await client.connect()
        let db = client.db(LOGIN_DATABASE_ENTRY)
        await db.collection(LOGIN_COLLECTION_CAR).insertOne(body, function(err, res){
            if(err) throw err;
            console.log("Inserted Successfully")
        })
    } else{ console.log("Please Login and Try again.")}

}

/**
 *  GET request that handles the initial page that unauthenticated users will see.
 */
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
})

/** Establishes that the Express Server will be listening on PORT 3000
 *
 * @type {number}
 */
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})