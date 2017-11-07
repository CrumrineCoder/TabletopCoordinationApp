'use strict';

function yelpHandler(db) {
//    var clicks = db.collection('clicks');
///console.log("hi");
    const yelp = require('yelp-fusion');
  
  this.getYelp = function(req, res){
    var location = req.query.location; 
    console.log(location);
    yelp.accessToken(process.env.clientId, process.env.clientSecret).then(response => {
        const token = response.jsonBody.access_token;
        const client = yelp.client(token);
        processData(client, location);
    }).catch(e => {
        console.log(e);
    });

    function processData(client, location) {
        client.search({
            term: 'Tabletop Games',
            location: location
        }).then(response => {
            console.log(response.jsonBody.businesses[0].name);
        }).catch(e => {
            console.log(e);
        });
    }
  }
}
module.exports = yelpHandler;