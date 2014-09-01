/*jslint browser: true, sloppy: true */
/*global L: false, SMap: false, JAK: false  */

/** small helper singleton object
 *  displays log output under map
 *
 */
var logger = (function () {
    'use strict';
    var outel = document.getElementById("debug");
    outel.innerHTML = "logger output";
    return {
        log: function (str) {
            outel.innerHTML = str.toString();
        }
    };
}());


var osmLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>"',
    maxNativeZoom: 19,
    maxZoom: 22
});

var PNKLayer = L.tileLayer('http://tiles.prahounakole.cz/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>"',
    maxNativeZoom: 18,
    maxZoom: 22
});

var MTBMapLayer = L.tileLayer('http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>"',
    maxNativeZoom: 18,
    maxZoom: 22
});

var cuzkOrtofotoLayer = L.tileLayer.wms("http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/service.svc/get", {
    layers: 'GR_ORTFOTORGB',
    format: 'image/jpeg',
    attribution: "(c) ČÚZK",
    version: "1.1.1",
    crs: L.CRS.EPSG3857,
    maxZoom: 22
});

var waymarkedTrailsCyclingLayer = L.tileLayer('http://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>"',
    maxNativeZoom: 17,
    maxZoom: 22
});

var waymarkedTrailsHikingLayer = L.tileLayer('http://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>"',
    maxNativeZoom: 17,
    maxZoom: 22
});


var llmap = L.map('llmap', {
    center: [50.0648527, 14.518207],
    zoom: 10,
    layers: [osmLayer]
});

L.control.layers({
    "ČÚZK Ortofoto": cuzkOrtofotoLayer,
    "Openstreetmap": osmLayer,
    "Prahou na kole": PNKLayer,
    "MTB Mapa": MTBMapLayer
}, {
    "Waymarked Trails Cycling": waymarkedTrailsCyclingLayer,
    "Waymarked Trails Hiking": waymarkedTrailsHikingLayer
}, {
    collapsed: true
}).addTo(llmap);

//L.control.scale({
//    imperial: false
//}).addTo(llmap);





/************** mapy.cz *****************/

var stred = SMap.Coords.fromWGS84(14.518207, 50.0648527);
var mapa = new SMap(JAK.gel("mapycz"), stred, 8);


mapa.addDefaultLayer(SMap.DEF_TURIST).enable();
mapa.addDefaultLayer(SMap.DEF_BIKE).enable();
mapa.addDefaultLayer(SMap.DEF_TRAIL).enable();

var markerLayer = new SMap.Layer.Marker();
mapa.addLayer(markerLayer);
markerLayer.enable();

var marker = new SMap.Marker(SMap.Coords.fromWGS84(0, 0), "myMarker", {});
markerLayer.addMarker(marker);

logger.log("All up and running");


/**
 * Move event listener for Lefalet map
 * @param {MouseEvent} e
 * @returns {undefined} nothing
 */
function moveSMmapFromLlmap(e) {
    'use strict';
    var latlon = llmap.getCenter(),
        zoom = llmap.getZoom();
    logger.log(latlon.toString() + zoom.toString());
    mapa.setCenterZoom(SMap.Coords.fromWGS84(latlon.lng, latlon.lat), zoom - 2);
}

llmap.on('move', moveSMmapFromLlmap);
llmap.on('zoomend', moveSMmapFromLlmap);


function copyMousePositionFromLlmap(e) {
    'use strict';
    var latlon = e.latlng;
    logger.log(latlon);

    marker.setCoords(SMap.Coords.fromWGS84(latlon.lng, latlon.lat));



}

llmap.on('mousemove', function (e) {
    'use strict';
    copyMousePositionFromLlmap(e);
});

/**
 * make JOSM remote control link from leaflet LatLng object
 * bounding box is now fixed size
 * @param {LatLng} latlng
 * @returns {string} html string ingluding <a href> tag
 */
function makeJOSMlink(latlng) {
    'use strict';
    var baseUrl = 'http://127.0.0.1:8111/load_and_zoom',
        latOffset = 0.001,
        lngOffset = 0.002,
        left = (latlng.lng - lngOffset).toString(),
        right = (latlng.lng + lngOffset).toString(),
        top = (latlng.lat + latOffset).toString(),
        bottom = (latlng.lat - latOffset).toString(),
        linkUrl = baseUrl + '?left=' + left + '&right=' + right + '&top=' + top + '&bottom=' + bottom;
    return '<a href="' + linkUrl + '" target="blank"> Open in JOSM </a>';
}

function makeGoogleMapslink(latlng) {
    var lat = latlng.lat.toString(),
        lng = latlng.lng.toString(),
        linkUrl = 'http://www.google.com/maps/search/' + lat + ',' + lng;
    return '<a href="' + linkUrl + '" target="blank"> Google maps </a>';
}

function makeSeznamMaplink(latlng) {
    var lat = latlng.lat.toString(),
        lng = latlng.lng.toString(),
        linkUrl = 'http://mapy.cz/cykloturisticka?x=' + lng + '&y=' + lat + '&z=15&l=0&pano=1';
    return '<a href="' + linkUrl + '" target="blank"> Mapy.cz </a>';
}

var contextMenu = {
    contextMenuEl: document.getElementById('contextmenu'),
    addLink: function (htmlString) {
        this.contextMenuEl.innerHTML += htmlString + '<br>';
    },
    empty: function () {
        this.contextMenuEl.innerHTML = " ";
    },
    show: function (left, top, menuitems) {
        var i;
        
        this.empty();
        for (i = 0; i < menuitems.length; i += 1) {
            this.addLink(menuitems[i]);
        }
        this.contextMenuEl.style.visibility = 'visible';
        this.contextMenuEl.style.left = left + 'px';
        this.contextMenuEl.style.top = top + 'px';
    },
    hide: function () {
        this.contextMenuEl.style.visibility = 'hidden';
    }
};

//contextMenuEl = document.getElementById('contextmenu');

llmap.on('contextmenu', function (e) {
    contextMenu.show(e.containerPoint.x, e.containerPoint.y, [makeJOSMlink(e.latlng),
                        makeGoogleMapslink(e.latlng),
                        makeSeznamMaplink(e.latlng)
                    ]);
});

llmap.on('click', function (e) {
    contextMenu.hide();
});

llmap.on('drag', function (e) {
    contextMenu.hide();
});