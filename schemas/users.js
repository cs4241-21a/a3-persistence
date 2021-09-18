const { model, Schema } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        passwordHash: {
            type: String
        }
    }
);

module.exports = model('users', UserSchema);