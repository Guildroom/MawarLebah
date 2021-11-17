const express = require('express')
const Item = require('./../models/item')
const User = require('./../models/User')
const Cart = require('./../models/cart')
const Kurir = require('./../models/kurir')
const Ship = require('./../models/shipping')
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
    const admin = await User.findOne({_id : adminID})
    let location = 0
    if(admin.location < req.user.location){
        location = req.user.location - admin.location
    } else {
        location = admin.location - req.user.location
    }
    res.render('user/cart', {
        location :location,
        kurir : kurir,
        totalCart : totalCart,
        sum : sum,
        cart : cart,
        name: req.user.name
    })
})

router.post('/cart', async(req,res)=>{
    let user = await User.findById(req.user._id)
    const cart = await Cart.find({userEmail : req.user.email}).sort({name: 'desc'})
    let adminID = 'admin'
    let total = 0
    cart.forEach(p=>{
        total += p.total
        adminID = p.adminID
    })
    const admin = await User.findOne({_id : adminID})
    let location = 0
    if(admin.location < req.user.location){
        location = req.user.location - admin.location
    } else {
        location = admin.location - req.user.location
    }
    const kurir = await Kurir.findOne({namaPerusahaan : req.body.kurir})
    total += kurir.price*location
    cart.forEach(p=>{
        let ship = new Ship()
        ship.emailUser = req.user.email
        ship.adminID = p.adminID
        ship.cartID = p.id
        ship.kurirID = kurir.id
        ship.total = total
        try{
            ship = ship.save()
        }catch(e){
            console.log(e)
        }
    })
    res.redirect('/home/payment')
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

router.get('/payment', ensureAuthenticated, async(req,res)=>{
    const ship = await Ship.find({emailUser : req.user.email},{ship : false})
    ship.forEach(p=>{
        adminID = p.adminID
        kurirID =p.kurirID
        total = p.total
    })
    const admin = await User.findOne({_id : adminID})
    const kurir = await Kurir.findOne({_id : kurirID})
    let senderlocation = "location"
    switch(admin.location){
        case 1 :
            senderlocation = "bali"
            break
        case 2 :
            senderlocation = "jawa timur"
            break
        case 3 :
            senderlocation = "jawa tengah"
            break
        case 4 :
            senderlocation = "jawa barat"
            break
    }
    let location = "location"
    switch(req.user.location){
        case 1 :
            location = "bali"
            break
        case 2 :
            location = "jawa timur"
            break
        case 3 :
            location = "jawa tengah"
            break
        case 4 :
            location = "jawa barat"
            break
    }
    res.render('user/pay', {
        name: req.user.name,
        email : req.user.email,
        sender : senderlocation,
        location : location,
        kurir : kurir.namaPerusahaan,
        total : total
})})

router.post('/payment',ensureAuthenticated, async(req,res)=>{
    const ship = await Ship.find({emailUser : req.user.email})
    let user = await User.findById(req.user._id)
    ship.forEach(p=>{
        total = p.total
        p.status = "getting currier"
        try {
            p = p.save()
        }catch(e){
            console.log(e)
        }
    })
    user.mawarpay -= total
    try{
        user = user.save()
    }catch(e){
        console.log(e)
    }
    res.redirect('/home')
})
module.exports = router