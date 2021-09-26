const express = require('express'),
	mongodb = require('mongodb'),
	path = require('path'),
	bodyparser = require("body-parser"),
	favicon = require('serve-favicon'),
	cookieSession = require('cookie-session'),
	app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyparser.json())
app.use(favicon(path.join(__dirname, "public/assets/G3P-logo.png")))

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST

// Database Connection
const client = new mongodb.MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true})
let collection = null

client.connect()
	.then(() => {
		return client.db('ExpenseTracker').collection('enus')
	})
	.then(__collection => {
		collection = __collection
		console.log('mongoDB connection established')
		// DB Tester
		collection.find({"email": "test@testers.com", "password": "test"})
			.toArray().then(result => {
			if (result[0] !== undefined)
				console.log(result[0]._id.toString())
			else console.log("Test user not found")
		})
	})

// Checks DB connection
app.use((req, res, next) => {
	if (collection !== null) {
		next()
	} else {
		res.status(503).send()
	}
})


// Cookie
app.use(cookieSession({
	name: 'session',
	keys: ['key', 'backup1', 'backup2'],
	maxAge: 7 * 24 * 60 * 60 * 1000 // A week
}))


// ------ Serve Non-Secret Files ------


// login
app.get('/login', function (req, res) {
	res.sendFile(__dirname + '/public/login.html')
})

// join
app.get('/join', function (req, res) {
	res.sendFile(__dirname + '/public/join.html')
})

// css
app.get('/styles.css', function (req, res) {
	res.sendFile(__dirname + '/public/css/styles.css')
})

// icon
app.get('/G3P-logo.png', function (req, res) {
	res.sendFile(__dirname + '/public/assets/G3P-logo.png')
})


// ------ Account ------


// User login authentication
app.post('/login', (req, res) => {
	console.log('/login:')
	console.log(req.body)

	collection.find({"email": req.body.email, "password": req.body.password}).toArray()
		.then(
			result => {
				if (result === "" || result[0] === undefined) {
					// TODO: Inform user "Email or Password Incorrect"
					res.redirect('/login')
				} else {
					console.log("Successfully logged in")
					req.session.login = true
					console.log("user _id: " + result[0]._id.toString())
					req.session.id = result[0]._id.toString()
					// TODO: This is a temporary implementation of the "Remember me" feature
					if (req.body.remember !== 'on') {
						req.sessionOptions.maxAge = 60 * 1000 // 1 Minute
					}
					res.redirect('/')
				}
			})
})

// User logout
app.get('/logout', function (req, res) {
	req.session = null
	// TODO: Inform user "Successfully logged out"
	res.redirect('/login')
})


// Create new account
app.post('/join', (req, res) => {
	console.log('/join:')
	console.log(req.body)

	if (req.body.password !== req.body.passwordC) {
		// TODO: Inform user "Passwords don't match"
		res.redirect('/join')
	}

	collection.find({"email": req.body.email}).toArray()
		.then(
			result => {
				if (result[0] !== undefined) {
					// TODO: Inform user "Email already used"
					res.redirect('/join')
				} else {
					let newUser = {
						"email": req.body.email,
						"password": req.body.password,
						"list": []
					}
					collection.insertOne(newUser).then(() => {
							console.log("Successfully created account")
							res.redirect('/login')
						}
					)
				}
			})
})


// Block all unauthenticated access
app.use(function (req, res, next) {
	if (req.session.login === true)
		next()
	else
		res.redirect('/login')
})


// ------ Logged in only ------
// ------ Logged in only ------
// ------ Logged in only ------


// Serve static files
app.use(express.static('public', {extensions: ['html', 'js', 'css']}))

// index
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html')
})


// ------ CRUD ------


app.get('/read', (req, res) => {
	if (collection !== null) {
		collection.find({_id: new mongodb.ObjectId(req.session.id)}).toArray().then(result => res.json(result[0].list))
	}
})


app.listen(3000)