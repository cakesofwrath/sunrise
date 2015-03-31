var lat=0, lon=0;
var map;

function formatTime(d) {
    var hr = d.getHours();
    var min = d.getMinutes();
    if(min<10) min = "0" + min;
    return hr + ":" + min;
}

var getCoords = function(pos) {
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    console.log(lat, lon);
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lon),
      title: "You!",
      map: map
    });
    //map.setZoom(9);
    map.panTo(new google.maps.LatLng(lat, lon));
    var riseTime = SunCalc.getTimes(new Date(), lat, lon);
    // var now = new Date();
    //var riseTime = new SunriseSunset(now.getFullYear(), now.getMonth(), now.getDate(), lat, lon);
    //$("#riseTime").html(riseTime.sunriseLocalHours(now.getTimezoneOffset()));
    $("#riseTime").html(formatTime(riseTime.sunrise));
    $("#riseTime").fadeIn(3000);
    var dnLayer = new SunriseSunsetLayer(map, "GOOGLE");
    //var dnLayer = new DayNightLayer(map, "GOOGLE");
    dnLayer.autoUpdate = true;
    dnLayer.draw();
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
      center: { lat: lat, lng: lon},
      zoom: 2.1,
      draggableCursor:null, //check later,
      mapTypeId: google.maps.MapTypeId.TERRAIN
      //mapTypeId: google.maps.MapTypeId.HYBRID //won't load properly rn
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

$(document).ready(function() {
    getLocation();
    google.maps.event.addDomListener(window, 'load', initialize);

});


