'use strict';

(function () {
 var apiUrl = 'https://tabletop.glitch.me/';
  var searchTerm = document.getElementById("findPolls");
     var buttonToSubmit = document.getElementsByClassName("buttonToSubmit")[0];
     buttonToSubmit.addEventListener('click', function(e) {
       console.log("help");
       e.preventDefault();
         var searchText = searchTerm.value;
       console.log(searchText);
    /*     ajaxRequest('GET', apiUrl + "api/yelp/location=" + searchText , function(data) {
                 console.log(data);
     }); */
     });
  
  //Add event listener to submit bar that collect the information from it 
  //Send info to the handler server, and then get the data back
  // Change the HTML based on it, but first console it
  
   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var clickNbr = document.querySelector('#click-nbr');


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

   function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }

   ready(ajaxRequest('GET', apiUrl, updateClickCount));

   addButton.addEventListener('click', function () {

      ajaxRequest('POST', apiUrl, function () {
         ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

   deleteButton.addEventListener('click', function () {

      ajaxRequest('DELETE', apiUrl, function () {
         ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);

})();
