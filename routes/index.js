'use strict';

var yelpHandler = require(process.cwd() + '/app/controllers/yelpHandler.server.js');

module.exports = function (app, db) {
   var YelpHandler = new yelpHandler(db);

   app.route('/')
      .get(function (req, res) {
         res.sendFile(process.cwd() + '/public/index.html');
      });

 //  app.route('api/yelp/?')
  //    .get(YelpHandler.getYelp)
/*   app.route('/api/clicks')
      .get(clickHandler.getClicks)
      .post(clickHandler.addClick)
      .delete(clickHandler.resetClicks); */
};