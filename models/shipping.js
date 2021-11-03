const mongoose = require('mongoose')

const kurirScema = new mongoose.Schema({
    emailUser : {
        type : String,
        require : true
    },
    adminID : { 
        type : String,
        require : true
    },
    cartID : { 
        type : String,
        require : true
    },
    shipAt : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model('kurir', kurirScema)