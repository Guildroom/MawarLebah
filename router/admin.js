const express = require('express')
const router = express.Router()

router.get('/',(req, res)=> {
    res.render('admin/index')
})

router.get('/list',(req, res)=> {
    res.render('admin/list_item')
})

module.exports = router