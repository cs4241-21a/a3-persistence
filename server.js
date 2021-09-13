const express = require('express'),
      app     = express()

app.use(function(req, res, next) {
    console.log(req.url)
    next()
})

app.use(express.static('./'))

app.listen(3000)