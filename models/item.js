const mongoose = require('mongoose')
    itemSchema = new mongoose.Schema({

        name:{
            type: String,
            require: [true, 'I need a Name']
        },
        length:{
          type: Intl
        },
        author:{
            type: String,
            require: [true, 'An author would be nice']
        },
        checkoutDate:{
          type: Date,
          default: Date.now()
        },
        by:{
            type: Object,
            require: [true, 'Who\'s doing the checking out?']
        },
        ISBN:{
            type:String
        }

    })

const item = mongoose.model('item', itemSchema)
module.exports = item;