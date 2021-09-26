const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);