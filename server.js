const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Ashwin:Pai@a3-webware-ashwin.fyarv.mongodb.net/A3-Webware-MongoDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(__dirname + '/public/'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
})

app.use(bodyParser.json());
app.post('/login', (req, res) =>{
    handlePost(req.body)
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})
/**
 * handlePost is responsible for handling the incoming POST request associated with "login" button
 * @param json
 */
let handlePost = function(json){
    console.log("JSON" ,json)
    let username = json.username;
    let password = json.password;

    doesUserExist(username, password);

}

let doesUserExist = function(username, password){
    client.connect(err => {
        let query = {
            "username": username,
            "password": password
        }

    });

}