"use strict";

/* if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
} */
var express = require('express');

var ejsMate = require('ejs-mate');

var mongoose = require('mongoose');

var session = require('express-session');

var flash = require('connect-flash');

var path = require('path');

var dotenv = require('dotenv');

var passport = require('passport');

var ExpressError = require('./utils/ExpressError');

var LocalStrategy = require('passport-local');

var User = require('./models/user');

var helmet = require('helmet');

var _require = require('./middleware'),
    isLoggedIn = _require.isLoggedIn;

var userRoutes = require('./routes/users');

var MongoDBStore = require("connect-mongo")(session);

dotenv.config({
  path: './config.env'
});
var DB = process.env.DATABASE || 'mongodb://localhost:27017/auth';
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(function () {
  return console.log('DB connection successful!');
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});
var app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({
  extended: true
}));
app.use(express["static"](path.join(__dirname, 'public')));
var secret = process.env.SECRET || 'thisshouldbeabettersecret!';
var store = new MongoDBStore({
  url: DB,
  secret: secret,
  touchafter: 24 * 60 * 60
});
store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e);
});
var sessionConfig = {
  store: store,
  name: 'name',
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    //secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));
app.use(flash()); //app.use(helmet())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
  // console.log(req.session)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
app.use('/', userRoutes);
app.get('/', function (req, res) {
  res.render('index');
});
app.get('/pricing', function (req, res) {
  res.render('pricing');
});
app.get('/contact', function (req, res) {
  res.render('contact');
});
app.get('/user', isLoggedIn, function (req, res) {
  res.render('user');
});
/* app.get('/login', (req, res) => {
    res.render('login')
}) */

/* app.get('/register', (req, res) => {
    res.render('register')
})  */

app.get('/strl', function (req, res) {
  res.render('strl');
});
app.get('/strs', function (req, res) {
  res.render('strs');
});
app.all('*', function (req, res, next) {
  next(new ExpressError('Page Not Found', 404));
});
/* app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})  */

app.listen(5000, function () {
  console.log('listening at 5000');
});
//# sourceMappingURL=index.dev.js.map
