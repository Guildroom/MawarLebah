const express = require('express')
const router = express.Router()

router.get('/shop',(req, res)=> {
    res.render('Shop')
})

module.exports = router