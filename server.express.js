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
    keys: ['asdf', 'uiop']
}))

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let users = null
let assignments = null

client.connect()
    .then( () => {
        return client.db('a3').collection('users')
    })
    .then(__users => {
        users = __users
        //finding {} returns all documents in the DB
        return users.find({ }).toArray()
    })
    .then(console.log)

client.connect()
    .then( () => {
        return client.db('a3').collection('assignments')
    })
    .then(__assignments => {
        assignments = __assignments
        //finding {} returns all documents in the DB
        return assignments.find({ }).toArray()
    })
    .then(console.log)

// app.get('/', (req,res) => {
//     if(users !== null){
//         users.find({ }).toArray.then(result => res.json (result))
//     }
// })


app.use((req,res,next)=>{      //note that a .use call with no mount path runs on every single request to app (the server)
    if (users !== null || assignments !== null){
        next()
    }else{
        res.status(503).send()
    }
})

app.post('/login', (req, res) => {
    console.log (req.body)

    let query = { username: req.body.username }
    
    users.findOne(query)
        .then( userquery => {
            console.log(userquery)
            if(userquery === null){  //if the user doesn't exist
                let newuser = { username: req.body.username,
                                password: req.body.password}
                users.insertOne(newuser)
                    .then( () =>{
                        req.session.login = true
                        req.session.username = req.body.username
                        req.session.usercreated = true
                        res.send('<script>alert("New user created!"); window.location.href = "/main.html";</script>')
                    })
            }else{
                if(userquery.password === req.body.password){  //check if password matches
                    req.session.login = true
                    req.session.username = req.body.username
                    req.session.usercreated = 
                    res.redirect('main.html')
                }else{
                    res.send('<script>alert("Incorrect login information!"); window.location.href = "/index.html";</script>')
                }
            }
        })

    

})

app.use(function(req,res,next){
    if(req.session.login === true){
        next()
    }else{
        res.sendFile(__dirname + '/public/index.html')
    }
})


app.listen(3000)