 if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
} 

const express = require('express')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require ('connect-flash')
const path = require('path')
const dotenv = require('dotenv')
const passport = require('passport')
const ExpressError = require('./utils/ExpressError');
const LocalStrategy = require('passport-local')
const User = require ('./models/user')
const helmet = require('helmet')
const {isLoggedIn} = require('./middleware')
const userRoutes = require('./routes/users')
const MongoDBStore = require("connect-mongo")(session)

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE || 'mongodb://localhost:27017/auth'

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const store = new MongoDBStore({
    url: DB,
    secret,
    touchafter: 24 * 60 *60
})

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    store,
    name: 'name',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());
//app.use(helmet())

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
   // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('index') 
}) 
app.get('/pricing', (req, res) => {
    res.render('pricing')
}) 
app.get('/contact', (req, res) => {
    res.render('contact')
}) 
app.get('/user', isLoggedIn, (req, res) => {
    res.render('user')
}) 

/* app.get('/login', (req, res) => {
    res.render('login')
}) */

/* app.get('/register', (req, res) => {
    res.render('register')
})  */
console.log('salut')

app.get('/strl', (req, res) => {
    res.render('strl')
}) 

app.get('/strs', (req, res) => {
    res.render('strs')
})
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

/* app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})  */

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`listening at ${port}`)
}) 

