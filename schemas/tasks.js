const { model, Schema } = require('mongoose');

const TaskSchema = new Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String
        },
        priority: {
            type: Number
        },
        dateCreated: {
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