const mongoose = require("mongoose");
const DataSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    adult: {
        type: Boolean,
        required: true
    }
})
module.exports = mongoose.model("data", DataSchema)