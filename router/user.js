const passport = require('passport')
const { ensureAuthenticated } = require('../config/checkAuth')
const express = require('express')
const bycrypt = require('bcryptjs')
const User = require('./../models/User')
const router = express.Router()

router.get('/login',(req, res)=> {
    res.render('user/sign_in')
})

router.get('/register',(req, res)=> {
    res.render('user/register')
})

router.get('/item',(req, res)=> {
    res.render('user/item')
})

router.get('/', ensureAuthenticated, (req, res) => res.render('user/index', {
    name: req.user.name,
    email: req.user.email,
    deskripsi: req.user.description
}))

router.get('/topup', ensureAuthenticated, (req, res)=> {
    res.render('user/topup', {
        name: req.user.name
    })
})

router.get('/editprofile', ensureAuthenticated, (req, res) => res.render('user/editProfile', {
    name: req.user.name,
    email: req.user.email,
    deskripsi: req.user.description
}))

router.post('/topup', async(req,res)=>{
    let user = await User.findById(req.user._id)
    let total = Number(req.user.mawarpay)
    total += Number(req.body.total)
    user.mawarpay = total
    try{
        user = await user.save()
        res.redirect('/user')
    } catch(e){
        console.log(e)
    }
})

router.post('/register',(req,res)=>{
    const { name, email, password, admin, location} = req.body;
    let errors = [];
    if (!name || !email || !password) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }
    if (errors.length > 0) {
        res.render('user/register', {
            errors,
            name,
            email,
            password,
            admin
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email ID already registered' });
                res.render('user/register', {
                    errors,
                    name,
                    email,
                    password,
                    admin
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                    admin,
                    location
                });
                bycrypt.genSalt(10, (err, salt) => {
                    bycrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'Account activated. You can now log in.'
                                );
                                res.redirect('/user/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
})

router.post('/login', async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (user.admin == 'user') {
        passport.authenticate('local', {
            successRedirect: '/user',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next);
    }
    else{
        passport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next);
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
});


module.exports = router