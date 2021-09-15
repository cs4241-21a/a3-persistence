const express = require( 'express' ),
    expressLayouts = require('express-ejs-layouts'),
    mongodb = require( 'mongodb' ),
    PORT = process.env.PORT || 3000
    app = express()

//ejs

app.use(expressLayouts);
app.set('view engine', 'ejs')

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


app.listen( PORT, console.log(`server started on port ${PORT}`) )