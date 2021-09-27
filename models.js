const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = mongoose.Schema({
        username: {type: String, required: false},
        password: {type: String, required: false},
        githubId: {type: String, required: false}
    },
    {versionKey: false});
userSchema.plugin(findOrCreate);
const userModel = mongoose.model('User', userSchema, 'users');

const flightSchema = mongoose.Schema({
        flightNum: {type: String},
        depAirport: {type: String},
        arrAirport: {type: String},
        date: {type: String},
        owner: {type: String}
    },
    {versionKey: false});
const flightModel = mongoose.model('Flight', flightSchema, 'flights');

module.exports = {
    User: userModel,
    Flight: flightModel
};
