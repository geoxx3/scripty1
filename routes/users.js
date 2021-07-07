const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')

router.get('/register', (req, res) =>{
    res.render('register')
})

router.post('/register', catchAsync(async (req, res, next) =>{
  try {
    const {email, username, password} = req.body
    const user = new User({email, username})
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, err => {
      if (err) return next (err)
      req.flash('success','welcome')
      res.redirect('/user')
  
    })
  } catch (e) {
      req.flash ('error', e.message)
      res.redirect('/register')
  }
}))

router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/terms', (req, res) => {
  res.render('terms')
})

router.get('/privacy', (req, res) => {
  res.render('privacy')
})

router.post('/login', passport.authenticate('local',
     {failureFlash: true, failureRedirect: '/login' }),
     (req, res) => {
        req.flash('success', 'welcome back');
        res.redirect('/user')
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('succes', 'Goodby')
    res.redirect('/')
})

module.exports = router