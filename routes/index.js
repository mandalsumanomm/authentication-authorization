var express = require('express');
var router = express.Router();
const passport = require('passport');
const userModel = require("./users");

const localStrategy = require("passport-local").Strategy;
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Profile
router.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile')
});

//register
router.post('/register', function (req, res) {

  let userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret
  })

  userModel.register(userdata, req.body.password)
    .then(function (registereduser) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/profile');
      })
    })
});

// Login
router.get('/login', function (req, res, next) {
  res.render('login', { error: '' });
});


//login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'
}), function (req, res) { });


// Logout
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});



// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
