const express = require('express')
const Item = require('./../models/item')
const Cart = require('./../models/cart')
const Tracker = require('./../models/tracker')
const { ensureAuthenticated } = require('../config/checkAuth')
const router = express.Router()

router.get('/shop',ensureAuthenticated, async(req, res)=> {
    const item = await Item.find().sort({name: 'desc'})
    res.render('Shop', {
        item : item,
        name: req.user.name
    })
})

router.get('/cart',ensureAuthenticated, async(req, res)=> {
    const cart = await Cart.find({userEmail : req.user.email}).sort({name: 'desc'})
    const carttotal = cart.total*cart.itemPrice
    res.render('user/cart', {
        cart : cart,
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
    let newtracker = new Tracker
    newtracker.userEmail = req.user.email
    newtracker.itemID = item.id
    try{
        newtracker = await newtracker.save()
    }catch(e){
        console.log(e)
    }
    res.render('item', {
        item : item,
        name: req.user.name
})})

router.post('/item/:id', ensureAuthenticated, async(req, res) =>{ 
    const item = await Item.findById(req.params.id)
    let newcart = new Cart
    newcart.itemName = item.name
    newcart.itemID = item.id
    newcart.itemPrice = item.price
    newcart.userEmail = req.user.email
    newcart.total = req.body.total*item.price
    try{
        newcart = await newcart.save()
        res.redirect('/home/')
    }catch(e){
        console.log(e)
    }
})

module.exports = router