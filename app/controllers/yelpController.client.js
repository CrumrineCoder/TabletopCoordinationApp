'use strict';




(function() {
    // Angular module set up
    var app = angular.module('yelp', []);
    // Since handlebars already uses {{ }}, I have to change angular to {[{ }]}
    app.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
    });
    // Set up the controller
    app.controller('yelpController', function($scope) {
		

        // This is where we store everything we need to display to the user
        $scope.stores = [];
        // Do something as soon as the page loads
        function ready(fn) {
            if (typeof fn !== 'function') {
                return;
            }
            if (document.readyState === 'complete') {
                return fn();
            }
            document.addEventListener('DOMContentLoaded', fn, false);
        }
        // Make requests to the backend
        function ajaxRequest(method, url, callback) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    callback(xmlhttp.response);
                }
            };
            xmlhttp.open(method, url, true);
            xmlhttp.send();
        }
        var apiUrl = 'https://tabletop.glitch.me/';
        var user;
        // Tell if the current user logged in is the same user as the data. 
        function getUser(callback) {
            ajaxRequest('GET', apiUrl + "users/user_data", function(data) {
                data = JSON.parse(data);
                if (data.hasOwnProperty('username')) {
                    user = data.username;
                }
                callback();
            });
        }
        // Tell if the user is logged in 
        var logged = false;
        getUser(function() {
            if (user != undefined) {
                logged = true;
            }
        });
        var searchTerm = document.getElementById("searchBar");
        var buttonToSubmit = document.getElementById("findStores");
		
		function search(searchText){
			// Reset the variable holding the stuff to display everytime. If this line wasn't here we would only be adding to stuff on screen without removing the past search results. 
            $scope.stores = [];
			// Other resets
            var users = [];
            var counter = 0;
            // Get the locations for the Yelp API
            ajaxRequest('GET', apiUrl + "api/yelp/?location=" + searchText, function(data) {
                data = JSON.parse(data);
                mySyncFunction(counter);

                function mySyncFunction(counter) {
                    // If the counter somehow becomes undefined
                    if (counter === undefined) {
                        counter = 0;
                    }
                    // After getting all the data. We have to do this because we're calling the database each time. 
                    if (counter >= 6) {
                        theRest();
                        return;
                    };
                    // Recursion. This function will get all of the users from a search text of a store. 
                    ajaxRequest('GET', apiUrl + "api/getUsers/?id=" + data[counter].id, function(data) {
                        data = JSON.parse(data);
                        users.push(data);
                        counter++;
                        mySyncFunction(counter);
                    })
                }
                // Add a user to the store
                function rsvp(id, number) {
                    $('#' + id).off().on('click', function() {
                        remove(this.id, number)
                    })
                    $("#" + $scope.stores[number].buttonID).toggleClass("remove");
                    $scope.$apply(function() {
                        $scope.stores[number].amountOfUsers += 1;
                        $scope.stores[number].buttonText = "REMOVE";
                    })
                    ajaxRequest('GET', apiUrl + "/api/addRSVP/?user=" + user + "&id=" + id, function(data) {});
                }
                // Remove a user from the store
                function remove(id, number) {
                    $('#' + id).off('click').on('click', function() {
                        rsvp(this.id, number)
                    })
                    $("#" + $scope.stores[number].buttonID).toggleClass("remove");
                    $scope.$apply(function() {
                        $scope.stores[number].amountOfUsers -= 1;
                        $scope.stores[number].buttonText = "ATTEND";
                    })
                    ajaxRequest('GET', apiUrl + "/api/removeRSVP/?user=" + user + "&id=" + id, function(data) {});
                }

                function theRest() {
                    for (var i = 0; i < 6; i++) {
                        // Get the amount of users 
                        var amount = users[i].length;
                        if (amount == undefined) {
                            amount = 0;
                        }
                        data[i].amountOfUsers = amount;
                        // If the user is logged in then they can attend and so add the buttons. 
                        if (logged) {
                            if (users[i].indexOf(user) == -1) {
                                data[i].buttonText = "ATTEND";
                            } else {
                                data[i].buttonText = "REMOVE";
                            }
                            data[i].buttonID = data[i].id;
                        }
                        // Show the stores to the user
                        $scope.$apply(function() {
                            $scope.stores.push(data[i]);
                        });
                        (function() {
                            var numb = i;
                            if (logged) {
                                // If the user logged in is not the same as the group attending already, add an "Attend" button. If not, add a "Remove" button. 
                                if (users[i].indexOf(user) == -1) {
                                    $("#" + data[i].id).on("click", function() {
                                        rsvp(this.id, numb);
                                    });
                                } else {
                                    $("#" + data[i].id).toggleClass("remove");
                                    $("#" + data[i].id).on("click", function() {
                                        remove(this.id, numb);
                                    });
                                }
                            }
                        }());
                    }
                }
            });
		}
        // Event listener for the form submission
        $('#findStores').submit(function(e) {
			// Stop the form from default submission
            e.preventDefault();
			search(searchTerm.value);
            
        });
		$('#searchByIP').click(function() {
			navigator.geolocation.getCurrentPosition(function(position){
				// API stuff
				var lat = position.coords.latitude;
				var long = position.coords.longitude;
				var for_key = "813195e09d571d569dfc52a878bea90c";
				var apikey = "AIzaSyDCZSr-AlvZAUyBbAytuXVfVlkoGDLkFYA";
				var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + "," + long + "&key=" + apikey;
				var for_call = "https://api.forecast.io/forecast/" + for_key + "/" + lat + "," + long + "?callback=?";
				$.getJSON(GEOCODING, function(json) {
					// get location 
					var address = json.results[2].formatted_address;
					search(address);
				}); 
			});
			search(searchTerm.value);
		});
    });
})();