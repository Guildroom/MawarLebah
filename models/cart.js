const mongoose = require('mongoose')

const cartScema = new mongoose.Schema({
    itemName : {
        type : String,
        require : true
    },
    itemID : {
        type : String,
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
    }
})

module.exports = mongoose.model('cart', cartScema)