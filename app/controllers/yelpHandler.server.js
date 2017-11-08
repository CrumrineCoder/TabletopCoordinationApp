'use strict';

function yelpHandler(db) {
    const yelp = require('yelp-fusion');
    this.getYelp = function(req, res) {
        var location = req.query.location;
        yelp.accessToken(process.env.clientId, process.env.clientSecret).then(response => {
            const token = response.jsonBody.access_token;
            const client = yelp.client(token);
            processData(client, location);
        }).catch(e => {
            console.log(e);
        });
        var businesses = [];

        function processData(client, location) {
            client.search({
                term: 'Tabletop Games',
                location: location
            }).then(response => {
                var add = {};
                for (var i = 0; i < 5; i++) {
                    add.id = response.jsonBody.businesses[i].id;
                    add.name = response.jsonBody.businesses[i].name;
                    add.image = response.jsonBody.businesses[i].image_url;
                    add.url = response.jsonBody.businesses[i].url;
                    add.rating = response.jsonBody.businesses[i].rating;
                    add.price = response.jsonBody.businesses[i].price;
                    businesses.push(add);
                    add = {};
                }
                businesses = JSON.stringify(businesses);
                res.send(businesses);
            }).catch(e => {
                console.log(e);
            });
        }
    }
}
module.exports = yelpHandler;