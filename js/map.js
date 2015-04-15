var lat=0, lon=0;
var map, igPhotos = [];

google.maps.InfoWindowZ=function(opts){ //http://jsfiddle.net/doktormolle/uuLBb/
  var GM = google.maps,
      GE = GM.event,
      iw = new GM.InfoWindow(),
      ce;
      
     if(!GM.InfoWindowZZ){
        GM.InfoWindowZZ=Number(GM.Marker.MAX_ZINDEX);
     }
     
     GE.addListener(iw,'content_changed',function(){
       if(typeof this.getContent()=='string'){
          var n=document.createElement('div');
              n.innerHTML=this.getContent();
              this.setContent(n);
              return;
       }
       GE.addListener(this,'domready',
                       function(){
                        var _this=this;
                        _this.setZIndex(++GM.InfoWindowZZ);
                        if(ce){
                          GM.event.removeListener(ce);
                        }
                        ce=GE.addDomListener(this.getContent().parentNode
                                          .parentNode,'mouseover',
                                          function(){
                                          _this.setZIndex(++GM.InfoWindowZZ);
                        });
                      })
     });
     
     if(opts)iw.setOptions(opts);
     return iw;
}

var formatTime = function(d) {
    var hr = d.getHours();
    var min = d.getMinutes();
    if(min<10) min = "0" + min;
    return hr + ":" + min;
};

var formatSeconds = function(secsAgo) {
    if(secsAgo < 60) { // there shouldn't be any negative values...
        return "just now";
    }
    else if(secsAgo < 3600) {
        return Math.round(secsAgo / 60).toString() + " minutes ago";
    }
    else if(secsAgo < 86400) {
        return Math.round(secsAgo / 3600).toString() + " hours ago";
    }
    else {
        return Math.round(secsAgo / 86400).toString() + " days ago";
    }
};

var getCoords = function(pos) {
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
    /*console.log(lat, lon);
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lon),
      title: "You!",
      map: map
    });*/
    //map.setZoom(9);
    map.panTo(new google.maps.LatLng(lat, lon));
    var riseTime = SunCalc.getTimes(new Date(), lat, lon);
    // var now = new Date();
    //var riseTime = new SunriseSunset(now.getFullYear(), now.getMonth(), now.getDate(), lat, lon);
    //$("#riseTime").html(riseTime.sunriseLocalHours(now.getTimezoneOffset()));
    $("#riseTime").html(formatTime(riseTime.sunrise));
    $("#riseTime").fadeIn(3000);
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,  //don't feel like hiding my API key.
        url: "https://api.instagram.com/v1/tags/sunrise/media/recent?access_token=1814447702.9b5d9ac.c0709b244c6e498ba25af3f7bc5e72b2",
        success: function(data) {
            
            var pics = data.data.sort(function(a, b){
                return b.likes.count - a.likes.count;
            }).map(function(picObj) {
                return {
                    timePosted: picObj.createdTime ? formatSeconds((new Date).getTime() - parseInt(picObj.createdTime)) : "unavailable",
                    link: picObj.link || "https://instagram.com", 
                    img: picObj.images.low_resolution,
                    location:  picObj.location,
                    caption: picObj.caption.text || ""
                };
            });

            for(var pic in pics) {
                if(pics[pic].location) {
                    var photoMarker = new google.maps.Marker({
                        //icon: "dot.png", //showing up huge
                        position: new google.maps.LatLng(pics[pic].location.latitude, pics[pic].location.longitude)
                    });
                    var photoWindow = new google.maps.InfoWindowZ({
                        content: "<a class='ig' target='_blank' href='" + pics[pic].link + "'><img class='ig' src='" + pics[pic].img.url + "'></img></a>"
                    });
                    photoMarker.setMap(map);
                    photoWindow.open(map, photoMarker);
                    //setTimeout(photoWindow.open(map, photoMarker), 3000); //not working (setTimeout still screws with me)
                }
            }
        }
    });
} 

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCoords);
        return true;
    }
    else {
        return false;
    }
}

function initialize() {
    var mapOptions = {
      center: { lat: lat, lng: lon},
      zoom: 3,
      draggableCursor:null, //check later,
      disableDefaultUI: true,
      //mapTypeId: google.maps.MapTypeId.TERRAIN
      mapTypeId: google.maps.MapTypeId.SATELLITE //won't load properly rn
    };
    google.maps.visualRefresh = false;
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    //http://blog.char95.com/demos/daylight-on-google-maps/
    var dnLayer = new SunriseSunsetLayer(map, "GOOGLE");
    dnLayer.autoUpdate = true;
    dnLayer.draw();
}

$(document).ready(function() {
    getLocation();
    google.maps.event.addDomListener(window, 'load', initialize);
    
});


