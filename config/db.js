const mongoose = require("mongoose")
const MONGOURI = "mongodb+srv://matthew7758:yukineChris@cluster0.4gg5m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

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