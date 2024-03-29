const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const cartScema = new mongoose.Schema({
    itemName : {
        type : String,
        require : true
    },
    itemID : {
        type : Schema.Types.ObjectId,
        ref : 'item',
        require : true
    },
    itemPrice : {
        type : Number,
        require : true
    },
    total : { 
        type : Number,
        default : 1,
        require : true
    },
    userEmail : {
        type : String,
        require : true
    },
    adminID : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        require : true
    }
})

module.exports = mongoose.model('cart', cartScema)