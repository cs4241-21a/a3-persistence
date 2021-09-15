const { model, Schema } = require('mongoose');

const TaskSchema = new Schema(
    {
        title: {
            type: String,
            unique: true
        },
        description: {
            type: String
        },
        priority: {
            type: Number
        },
        createdOn: {
            type: String,
        },
        deadline: {
            type: String,
        },
        // Link to users model
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }
);

module.exports = model('tasks', TaskSchema);