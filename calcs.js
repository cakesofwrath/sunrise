
var lat=0, lon=0;

var getCoords = function(pos) {
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    console.log(lat, lon);
} 

function getLocation() {
    if(navigator.geolocation) {
        console.log("Location")
        navigator.geolocation.getCurrentPosition(getCoords);
        return true;
    }
    else {
        console.log("No location")
        return false;
    }
}

function initialize() {
    var mapOptions = {
      center: { lat: 0, lng: 0},
      zoom: 2,
      draggableCursor:null //check later
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

$(document).ready(function() {
    getLocation();
    
    google.maps.event.addDomListener(window, 'load', initialize);
    
});