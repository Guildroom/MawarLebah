const passport = require('passport');
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

router.post('/register',(req,res)=>{
    const { name, email, password} = req.body;
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
            password
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'Email ID already registered' });
                res.render('user/register', {
                    errors,
                    name,
                    email,
                    password
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                bycrypt.genSalt(10, (err, salt) => {
                    bycrypt.hash(newUser.password, salt, (err, hash) => {
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

router.get('/',(req, res)=> {
    res.render('user/index')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
});


module.exports = router