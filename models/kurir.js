const mongoose = require('mongoose')

const kurirScema = new mongoose.Schema({
    namaPerusahaan : {
        type : String,
        require : true
    },
    phoneNumber : {
        type : String,
        require : true
    },
    time : { 
        type : Number,
        require : true
    },
    price : { 
        type : Number,
        require : true
    }
})

module.exports = mongoose.model('kurir', kurirScema)