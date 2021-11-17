const express = require('express')
const Item = require('./../models/item')
const User = require('./../models/User')
const Cart = require('./../models/cart')
const Kurir = require('./../models/kurir')
const Ship = require('./../models/shipping')
const Tracker = require('./../models/tracker')
const { ensureAuthenticated } = require('../config/checkAuth')
const router = express.Router()

router.get('/', ensureAuthenticated, (req, res) => res.render('admin/index', {
    name: req.user.name,
    email: req.user.email,
    deskripsi: req.user.description
}))

router.get('/list', ensureAuthenticated, async (req, res)=> {
    const item = await Item.find({adminEmail : req.user.email}).sort({name: 'desc'})
    res.render('admin/list_item',{item : item})
})

router.get('/addnew',(req, res)=> {
    res.render('admin/add_new')
})

router.get('/pay',ensureAuthenticated, async(req, res)=> {
    const ship = await Ship.find({adminID : req.user._id}).populate("cartID")
    let totalB = 0
    ship.forEach(p=>{
        emailUser = p.emailUser
        kurirID =p.kurirID
        totalB += p.cartID.total
        total = p.total
    })
    const user = await User.findOne({email : emailUser})
    const kurir = await Kurir.findOne({_id : kurirID})
    let senderlocation = "location"
    switch(user.location){
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
    res.render('admin/pay', {
        ship : ship,
        name: req.user.name,
        email : req.user.email,
        sender : senderlocation,
        location : location,
        kurir : kurir.namaPerusahaan,
        total : total,
        totalB : totalB
})})

router.post('/pay',ensureAuthenticated, async (req,res)=>{
    const ship = await Ship.find({adminID : req.user._id})
    ship.forEach(p=>{
        p.status = "On The Way"
        p.ship = true
        try {
            p = p.save()
        }catch(e){
            console.log(e)
        }
    })
    res.redirect('/admin')
})

router.post('/addnew' ,ensureAuthenticated, async (req,res)=>{
    let newitem = new Item
    newitem.name = req.body.name
    newitem.price = req.body.price
    newitem.stock = req.body.stock
    newitem.description = req.body.description
    newitem.adminEmail = req.user.email
    try{
        newitem = await newitem.save()
        res.redirect('/admin/list')
    }catch(e){
        console.log(e)
    }
})

module.exports = router