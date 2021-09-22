const express = require( 'express' ),
    mongodb = require( 'mongodb' ),
    app = express(),
    port = 3000,
    mongoDatabase = 'hmkfinancetracker',
    mongoCollection = 'users',
    mongoCollection2 = 'userportfolios',
    cookie = require( 'cookie-session' )

// ********** MongoDB Init ************
// make sure to substitute your username / password for tester:tester123 below!!! 
const uri = 'mongodb+srv://hmkyriacou:bHYCiPtad5DtBOKH@a3-cluster.wk5nt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let userCollection = null
let protfolioCollection = null

client.connect()
    .then( () => {
        // will only create collection if it doesn't exist
        return client.db( mongoDatabase ).collection( mongoCollection )
    })
    .then( __collection => {
        // store reference to collection
        userCollection = __collection
    })
    .then( () => {
        return client.db( mongoDatabase ).collection( mongoCollection2 )
    })
    .then( __collection => {
        portfolioCollection = __collection
        return "DONE 2"
    })
    .then( console.log )
// ********** MongoDB Init ************

// ********** Express Middlewares *****
app.use( express.urlencoded({ extended:true }) )

app.use( cookie({
    name: 'session',
    keys: ['knawpkdnawdnp wjdnao ajwndoo oawndoa', 'ownefa awindaownawk awnda own']
}))

app.use( express.static('public') )

app.use( express.json() )

app.get("/portfolio", (req, res) => {

    if (req.session.login) {
        res.sendFile(__dirname + "/protected/portfolio.html")
    } else {
        res.status(401).redirect("/login.html")
    }
})

app.post( "/createaccount", async (req, res) => {
    console.log(req.body)
    
    let repeat = false

    let count = await userCollection.find({'username':req.body.find(elm => elm.name === "username").value}).count()
    
    if (count > 0 ) {
        repeat = true
    }
    
    if (repeat) {
        res.status(409).end("Duplicate username")
        return
    }

    let data = {}
    req.body.forEach(el => {
        if (el.name !== 'password2')
            data[el.name] = el.value
    })

    userCollection.insertOne( data )
        .then( console.log )
})

app.post( "/login", async (req, res) => { 
    console.log(req.body)
    
    let uName = req.body.find(elm=>elm.name==='username').value
    let pWord = req.body.find(elm=>elm.name==='password').value

    let arr = await userCollection.find({'username':uName}).toArray()
    
    if (arr.length !== 1) {
        //incorect username/password
        req.session.login= false
        res.status(401).end()
    } else if (arr[0].username === uName && arr[0].password === pWord) { 
        // correct user/pass
        req.session.login = true

        res.redirect("/portfolio")
    } else {
        // incorrect user/pass
        req.session.login= false
        res.status(401).end()
    }

    })

app.get("/logout", (req, res) => {
    req.session.login = false
    res.redirect("index.html")
})

app.get('/add', function (req, res) {
    collection
        .insertOne(req.body)
})

app.listen(port, () => {
    console.log(`Listening at https://localhost:${port}`)
})
// ********** Express Middlewares *****
