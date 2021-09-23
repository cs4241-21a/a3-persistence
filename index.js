const express = require("express")
const { emitWarning } = require("process")
const app = express()

app.get("/",function(res,res){
    res.send("Works")
})

app.listen(process.env.PORT || 5000)