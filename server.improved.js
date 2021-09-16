const express = require( 'express' ),
    expressLayouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    PORT = process.env.PORT || 3000,
    app = express()
    require('dotenv').config();


//db config
const db = require('./config/keys').MongoURI;

mongoose.connect(db, {useNewUrlParser:true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs')

//bodyparser
app.use(express.urlencoded({ extended:false }))

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


app.listen( PORT, console.log(`server started on port ${PORT}`) )