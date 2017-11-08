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
    var searchTerm = document.getElementById("searchBar");
    var buttonToSubmit = document.getElementById("findStores");
    $('#findStores').submit(function(e) {
        e.preventDefault();
        var searchText = searchTerm.value;
        ajaxRequest('GET', apiUrl + "api/yelp/?location=" + searchText, function(data) {
            data = JSON.parse(data);
            for (var i = 0; i < 5; i++) {
              // If the user is not loggged in, disable the buttons for who is coming. 
                document.getElementById("display").innerHTML += "<div id = ' " + data[i].id + "'> <a href='" + data[i].url + "'><img src='" + data[i].image + "'></img><h2> " + data[i].name + " </h2> </a> <p> 0 going </p> <button> ATTEND </button> <p> " + data[i].rating + " </p> <p> " + data[i].price + " </div>";
            }
        });
    });
})();