const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const trackerScema = new mongoose.Schema({
    userEmail : {
        type : String,
        require : true
    },
    itemID : { 
        type : Schema.Types.ObjectId,
        ref : 'item',
        require : true
    },
    clickAT : {
        type : Date,
        default: Date.now
    }
})

module.exports = mongoose.model('tracker', trackerScema)