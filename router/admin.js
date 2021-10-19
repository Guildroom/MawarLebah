const express = require('express')
const Item = require('./../models/item')
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