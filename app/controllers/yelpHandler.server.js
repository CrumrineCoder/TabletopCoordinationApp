'use strict';

function yelpHandler(db) {
    var storeCollection = db.collection('store');
  
  this.addRSVP = function(req, res){
    console.log("Test"); 
    console.log(req.query.user);
  }
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
    
     this.checkExistance = function(req, res) {
        storeCollection.find({
            question: req.query.question
        }, {
            $exists: true
        }).toArray(function(err, doc) //find if a value exists
            {
                if (err) throw err
                if (doc && doc.length) //if it does
                {
                    res.json(doc); // print out what it sends back
                } else // if it does not 
                {
                    res.json("Not in docs");
                }
            });

    }
}
module.exports = yelpHandler;