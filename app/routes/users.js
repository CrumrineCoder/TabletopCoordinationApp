var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// This file handles routing when registering and logging in users
var User = require(process.cwd() + '/models/user');
var RememberMeStrategy = require('passport-remember-me').Strategy;
// Register
router.get('/register', function(req, res) {

    res.render('register');
});

// Login
router.get('/login', function(req, res) {

    res.render('login');
});

// Homepage
router.get('/index', function(req, res) {

    res.render('index');
});

router.get('/user_data', function(req, res) {

    if (req.user === undefined) {
        // The user is not logged in
        res.json({});
    } else {
        res.json({
            username: req.user.username
        });
    }
});

// Register User
router.post('/register', function(req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;


    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        User.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {
                    message: 'Unknown User'
                });
            }

            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
            });
        });
    }));

passport.use(new RememberMeStrategy(
    function(token, done) {
        Token.consume(token, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        });
    },
    function(user, done) {
        var token = utils.generateToken(64);
        Token.save(token, {
            userId: user.id
        }, function(err) {
            if (err) {
                return done(err);
            }
            return done(null, token);
        });
    }
));

// Login
router.get('/dashboard', function(req, res) {

    res.render('dashboard');
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    function(req, res, next) {
        // issue a remember me cookie if the option was checked
        if (!req.body.remember_me) {
            return next();
        }

        var token = utils.generateToken(64);
        Token.save(token, {
            userId: req.user.id
        }, function(err) {
            if (err) {
                return done(err);
            }
            res.cookie('remember_me', token, {
                path: '/',
                httpOnly: true,
                maxAge: 604800000
            }); // 7 days
            return next();
        });
    },
    function(req, res) {
        //       res.redirect('/');
    });

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router; 