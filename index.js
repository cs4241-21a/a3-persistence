const express = require("express")
const { emitWarning } = require("process")
const app = express()

app.get("/",function(req,res){
    res.send("Works")
})

app.listen(process.env.PORT || 5000)