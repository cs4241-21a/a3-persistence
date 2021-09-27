const express = require('express')
const data = require("/public/data")
const morgan = require('morgan')
const favicon = require('serve-favicon')
const cors = require('cors')


const InitiateMongoServer = require("/public/db");
InitiateMongoServer().then(() => {
    console.log("Connected to DB")
});
const app = express();
app.use(express.static('public'))
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("public/data", data)
app.use(morgan('tiny'))
app.use(cors())


app.use( function( req, res, next ) {
    console.log( 'url:', req.url )
    next()
})
app.get( '/', function (req, res) {
    res.sendFile(__dirname + "/index.html" )
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`)
})