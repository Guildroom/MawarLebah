const express = require('express')
const Item = require('./../models/item')
const User = require('./../models/User')
const Cart = require('./../models/cart')
const Kurir = require('./../models/kurir')
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
    const kurir = await Kurir.find().sort({price: 'desc'})
    let sum = 0
    let totalCart = 0
    let adminID = 'admin'
    cart.forEach(p=>{
        sum += p.total
        adminID = p.adminID
        totalCart += 1
    })
    console.log(adminID)
    const admin = await User.findOne({_id : adminID})
    let location = 0
    if(admin.location < req.user.location){
        location = req.user.location - admin.location
    } else {
        location = admin.location - req.user.location
    }
    console.log(location)
    res.render('user/cart', {
        location :location,
        kurir : kurir,
        totalCart : totalCart,
        sum : sum,
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
    let errors = [];
    const item = await Item.findById(req.params.id)
    const admin = await User.findOne().where({email : item.adminEmail})
    console.log(admin.name)
    Cart.findOne({userEmail : req.user.email}).then(cart =>{
        if(cart) {
            if(admin.id == cart.adminID) {
                let newcart = new Cart
                newcart.itemName = item.name
                newcart.itemID = item.id
                newcart.adminID = admin.id
                newcart.itemPrice = item.price
                newcart.userEmail = req.user.email
                newcart.total = req.body.total*item.price
                try{
                    newcart = newcart.save()
                    res.redirect('/home')
                }catch(e){
                    console.log(e)
                }
            }
            else{
                errors.push({ msg: 'You Already have a cart with another admin' });
                res.redirect('#')
            }
        }
        else {
            let newcart = new Cart
            newcart.itemName = item.name
            newcart.itemID = item.id
            newcart.adminID = admin.id
            newcart.itemPrice = item.price
            newcart.userEmail = req.user.email
            newcart.total = req.body.total*item.price
            try{
                newcart = newcart.save()
                res.redirect('/home')
            }catch(e){
                console.log(e)
            }
        }
    })
})

module.exports = router