const mongoose = require('mongoose');
const todoItemSchema = require("../models/todoitem")
const { Schema } = mongoose;

const LocalUser = new Schema({
    username: String,
    displayname: String,
    password: String,
    todolist: {
        type: [{
            name: String,
            duedate: String,
            priority: Number,
            importance: Number,
            category: String
        }]
    },
    todocompleted: {
        type: [{
            name: String,
            duedate: String,
            priority: Number,
            category: String
        }]
    }
})

module.exports = {
    model: mongoose.model('LocalUser', LocalUser),
    schema: LocalUser
}