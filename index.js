const express = require('express')
const mongoose = require('mongoose')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const userRouter = require('./router/user')
const homeRouter = require('./router/Home')
const adminRouter = require('./router/admin')

const app = express()

require('./config/passport')(passport);

const db = require('./config/key').MongoURI;

mongoose.connect(db,{ 
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.log(err));

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended : false}))

app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

app.get('/',async (req,res)=>{
    res.render('index')
})

app.use('/user', userRouter)
app.use('/home', homeRouter)
app.use('/admin', adminRouter)

app.listen(3000)