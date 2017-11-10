'use strict';
(function() {
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
       ajaxRequest('GET', apiUrl + "/api/addRSVP/?user=" + user + "&id="+test, function(data) {
         console.log("Yes");
       });
    }
    var searchTerm = document.getElementById("searchBar");
    var buttonToSubmit = document.getElementById("findStores");
    $('#findStores').submit(function(e) {
        e.preventDefault();
        var searchText = searchTerm.value;
        ajaxRequest('GET', apiUrl + "api/yelp/?location=" + searchText, function(data) {
            data = JSON.parse(data);
            for (var i = 0; i < 5; i++) {
                // If the user is not loggged in, disable the buttons for who is coming. 
                // Come back with  Angular and make this look better
                var DIV = document.createElement("DIV");
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
                var textNode = document.createTextNode("0 going");
                p.appendChild(textNode);
                DIV.appendChild(p);
                if (logged) {
                    var button = document.createElement("BUTTON");
                    button.onclick = function(){
                      rsvp(this.id);
                    };
                    button.id = data[i].id; 
                    var textNode = document.createTextNode("attend");
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
        });
    });
})();