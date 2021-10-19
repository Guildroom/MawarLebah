const express = require('express')
const Item = require('./../models/item')
const { ensureAuthenticated } = require('../config/checkAuth')
const router = express.Router()

router.get('/shop',ensureAuthenticated, async(req, res)=> {
    const item = await Item.find().sort({name: 'desc'})
    res.render('Shop', {
        item : item,
        name: req.user.name
    })
})

router.get('/', ensureAuthenticated, async(req, res) => {
    const item = await Item.find().sort({name: 'desc'})
    res.render('home', {
    item : item,
    name: req.user.name
})})

router.get('/test', ensureAuthenticated, (req, res) => res.render('test', {
    name: req.user.name,
    email: req.user.email,
    deskripsi: req.user.description
}))

router.get('/item/:id', ensureAuthenticated, async(req, res) =>{ 
    const item = await Item.findById(req.params.id)
    res.render('item', {
        item : item,
        name: req.user.name
})})

module.exports = router