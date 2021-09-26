const express = require('express'),
      cookie = require('cookie-session'),
      mongodb = require('mongodb'),
      app = express();

require('dotenv').config();

app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(express.json())

app.use(cookie({
    name: 'session',
    keys: ['key1', 'key2']
}))

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
    .then( () => {
        return client.db('Cluster0').collection('Collection0')
    })
    .then(__collection => {
        collection = __collection
        //finding {} returns all documents in the DB
        return collection.find({ }).toArray()
    })
    .then(console.log)

app.get('/', (req,res) => {
    if(collection !== null){
        collection.find({ }).toArray.then(result => res.json (result))
    }
})


app.use((req,res,next)=>{      //note that a .use call with no mount path runs on every single request to app (the server)
    if (collection !== null){
        next()
    }else{
        res.status(503).send()
    }
})

app.post('/login', (req, res) => {
    console.log (req.body)

    //TESTING AUTHENTICATION
    if(req.body.password === 'test'){
        req.session.login = true
        res.redirect('main.html')
    }else{
        res.sendFile(__dirname + '/public/index.html')
    }
})

app.use(function(req,res,next){
    if(req.session.login === true){
        next()
    }else{
        res.sendFile(__dirname + '/public/index.html')
    }
})


app.listen(3000)