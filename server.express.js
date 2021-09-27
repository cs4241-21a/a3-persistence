const express = require('express'),
      cookie = require('cookie-session'),
      mongodb = require('mongodb'),
      morgan = require('morgan')
      responseTime = require('response-time')
      path = require('path')
      favicon = require('serve-favicon')
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
    //.then(console.log)

client.connect()
    .then( () => {
        return client.db('a3').collection('assignments')
    })
    .then(__assignments => {
        assignments = __assignments
        //finding {} returns all documents in the DB
        return assignments.find({ }).toArray()
    })
    //.then(console.log)

// app.get('/', (req,res) => {
//     if(users !== null){
//         users.find({ }).toArray.then(result => res.json (result))
//     }
// })

app.use(morgan('combined'))
app.use(responseTime(function(req,res,time){
    console.log("time to handle request (ms): " + time)
}))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use((req,res,next)=>{      //note that a .use call with no mount path runs on every single request to app (the server)
    if (users !== null || assignments !== null){
        next()
    }else{
        res.status(503).send()
    }
})

app.post('/login', (req, res) => {
    //console.log (req.body)

    let query = { username: req.body.username }
    
    users.findOne(query)
        .then( userquery => {
            //console.log(userquery)
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

app.post('/refresh', (req,res) => {

    let query = {username: req.session.username}
    
    assignments.findOne(query)
        .then(assignmentquery => {
            if(assignmentquery === null){  
                res.json({})
            }else{   //else need to update the existing record
                let assignmentsArr = assignmentquery.assignments
                res.json(assignmentsArr)
            }
        })
})

app.post('/add', (req,res) => {
    
    let query = { username: req.session.username }

    assignments.findOne(query)
        .then(assignmentquery => {
            if(assignmentquery === null){  //need to make a new entry for this user
                let newEntry = { username: req.session.username,
                                 assignments: [req.body]}
                assignments.insertOne(newEntry)
                    .then(result => res.json(result))
            }else{   //else need to update the existing record
                assignmentquery.assignments.push(req.body)
                assignments.updateOne(query, {$set: assignmentquery})
                    .then(result => res.json(result))
            }
        })
})

app.post('/remove', (req,res) => {
    let query = { username: req.session.username}
    //console.log(req.body)

    assignments.findOne(query)
        .then(assignmentquery => {
            let currAssignments = assignmentquery.assignments
            let assignmentToRemove = req.body.removeAssignment;
            currAssignments.splice(assignmentToRemove, 1);
            assignments.updateOne(query, {$set: assignmentquery})
                .then(result => res.json(result))
        })
})

app.post('/edit', (req,res) => {
    let query = { username: req.session.username}
    //console.log(req.body)

    assignments.findOne(query)
        .then(assignmentquery => {
            let currAssignments = assignmentquery.assignments   //assignment array
            let assignmentNumber = req.body.assignmentNumber;   //assignment number to remove
            let newAssignmentRequest = req.body;           //specific request from the client
            delete newAssignmentRequest.assignmentNumber;   //remove assignment number from the request
            currAssignments[assignmentNumber] = newAssignmentRequest   //place new record into the assignment array, overwriting old one
            let newRecord = {username: req.session.username,
                             assignments: currAssignments}
            assignments.updateOne(query, {$set: newRecord})   //update array in the db
                .then(result => res.json(result))
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