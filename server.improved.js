const express = require( 'express' ),
    expressLayouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    {connect} = require('mongoose'),
    PORT = process.env.PORT || 3000,
    app = express();
const auth = require("./routes/index");
const session = require("express-session");
const MongoStore = require('connect-mongodb-session')(session);
const passport = require("passport");
passportLocalMongoose =
    require("passport-local-mongoose");
require("passport-local");
require("./models/User");
const bodyParser = require("body-parser");
    require('dotenv').config();
app.use(passport.initialize);
app.use(passport.session);

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

app.use(
    session({
        secret: "very secret this is",
        resave: false,
        saveUninitialized: true,
        store: store
    })
);


//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs')

//bodyparser
app.use(express.urlencoded({ extended:false }))
app.use(bodyParser.json())

//routes
router = require('./routes/index')
app.use('/library', router)



app.listen( PORT )
console.log(`server started on port ${PORT}`)