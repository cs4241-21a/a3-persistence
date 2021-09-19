const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreEntrySchema = new Schema({
    yourname: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    rank: {
        type: Number,
        required: true,
    },
}, {timestamps: true });

const ScoreEntry = mongoose.model('Score Entry', scoreEntrySchema);
module.exports = ScoreEntry;
