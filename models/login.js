const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userEntrySchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, {timestamps: true });

const UserEntry = mongoose.model('user', userEntrySchema);
module.exports = UserEntry;
