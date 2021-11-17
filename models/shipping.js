const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const shippingScema = new mongoose.Schema({
    emailUser : {
        type : String,
        require : true
    },
    adminID : { 
        type : Schema.Types.ObjectId,
        ref : 'User',
        require : true
    },
    cartID : {
        type : Schema.Types.ObjectId,
        ref : 'cart',
        require : true
    },
    kurirID : { 
        type : Schema.Types.ObjectId,
        ref : 'kurir',
        require : true
    },
    ship : {
        type : Boolean,
        default : false,
        require : true
    },
    total : {
        type : Number,
        require : true
    },
    shipAt : {
        type : Date,
        default: Date.now
    },
    status : {
        type : String,
        default : ""
    }
})

module.exports = mongoose.model('shipping', shippingScema)