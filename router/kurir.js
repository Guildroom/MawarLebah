const express = require('express')
const Kurir = require('./../models/kurir')
const { ensureAuthenticated } = require('../config/checkAuth')
const router = express.Router()

router.get('/register',(req,res)=>{
    res.render('kurir/register')
})

router.post('/register',(req,res)=>{
    const { name, phone, price, time} = req.body;
    let errors = [];
    if (!name || !phone || !price || !time) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if(errors.length > 0)
    {
        res.render('kurir/register')
    } 
    else{
        Kurir.findOne({namaPerusahaan : name}).then(kurir=>{
            if(kurir)
            {
                errors.push({ msg: 'Company already registered' })
                res.render('kurir/register')
            }
            else{
                let newKurir = new Kurir
                newKurir.namaPerusahaan = name,
                newKurir.phoneNumber = phone,
                newKurir.time = time,
                newKurir.price = price
                try{
                    newKurir = newKurir.save()
                    res.render('kurir/register')
                }catch(e){
                    console.log(e)
                }
            }
        })
    }
})

module.exports = router
