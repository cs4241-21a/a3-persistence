const mongoose = require('mongoose');

const userlogInSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        max: 200,
        min: 3
    },
    password:{
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userlogInSchema);