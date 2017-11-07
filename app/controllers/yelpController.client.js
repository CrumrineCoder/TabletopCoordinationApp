'use strict';




(function () {
  function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   }

   function ajaxRequest (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }
  
  
  console.log("hi");
 var apiUrl = 'https://tabletop.glitch.me/';
  var searchTerm = document.getElementById("searchBar");
     var buttonToSubmit = document.getElementById("findStores");
     $('#findStores').submit(function(e) {
       console.log("help");
       e.preventDefault();
         var searchText = searchTerm.value;
       console.log(searchText);
       // Make a request to the backend to get the data
       
       
       
        ajaxRequest('GET', apiUrl + "api/yelp/?location=" + searchText , function(data) {
                 console.log(data);
     }); 
     });
  


})();
