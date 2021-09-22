const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewEntrySchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
}, {timestamps: true });

const ReviewEntry = mongoose.model('Review Entry', reviewEntrySchema);
module.exports = ReviewEntry;
