const mongoose = require('mongoose');
const todoItemSchema = require("../models/todoitem")
const { Schema } = mongoose;

const GHUser = new Schema({
    id: String,
    todolist: [todoItemSchema.schema]
})

module.exports = {
    model: mongoose.model('GHUsers', GHUser),
    schema: GHUser
}