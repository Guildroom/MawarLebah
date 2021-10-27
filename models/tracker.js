const mongoose = require('mongoose')

const trackerScema = new mongoose.Schema({
    userEmail : {
        type : String,
        require : true
    },
    itemID : { 
        type : String,
        require : true
    },
    clickAT : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model('tracker', trackerScema)