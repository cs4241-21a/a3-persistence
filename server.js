const express			= require('express');
const session			= require('express-session');
const hbs				= require('express-handlebars');
const mongodb           = require('mongodb');
const MongoClient       = mongodb.MongoClient;
const mongoose			= require('mongoose');
const passport			= require('passport');
const path              = require('path')
const localStrategy		= require('passport-local').Strategy;
const bcrypt			= require('bcrypt');
const app				= express();
const uri = "mongodb+srv://carlosavp23:CAVPadmin@cluster0.j8unn.mongodb.net/a3_persistence?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
var port = process.env.PORT || 5000;

mongoose.connect( uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

const User = mongoose.model('User', UserSchema);
    


// Middleware
app.engine('hbs', hbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname + '/public')));
app.set('Views', path.join(__dirname, 'Views'));
app.use(session({
	secret: "verygoodsecret",
	resave: false,
	saveUninitialized: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

client.connect(err => {
    collection = client.db("a3_persistence").collection("JobLog");
     users = client.db("a3_persistence").collection("User");
 });

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new localStrategy(function (username, password, done) {
	User.findOne({ username: username }, function (err, user) {
		if (err) return done(err);
		if (!user) return done(null, false, { message: 'Incorrect username.' });

		bcrypt.compare(password, user.password, function (err, res) {
			if (err) return done(err);
			if (res === false) return done(null, false, { message: 'Incorrect password.' });
			
			return done(null, user);
		});
	});
}));

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
}

function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) return next();
	res.redirect('/');
}

// ROUTES
app.get('/', isLoggedIn, (req, res) => {
	res.render("index", { title: "Home" });
});

app.get('/about', (req, res) => {
	res.render("index", { title: "About" });
});

app.get('/login', isLoggedOut, (req, res) => {
	const response = {
		title: "Login",
		error: req.query.error
	}

	res.render('login', response);
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login?error=true'
}));

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

app.get("/", function(req, res) {
    res.render("login");
  });

// Setup our admin user
app.get('/setup', async (req, res) => {
	const exists = await User.exists({ username: "admin" });

	if (exists) {
		res.redirect('/login');
		return;
	};

	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash("pass", salt, function (err, hash) {
			if (err) return next(err);
			
			const newAdmin = new User({
				username: "admin",
				password: hash
			});

			newAdmin.save();

			res.redirect('/login');
		});
	});
});


// send the default array of dreams to the webpage
app.get("/load", (request, response) => {
    if( collection !== null ) {
      // get array and pass to res.json
      collection.find({ _id: mongodb.ObjectId }).toArray()
      .then( result => response.json(result) )
    }
      //response.json(JSON.stringify(data));
  });
  
  
  app.post('/add',express.json(),function(req,res){
    collection.insertOne({
                          positionname: req.body.positionname,
                          company:req.body.company,
                          location: req.body.location,
                          references:req.body.references,
                          date: req.body.date})
  .then( insertResponse => collection.findOne( insertResponse.insertedId ) ) 
  .then( findResponse   => res.json( findResponse ) ) 
  })
  
    
  app.post('/deleteAll',express.json(),function(req,res){
    console.log("deleted all")
    collection.remove()
  })

  app.post('/edit',express.json(),function(req,res){

    collection.deleteOne({ positionname: req.body.oldPosition, company:req.body.oldCompany,
        location: req.body.oldLocation,
        references:req.body.oldReference,
        date: req.body.oldDate}, function (err, results) {
            if (err){
                console.log("not found")
            }
        });
  })


app.listen(port, () => {
	console.log("Listening on port 5000");
});