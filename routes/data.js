var http = require("http");
var request = require('request');
var express = require('express');
var router = express.Router();
var path = require('path');
var osmtogeojson = require('osmtogeojson');
var jsonlint = require("jsonlint");
var fs = require('fs');
var _ = require('underscore-node');
var ProgressBar = require('progressbar').ProgressBar;
var bodyParser = require('body-parser');

/*======================================================
=            Intial Vars & Helper Functions            =
======================================================*/

/* Variables */
// API endpoint
var endpoint = 'http://overpass-api.de/api/interpreter?data=';
// helper to parser the req body
var jsonParser = bodyParser.json()

/* Functions to restructure the client post data request bbox */

// take the response obj properties from the client
// and concatenates them into a string
// so to have a unique bbox coord string
function createCoords(a) {
    // use _ to slice the first values of the response objects AKA the coords
    var cc = _.first(_.values(a), 4)
        // store the coord in an empty array
    var arr = []
    for (var key in cc) {
        arr.push(cc[key]);
    }
    // concatenate the coords
    var coords = arr.join(',');
    return coords
};


// take response obj properties and concatenates them into a string
function createCoordsFromObj(a) {
    var arr = []
    for (var key in a) {
        arr.push(a[key]);
    }
    var coords = arr.join(',');
    return coords
};


/*-----  End of Intial Vars & Helper Functions  ------*/



/*=========================================
=            GET/POST Requests            =
=========================================*/

/*==========  hanlde the post request to fetch all data within bbox  ==========*/

router.post('/allData', function(req, res) {

    /*COMPOSE THE API QUERY*/
    // get the bbox from the client
    var coords = req.body;
    var bbox = createCoordsFromObj(coords);
    // compose the api request
    var url = '[out:json][timeout:25];(node(' + bbox + ');way(' + bbox + ');relation(' + bbox + '););out body;>;out skel qt;';
    var queryTotal = endpoint + url;

    /*FETCH SOME DATA*/
    // api get request
    var req = http.request(queryTotal);
    req.on('response', function(response) {
        var str = '';
        response.on('data', function(chunk) {
            console.log('Receiving something... ');
            str += chunk;
        });
        response.on('end', function() {
            var parsed = JSON.parse(str);
            var osmData = osmtogeojson(parsed);
            // ship it back to the client
            // BE AWARE that this res is the router.post response, not the http.request module response
            res.send(osmData);
            console.log('Shipped ALL data back to the client, boss! ');
        });
    });
    req.end();
});


/*==========  hanlde the post request to fetch key-value data  ==========*/

router.post('/keyValueData', jsonParser, function(req, res) {

    // get the bbox from the client    
    var bbox = req.body;
    console.log(bbox);
    /* query */
    // key-value pairings
    var keyValue = bbox.key + '=' + bbox.value;

    // Your query in compact Overpass QL:
    // http://overpass-api.de/query_form.html
    // converts OVPTurbo queries in compact URL-like format    
    // es: '[out:json][timeout:25];(node["amenity"="drinking_water"](50.7,7.1,50.8,7.2););out body;>;out skel qt;'
    var queryOVP = '[out:json][timeout:25];(node[' + keyValue + '](' + createCoords(bbox) + ');way[' + keyValue + '](' + createCoords(bbox) + ');relation[' + keyValue + '](' + createCoords(bbox) + '););out body;>;out skel qt;'
        // [out:json][timeout:25];(node["amenity"]();way["amenity"]();relation["amenity"](););out body;>;out skel qt;
        // API url to be called
    var queryTotal = endpoint + queryOVP

    /*OSM GET REQUEST*/
    // OSM API GET request callback
    callback = function(response) {
        var str = '';
        //another chunk of data has been recieved, so append it to `str`
        // Continuously update stream with data
        response.on('data', function(chunk) {
            console.log('Receiving something... ');
            str += chunk;
        });

        //the whole response has been recieved
        response.on('end', function() {
            // parse response
            var parsed = JSON.parse(str);
            // then convert it to geojson
            var osmData = osmtogeojson(parsed);
            // ship it back to the client
            res.send(osmData);
            console.log('Shipped Key-Value data back to the client, boss! ');
        });
    }

    // launch the request
    http.request(queryTotal, callback).end();

});

/*-----  End of GET/POST Requests  ------*/
module.exports = router;