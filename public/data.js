const mongoose = require("mongoose");
const DataSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    Assignment: {
        type: String,
        required: true
    },
    Class: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    Due: {
        type: Date,
        required: true
    },
    Days: {
        type: Number,
        required: false
    }
})
module.exports = mongoose.model("data", DataSchema)