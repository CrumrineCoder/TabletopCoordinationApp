'use strict';
(function() {
    var app = angular.module('yelp', []);
    app.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
    });
    app.controller('yelpController', function($scope) {
        $scope.stores = [];
        var attendButtons = [true, true, true, true, true];
        var DIV = document.createElement("DIV");

        function ready(fn) {
            if (typeof fn !== 'function') {
                return;
            }
            if (document.readyState === 'complete') {
                return fn();
            }
            document.addEventListener('DOMContentLoaded', fn, false);
        }

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

        function getUser(callback) {
            ajaxRequest('GET', apiUrl + "users/user_data", function(data) {
                data = JSON.parse(data);
                if (data.hasOwnProperty('username')) {
                    user = data.username;
                }
                callback();
            });
        }
        var logged = false;
        getUser(function() {
            if (user != undefined) {
                logged = true;
            }
        });
        var searchTerm = document.getElementById("searchBar");
        var buttonToSubmit = document.getElementById("findStores");
        $('#findStores').submit(function(e) {
            e.preventDefault();
            var searchText = searchTerm.value;
            var users = [];
            var counter = 0;
            ajaxRequest('GET', apiUrl + "api/yelp/?location=" + searchText, function(data) {
                data = JSON.parse(data);
                mySyncFunction(counter);

                function mySyncFunction(counter) {
                    if (counter === undefined) {
                        counter = 0;
                    }
                    if (counter >= 5) {
                        theRest();
                        return;
                    };
                    ajaxRequest('GET', apiUrl + "api/getUsers/?id=" + data[counter].id, function(data) {
                        data = JSON.parse(data);
                        users.push(data);
                        counter++;
                        mySyncFunction(counter);
                    })
                }

                function rsvp(id, number) {
                    document.getElementById(id).removeEventListener("click", function() {
                        rsvp(this.id, number);
                    });
                    document.getElementById(id).addEventListener("click", function() {
                        remove(this.id, number);
                    });
                    $scope.$apply(function() {
                        $scope.stores[number].buttonText = "REMOVE"
                    })
                    ajaxRequest('GET', apiUrl + "/api/addRSVP/?user=" + user + "&id=" + id, function(data) {});
                }

                function remove(id, number) {
                    document.getElementById(id).addEventListener("click", function() {
                        rsvp(this.id, number);
                    });
                    document.getElementById(id).removeEventListener("click", function() {
                        remove(this.id, number);
                    });
                    $scope.$apply(function() {
                        $scope.stores[number].buttonText = "ATTEND"
                    })
                    ajaxRequest('GET', apiUrl + "/api/removeRSVP/?user=" + user + "&id=" + id, function(data) {});
                }

                function theRest() {
                    for (var i = 0; i < 5; i++) {
                        var amount = users[i].length;
                        if (amount == undefined) {
                            amount = 0;
                        }
                        amount += " going";
                        data[i].amountOfUsers = amount;
                        if (logged) {
                            if (users[i].indexOf(user) == -1) {
                                data[i].buttonText = "ATTEND";
                            } else {
                                data[i].buttonText = "REMOVE";
                            }
                            data[i].buttonID = data[i].id;
                        }
                        $scope.$apply(function() {
                            $scope.stores.push(data[i]);
                        });
                        (function() {
                            var numb = i;
                            if (logged) {
                                if (users[i].indexOf(user) == -1) {
                                    document.getElementById(data[i].id).addEventListener("click", function() {
                                        rsvp(this.id, numb);
                                    });
                                } else {
                                    document.getElementById(data[i].id).addEventListener("click", function() {
                                        remove(this.id, numb);
                                    });
                                }
                            }
                        }());
                    }
                }
            });
        });
    });
})();