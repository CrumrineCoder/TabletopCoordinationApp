
'use strict';

function yelpHandler(db) {
	// Get all stores currently logged in the database. 
    var storeCollection = db.collection('store');
    this.getUsers = function(req, res) {
        // Find all stores by the ID provided that has a user in it
        var stores = storeCollection.find({
            id: req.query.id
        }, {
            users: 1
        }).toArray(function(err, doc) {
			// Return the results of the search; if there's nothing say there's nothing. If so
            if (doc.length == 0 || doc == null) {
                res.json([]);
            } else {
                res.json(doc[0].users);
            }
        });
    }
	// Add the user to the collection of users going to a store
    this.addRSVP = function(req, res) {
        var notFound;
        var userLength = 1;
        var stores = storeCollection.find({
            id: req.query.id
        }, {
            id: 1
        }).limit(1).toArray(function(err, doc) {
            if (doc.length == 0 || doc == null) {
                storeCollection.insertOne({
                    id: req.query.id,
                    users: [req.query.user]
                });
            } else {
                storeCollection.update({
                        id: req.query.id
                    },
                    //Should be a way to check if the user is already in the array
                    {
                        $push: {
                            users: req.query.user
                        }
                    })
            }
            res.send()
        });
    }
// Remove the user from the collection of users going to a store
    this.removeRSVP = function(req, res) {
        var notFound;
        var userLength = 1;
        storeCollection.find({
            id: req.query.id
        }).limit(1).toArray(function(err, doc) {
            console.log(doc);
            storeCollection.update({
                    id: req.query.id
                },
                //Should be a way to check if the user is already in the array
                {
                    $pull: {
                        users: req.query.user
                    }
                })
            if (doc[0].users.length == 1) {
                storeCollection.deleteOne({
                    id: req.query.id
                });
            }
        });
        res.send()
    }
// Get the Yelp data from a database search
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
                for (var i = 0; i < 6; i++) {
                    add.city = response.jsonBody.businesses[i].location.city;
                    add.address = response.jsonBody.businesses[i].location.display_address[0];
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
// Check if a store is in the store collection
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