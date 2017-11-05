'use strict';

function clickHandler(db) {
    var clicks = db.collection('clicks');
    this.getClicks = function(req, res) {
        var clickProjection = {
            '_id': false
        };
        clicks.findOne({}, clickProjection, function(err, result) {
            if (err) {
                throw err;
            }
            if (result) {
                res.json(result);
            } else {
                clicks.insert({
                    'clicks': 0
                }, function(err) {
                    if (err) {
                        throw err;
                    }
                    clicks.findOne({}, clickProjection, function(err, doc) {
                        if (err) {
                            throw err;
                        }
                        res.json(doc);
                    });
                });
            }
        });
    };
    this.addClick = function(req, res) {
        clicks.findAndModify({}, {
            '_id': 1
        }, {
            $inc: {
                'clicks': 1
            }
        }, function(err, result) {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    };
    this.resetClicks = function(req, res) {
        clicks.update({}, {
            'clicks': 0
        }, function(err, result) {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    };
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
            term: 'Tabletop',
            location: location
        }).then(response => {
            console.log(response.jsonBody.businesses[0].name);
        }).catch(e => {
            console.log(e);
        });
    }
  }
}
module.exports = clickHandler;