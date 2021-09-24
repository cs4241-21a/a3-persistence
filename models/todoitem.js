const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoItemSchema = new Schema({
  title: String,
  priority: Number,
  duedate: String,
  importance: Number,
  category: String
})

module.exports = {
    model: mongoose.model('TodoItem', todoItemSchema),
    schema: todoItemSchema
}