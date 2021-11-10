const mongoose = require('mongoose')

const shippingScema = new mongoose.Schema({
    emailUser : {
        type : String,
        require : true
    },
    adminID : { 
        type : String,
        require : true
    },
    cartID : {
        type :String,
        require : true
    },
    kurirID : { 
        type : String,
        require : true
    },
    total : {
        type : Number,
        require : true
    },
    shipAt : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model('shipping', shippingScema)