// test url to query
// http://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(node(52.49785778504401,13.410422801971436,52.50438891971523,13.440849781036375);way(52.49785778504401,13.410422801971436,52.50438891971523,13.440849781036375);relation(52.49785778504401,13.410422801971436,52.50438891971523,13.440849781036375););out body;>;out skel qt meta;


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

var data = require('../test_data/test_data.json');
var data2 = require('../test_data/test_data2.json');

router.get('/', function(req, res) {
    console.log('*******Sending data back*******');
    res.send(data2);
})

module.exports = router;