/*==========  MAP  ==========*/

var map = L.map("map", {
    center: [52.50112347366314, 13.425636291503906],
    zoom: 16,
    layers: baseLayers
});

// initialize
// var layerStamen = new L.StamenTileLayer("toner");
var layerStamen = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
    id: 'examples.map-i86knfo3'
}).addTo(map);

var layerOsm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var baseLayers = {
    layerStamen,
    layerOsm
};
// define the array I'm going to fill with geojson
var osmFeatureLayer

// group control
L.control.layers(baseLayers).addTo(map);

// geocoder
var osmGeocoder = new L.Control.OSMGeocoder();
map.addControl(osmGeocoder);


/*==========  Button for ALL data  ==========*/

$('.allData').on('click', function() {
    // get the map BBOX
    var getBbox = map.getBounds();
    var bbox = {
        SWlat: getBbox._southWest.lat,
        SWlng: getBbox._southWest.lng,
        NElat: getBbox._northEast.lat,
        NElng: getBbox._northEast.lng
    };

    //Make the ajax request
    $.post('/getData/allData', bbox, function(res) {
        console.log(res);
    });

});

/*==========  Button for key-value data  ==========*/

$('.keyValueData').on('click', function() {

    var bbox = map.getBounds();
    $('#SWlat').val(bbox._southWest.lat);
    $('#SWlng').val(bbox._southWest.lng);
    $('#NElat').val(bbox._northEast.lat);
    $('#NElng').val(bbox._northEast.lng);

    var data = $('#query-osm').serializeArray();

    $.post('/getData/keyValueData', data, function(res) {
        // nice pop-up with data structured in a table
        function jsonToTable(jsonObj) {
            console.log(jsonObj);
            var table = '';
            $.each(jsonObj, function(k, v) {
                var rows = "<tr><td>" + k + "</td><td>" + v + "</td></tr>";
                console.log(rows);
                table += rows;
            });
            return table

        };
        // add pop-up 
        function onEachFeature(feature, layer) {
            if (feature.properties) {
                layer.bindPopup("<table><th><tr></tr><td><b>Key</b></td><td><b>Value</b></td></th>" + jsonToTable(feature.properties.tags) + "</table>");
            }
        };

        // add data to map
        var geojsonFeature = res;
        L.geoJson(geojsonFeature, {
            onEachFeature: onEachFeature,
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, geojsonMarkerOptions);
            },
            // filter : filterFeature
        }).addTo(map);

    });

});