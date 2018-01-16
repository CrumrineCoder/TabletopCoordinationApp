'use strict';
/* Authentication: */
/*
  This file handles connecting the user to the server and the controllers to the database. 
*/
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// Connect to the database with mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.HOST + '/' + process.env.NAME, {
    useMongoClient: true
});
var db = mongoose.connection;
// Route and set up Express
var users = require('./app/routes/users.js');
var express = require('express'),
    routes = require('./app/routes/index.js'),
    mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mLab = 'mongodb://' + process.env.HOST + '/' + process.env.NAME;
var app = express();
// Set up handlebars, which is the view engine for html
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');
// Set up body and cookie parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
// Connect the JS, HTML, and CSS
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/views', express.static(process.cwd() + '/views'));
// Set up the passport session
app.use(session({
    secret: process.env.PASSKEY,
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
// Error message formatting
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
// Used to show the error and success messages
app.use(flash());
// Set up the req.user variable and the msgs
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
// /users will route to the users routes
app.use('/users', users);
// Connect to MongoDB and route it to the routing
MongoClient.connect(mLab, function(err, db) {
    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        //  console.log('MongoDB successfully connected on port 27017.');
    }
    //Exports the routes to app and db
    routes(app, db);
    app.listen(3000, function() {
        //    console.log('Listening on port 3000...');
    });
});