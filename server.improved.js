const express = require( 'express' ),
    expressLayouts = require('express-ejs-layouts'),
    {connect} = require('mongoose'),
    PORT = process.env.PORT || 3000,
    app = express()

const passport = require("passport");
passportLocalMongoose =
    require("passport-local-mongoose");
const LocalStrategy = require("passport-local")
const User = require("./models/User");
const {route} = require("express/lib/router");
    require('dotenv').config();

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//db config
const db = require('./config/keys').MongoURI;

connect(db, {useNewUrlParser:true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs')

//bodyparser
app.use(express.urlencoded({ extended:false }))

//routes
router = require('./routes/index')
app.use('/library', passport.authenticate('bearer'), router.protected);
app.use('/', router.unprotected);


app.listen( PORT )
console.log(`server started on port ${PORT}`)