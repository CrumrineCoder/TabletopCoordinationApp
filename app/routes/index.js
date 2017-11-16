
'use strict';

var YelpHandler = require(process.cwd() + '/app/controllers/yelpHandler.server.js');

module.exports = function (app, db) {
   var yelpHandler = new YelpHandler(db);

   app.route('/')
      .get(function (req, res) {
         res.render(process.cwd() + '/views/index.handlebars');
      });
  app.route("/api/addRSVP/?")
    .get(yelpHandler.addRSVP)
  app.route("/api/removeRSVP/?")
    .get(yelpHandler.removeRSVP)
  app.route("/api/getUsers/?")
    .get(yelpHandler.getUsers)
  app.route('/api/yelp/?')
    .get(yelpHandler.getYelp)
};
  