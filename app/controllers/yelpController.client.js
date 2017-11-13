'use strict';
(function() {
    var app = angular.module('yelp', []);
    app.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
    }); 
  app.controller('yelpController', function($scope){
    console.log("Hello");
 $scope.stores = [
       {id: "frank"}, {id: "Reynolds"}
      ]
 });

  
  
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

    function rsvp(test) {
        ajaxRequest('GET', apiUrl + "/api/addRSVP/?user=" + user + "&id=" + test, function(data) {
            $("#" + test).remove();
            var button = document.createElement("BUTTON");
            button.onclick = function() {
                remove(this.id);
            };
            var textNode = document.createTextNode("remove");
            button.id = test;
            button.appendChild(textNode);
            DIV.appendChild(button);
        });
    }

    function remove(test) {
        ajaxRequest('GET', apiUrl + "/api/removeRSVP/?user=" + user + "&id=" + test, function(data) {
            $("#" + test).remove();
            var button = document.createElement("BUTTON");
            button.onclick = function() {
                rsvp(this.id);
            };
            var textNode = document.createTextNode("attend");
            button.id = test;
            button.appendChild(textNode);
            DIV.appendChild(button);
        });
    }
    var searchTerm = document.getElementById("searchBar");
    var buttonToSubmit = document.getElementById("findStores");
    $('#findStores').submit(function(e) {
        e.preventDefault();
    
        var searchText = searchTerm.value;
        var users = [];
        var counter = 0;
        ajaxRequest('GET', apiUrl + "api/yelp/?location=" + searchText, function(data) {
            data = JSON.parse(data);
            console.log(data);
         /*   app.controller('yelpController', function($scope, service) {
                $scope.dataHasLoaded = false;
                service.loadData().then(function(data) {
                    this.Stores = data;
                    $scope.dataHasLoaded = true
                })
            })  */
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

            function theRest() {
                for (var i = 0; i < 5; i++) {
                    DIV.className = "yelpContainer";
                    document.getElementById("display").appendChild(DIV);
                    var A = document.createElement("A");
                    var img = document.createElement("img");
                    img.src = data[i].image;
                    A.appendChild(img);
                    var h2 = document.createElement("h2");
                    var textNode = document.createTextNode(data[i].name);
                    A.appendChild(textNode);
                    A.href = data[i].url;
                    DIV.appendChild(A);
                    var p = document.createElement("P");
                    // Change this to correspond 
                    var amount = users[i].length;
                    if (amount == undefined) {
                        amount = 0;
                    }
                    var textNode = document.createTextNode(amount + " going");
                    p.appendChild(textNode);
                    DIV.appendChild(p);
                    if (logged) {
                        var button = document.createElement("BUTTON");
                        if (users[i].indexOf(user) == -1) {
                            button.onclick = function() {
                                rsvp(this.id);
                            };
                            var textNode = document.createTextNode("attend");
                        } else {
                            button.onclick = function() {
                                remove(this.id);
                            };
                            var textNode = document.createTextNode("remove");
                        }
                        button.id = data[i].id;
                        button.appendChild(textNode);
                        DIV.appendChild(button);
                    }
                    var p = document.createElement("P");
                    // Change this to correspond 
                    var textNode = document.createTextNode(data[i].rating);
                    p.appendChild(textNode);
                    DIV.appendChild(p);
                    var p = document.createElement("P");
                    // Change this to correspond 
                    var textNode = document.createTextNode(data[i].price);
                    p.appendChild(textNode);
                    DIV.appendChild(p);
                }
            }
        });
    });
})();