const mongoose = require('mongoose')

const userScema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    password : { 
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    admin : {
        type : String,
        require : true
    },
    description : {
        type : String
    },
    location : {
        type : Number,
        require : true
    },
    mawarpay : {
        type : Number,
        require : true,
        default : 0
    }
})

module.exports = mongoose.model('User', userScema)