const express = require('express'),
	mongodb = require('mongodb'),
	path = require('path'),
	bodyparser = require("body-parser"),
	favicon = require('serve-favicon'),
	cookie = require('cookie-session'),
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
	})


// ------ Serve Non-Secret Files ------


// login
app.get('/login', function (request, response) {
	response.sendFile(__dirname + '/public/login.html')
})

// join
app.get('/join', function (request, response) {
	response.sendFile(__dirname + '/public/join.html')
})

// css
app.get('/styles.css', function (request, response) {
	response.sendFile(__dirname + '/public/css/styles.css')
})

// icon
app.get('/G3P-logo.png', function (request, response) {
	response.sendFile(__dirname + '/public/assets/G3P-logo.png')
})


// ------ Account ------


// User login authentication
app.post('/login', (request, response) => {
	console.log('/login:')
	console.log(request.body)

	// TODO: authenticate account with DB
	if (request.body.password === 'test') {
		request.session.login = true
		response.redirect('/')
	} else {
		// TODO: inform client about login error
		response.redirect('/login')
	}
})


// Create new account
app.post('/join', (request, response) => {
	console.log('/join:')
	console.log(request.body)

	// TODO: Check if account exist etc
	if (request.body.email === 'not@registered.com') {
		// Create account
		response.redirect('/login')
	} else {
		// TODO: inform client about create error
		response.redirect('/join')
	}
})


// Block all unauthenticated access
app.use(function (request, response, next) {
	if (request.session.login === true)
		next()
	else
		response.redirect('/login')
})


// ------ Logged in only ------
// ------ Logged in only ------
// ------ Logged in only ------


// Serve static files
app.use(express.static('public', {extensions: ['html', 'js', 'css']}))

// index
app.get('/', function (request, response) {
	response.sendFile(__dirname + '/public/index.html')
})


// ------ Data Manipulation ------


app.listen(3000)