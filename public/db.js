const mongoose = require("mongoose")
const MONGOURI = "mongodb+srv://user:dba2password@cluster0.luebu.mongodb.net"

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true
        })
    }
    catch (e) {
        console.log(e)
        throw e
    }
}

module.exports = InitiateMongoServer