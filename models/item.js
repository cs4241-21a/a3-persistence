const mongoose = require('mongoose')
    itemSchema = new mongoose.Schema({

        name:{
            type: String,
            require: true
        },
        length:{
          type: Intl
        },
        author:{
            type: String,
            require: true
        },
        checkoutDate:{
          type: Date,
          default: Date.now()
        },
        by:{
            type: Object,
            require: true
        }

    })

const item = mongoose.model('item', itemSchema)
module.exports = item;