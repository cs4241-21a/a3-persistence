const express = require( 'express' ),
    expressLayouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    {connect} = require('mongoose'),
    PORT = process.env.PORT || 3000,
    app = express();
    robots = require('express-robots-txt')
const session = require("express-session");
const MongoStore = require('connect-mongodb-session')(session);
const passport = require('passport');
passportLocalMongoose =
    require("passport-local-mongoose");
require("passport-local");
require("./models/User");
require('./config/localAuth');
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
    require('dotenv').config();

//db config
const db = require('./config/keys').MongoURI;

connect(db, {useNewUrlParser:true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//storing users on server
const store = new MongoStore({
    uri:db,
    collection:'Users'
})

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs')

//bodyparser
app.use(express.urlencoded({ extended:false }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}));


//routes
router = require('./routes/index')
app.use('/', router)

app.use(cookieparser);
app.use(
    session({
        secret: "very secret this is",
        resave: false,
        saveUninitialized: true,
        store: store,
        cookie: { maxAge : 1200000 }
    })
);
app.use(function(err, req, res, next) {
    console.log(err);
});

app.use(passport.initialize);
app.use(passport.session);

app.use(robots({
    UserAgent: '*',
    Disallow: '/',
}))

app.listen( PORT )
console.log(`server started on port ${PORT}`)