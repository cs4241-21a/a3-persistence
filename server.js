const express = require('express');

const app = express();

app.use(function (req, res, next) {

    next()
})

app.use(express.static('./'))
app.listen(3000)