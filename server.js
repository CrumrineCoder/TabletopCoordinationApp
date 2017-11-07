'use strict';

var express = require('express');
var mongo = require('mongodb');
var routes = require('./routes/index.js');

var app = express();
const bodyParser = require('body-parser');


mongo.connect('mongodb://' + process.env.HOST + '/' + process.env.NAME, function (err, db) {

   if (err) {
      throw new Error('Database failed to connect!');
   } else {
      console.log('Successfully connected to MongoDB on port 27017.');
   } 

   app.use('/public', express.static(process.cwd() + '/public'));
   app.use('/controllers', express.static(process.cwd() + '/controllers'));
  app.use(bodyParser.urlencoded({ extended: true }));
  routes(app, db);

   app.listen(3000, function () {
      console.log('Node.js listening on port 3000...');
   });
  
 

});
