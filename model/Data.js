const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        max: 200,
        min: 3
    },
    name:{
        type: String,
        max: 1024,
    },
    country:{
        type: String,
        max: 1024,
    },
    age:{
        type: String,
        max: 1024,
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Data', userDataSchema);