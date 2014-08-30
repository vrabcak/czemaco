
/** small helper singleton object
 *  displays log output under map
 *
 */
var logger = (function (){
    var outel = document.getElementById("debug");
    outel.innerHTML="logger output";
    return {
        log: function(str){
                outel.innerHTML=str.toString();
            }
    };
})();


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
    attribution: "© ČÚZK",
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
    center: [50.0648527,14.518207],
    zoom: 10,
    layers: [osmLayer]
});

L.control.layers({
    "ČÚZK Ortofoto": cuzkOrtofotoLayer,
    "Openstreetmap": osmLayer,
    "Prahou na kole": PNKLayer,
    "MTB Mapa": MTBMapLayer
},
{
    "Waymarked Trails Cycling": waymarkedTrailsCyclingLayer,
    "Waymarked Trails Hiking": waymarkedTrailsHikingLayer
},
{collapsed:true
}).addTo(llmap);

L.control.scale({
    imperial: false
}).addTo(llmap);





/************** mapy.cz *****************/

var stred = SMap.Coords.fromWGS84(14.518207,50.0648527);
var mapa = new SMap(JAK.gel("mapycz"), stred, 8);


mapa.addDefaultLayer(SMap.DEF_TURIST).enable();
mapa.addDefaultLayer(SMap.DEF_BIKE).enable();
mapa.addDefaultLayer(SMap.DEF_TRAIL).enable();

var markerLayer = new SMap.Layer.Marker();
mapa.addLayer(markerLayer);
markerLayer.enable();

var marker = new SMap.Marker(SMap.Coords.fromWGS84(0,0), "myMarker",{});
markerLayer.addMarker(marker);

logger.log("All up and running");


/**
 * Move event listener for Lefalet map
 * @param {MouseEvent} e
 * @returns {undefined} nothing
 */
function moveSMmapFromLlmap(e){
    var latlon = llmap.getCenter();
    var zoom = llmap.getZoom();
    logger.log(latlon.toString()+zoom.toString());
    mapa.setCenterZoom(SMap.Coords.fromWGS84(latlon.lng,latlon.lat), zoom-2);
}

llmap.on('move',moveSMmapFromLlmap);
llmap.on('zoomend',moveSMmapFromLlmap);


function copyMousePositionFromLlmap(e){
    var latlon = e.latlng;
    logger.log(latlon);
    
    marker.setCoords(SMap.Coords.fromWGS84(latlon.lng,latlon.lat));
    

    
}

llmap.on('mousemove',copyMousePositionFromLlmap);


