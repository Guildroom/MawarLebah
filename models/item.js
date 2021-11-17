const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const itemScema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    price : { 
        type : Number,
        require : true
    },
    adminEmail : {
        type : String,
        require : true
    },
    stock : {
        type : Number,
        require : true
    },
    description : {
        type : String
    }
})

module.exports = mongoose.model('item', itemScema)