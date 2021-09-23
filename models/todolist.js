const mongoose = require('mongoose');
const TodoItem = require('../models/todoitem')
const { Schema } = mongoose;

const todoListSchema = new Schema({
    items: [TodoItem.schema]
})

module.exports = {
    model: mongoose.model('TodoList', todoListSchema),
    schema: todoListSchema
}