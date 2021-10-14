const mongoose = require('mongoose')

const userScema = new mongoose.Schema({
    Name : {
        type : String,
        require : true
    },
    Password : { 
        type : String,
        require : true
    },
    Email : {
        type : String,
        require : true
    }
})

module.exports = mongoose.model('User', userScema)