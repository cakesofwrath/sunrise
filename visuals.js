var mouse = {x: 0, y: 0};
var myWidth = 0, myHeight = 0;
var mouseIsDown = false;
var mouseIsDownDivision = false;


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
    map.setZoom(9);
    map.panTo(new google.maps.LatLng(lat, lon));
    var riseTime = SunCalc.getTimes(new Date(), lat, lon);
    $("#riseTime").html(formatTime(riseTime.sunrise));
    $("#riseTime").fadeIn(3000);
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
      zoom: 2,
      draggableCursor:null //check later
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}


var sun = $("#sun"),
    sunDay = $("#sunDay"),
    sunSet = $("#sunSet"),
    waterReflectionContainer = $("#waterReflectionContainer"),
    waterReflectionMiddle = $("#waterReflectionMiddle"),
    water = $("#water"),
    waterHeight = water.height(),
    sunHeight = sun.height(),
    darknessOverlay = $("#darknessOverlay"),
    darknessOverlaySky = $("#darknessOverlaySky"),
    moon = $("#moon"),
    horizon = $("#horizon"),
    horizonNight = $("#horizonNight"),
    starsContainer = $("#starsContainer"),
    waterDistance = $("#waterDistance"),
    sky = $("#sky"),
    clouds = $(".cloud"),
    stars = $(".star"),
    division = $("#division"),
    oceanRippleContainer = $("#oceanRippleContainer")
    ;

function move(x, y) {
  //console.log("Moving to ", x, y)
  updateDimensions(); //update to jquery later

  var backgStem = '-radial-gradient(' + x + 'px ' + y + 'px, circle, rgba(';
  sun.css('background', '-webkit' + backgStem + '242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)');
  sun.css('background', '-moz' + backgStem + '242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)');
  sun.css('background', '-ms' + backgStem + '242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)');

  sunDay.css('backgorund', '-webkit' + backgStem + '252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)');
  sunDay.css('background', '-moz' + backgStem + '252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)');
  sunDay.css('background', '-ms' + backgStem + '252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)');

  sunSet.css('background', '-webkit' + backgStem + '254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)');
  sunSet.css('background', '-moz' + backgStem + '254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)');
  sunSet.css('background', '-ms' + backgStem + '254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)');

  waterReflectionContainer.css('perspective-origin', (x/myWidth*100).toString() + '& -15%');
  waterReflectionMiddle.css('left', (x-myWidth-(myWidth*.03)).toString() + "px");

  var bodyWidth = $('body').width();

  sun.css('width', bodyWidth);
  sun.css('left', '0px');
  sunDay.css('width', bodyWidth);
  sunDay.css('left', '0px');

  var skyHeight = sky.height();
  var skyRatio = y / skyHeight;
  var waterRation = y / myHeight;

  darknessOverlay.css('opacity', Math.min((y-(myHeight/2)) / (myHeight/2), 1));
  darknessOverlaySky.css('opacity', Math.min((y-(myHeight*7/10)) / (myHeight-(myHeight*9/10)), 0.65));
  moon.css('opacity', Math.min((y-(myHeight*9/10)) / (myHeight-(myHeight*9/10)), 0.65));
  horizonNight.css('opacity', ((y-(myHeight*4/5)) / (myHeight-(myHeight*4/5))));

  starsContainer.css('opacity', (y/myHeight-0.6));

  waterDistance.css('opacity', (y/myHeight+0.6));
  sunDay.css('opacity', (1-y/myHeight));
  sky.css('opacity', Math.min((1-y/myHeight), 0.99));

  sunSet.css('opacity', (y/myHeight-0.2));

  if(y > 0) {
    // for(var i in clouds) {
    //   console.log(clouds)
    //   clouds[i].css('left', Math.min(myWidth*(Math.pow(y,2)/Math.pow(myHeight/2,2)) * -1, 0));
    // }
  }
  // for(var i in stars) {
  //   stars[i].css('opacity') = (y/myHeight-0.6);
  // }
  if(y > myHeight / 2) {
    sun.css('opacity', Math.min((myHeight - y) / (myHeight/2) + 0.2, 0.5));
      horizonNight.css('opacity', (myHeight-y) / (myHeight/2) + .2);
      waterReflectionMiddle.css('opacity', (myHeight-y) / (myHeight/2) - 0.1);
  }
  else {
    horizon.css('opacity', Math.min(y / (myHeight/2), 0.99));
    sun.css('opacity', Math.min(y / (myHeight/2), 0.5));
    waterReflectionMiddle.css('opacity', y / (myHeight/2) - 0.1);
  }
}

function pause(ms) {
  ms += new Date().getTime();
  while(new Date() < ms){}
}



/*
Go from bottom to about half.
*/
$(document).ready(function() { //390 to 260
  $("#title").fadeIn(2000);
  startY = $(window).height()/2;
  //startY = $(window).height()-30;
  console.log(startY)
  startX = $(window).width()/2;
  endY = 280;
  //endY = Math.round(startY/2);
  console.log(endY)
  /*var sunRiseID = setInterval(function() {
    if(startY > endY) {
      startY -= 1;
      move(startX, startY);
    }
    else {
      clearInterval(sunRiseID);
    }
  }, 300);*/
  // move(startX, startY)
  // move(startX, startY-10);
  // move(startX, startY-20);
  // move(startX, startY-30);
  // move(startX, startY-40);
  // move(startX, startY-100);
  // move(startX, startY-200);
  // move(startX, startY-300);
  //setTimeout(function(){move(startX, startY); }, 500);
  //move(startX, startY)
  move(startX, startY);
  getLocation();
    
  google.maps.event.addDomListener(window, 'load', initialize);
  //pause(5000)
  /*for(var y=startY; y>endY; y-=15) {
    move(startX, y);
    console.log(y, endY);
    pause(y)
  }*/
});

document.addEventListener('mousemove', function(e){ 
    mouse.x = e.clientX || e.pageX; 
    mouse.y = e.clientY || e.pageY 
      updateDimensions();
      //console.log(mouse.x, mouse.y)
    if(mouseIsDown) {
       document.getElementById("sun").style.background = '-webkit-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';
      document.getElementById("sun").style.background = '-moz-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';
      document.getElementById("sun").style.background = '-ms-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(242,248,247,1) 0%,rgba(249,249,28,1) 3%,rgba(247,214,46,1) 8%, rgba(248,200,95,1) 12%,rgba(201,165,132,1) 30%,rgba(115,130,133,1) 51%,rgba(46,97,122,1) 85%,rgba(24,75,106,1) 100%)';

      document.getElementById("sunDay").style.background = '-webkit-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';
      document.getElementById("sunDay").style.background = '-moz-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';
      document.getElementById("sunDay").style.background = '-ms-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(252,255,251,0.9) 0%,rgba(253,250,219,0.4) 30%,rgba(226,219,197,0.01) 70%, rgba(226,219,197,0.0) 70%,rgba(201,165,132,0) 100%)';

      document.getElementById("sunSet").style.background = '-webkit-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';
      document.getElementById("sunSet").style.background = '-moz-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';
      document.getElementById("sunSet").style.background = '-ms-radial-gradient(' + mouse.x + 'px ' + mouse.y + 'px, circle, rgba(254,255,255,0.8) 5%,rgba(236,255,0,1) 10%,rgba(253,50,41,1) 25%, rgba(243,0,0,1) 40%,rgba(93,0,0,1) 100%)';

      document.getElementById("waterReflectionContainer").style.perspectiveOrigin = (mouse.x/myWidth*100).toString() + "% -15%";
      document.getElementById("waterReflectionMiddle").style.left = (mouse.x-myWidth-(myWidth*.03)).toString() + "px";

      var bodyWidth = document.getElementsByTagName("body")[0].clientWidth;

      document.getElementById("sun").style.width = (bodyWidth);
      document.getElementById("sun").style.left = "0px";
      document.getElementById("sunDay").style.width = (bodyWidth);
      document.getElementById("sunDay").style.left = "0px";
      
      var sky = document.getElementById("sun");
      var water = document.getElementById("water");
      var waterHeight = water.clientHeight;
      var skyHeight = sky.clientHeight;
      var skyRatio = mouse.y / skyHeight;
      var waterRatio = waterHeight / myHeight;
      document.getElementById("darknessOverlay").style.opacity = Math.min((mouse.y-(myHeight/2)) / (myHeight/2), 1);
      document.getElementById("darknessOverlaySky").style.opacity = Math.min((mouse.y-(myHeight*7/10)) / (myHeight-(myHeight*7/10)), 1);
      document.getElementById("moon").style.opacity = Math.min((mouse.y-(myHeight*9/10)) / (myHeight-(myHeight*9/10)), 0.65);
      document.getElementById("horizonNight").style.opacity = (mouse.y-(myHeight*4/5)) / (myHeight-(myHeight*4/5));

      document.getElementById("starsContainer").style.opacity = (mouse.y/myHeight-0.6);

      document.getElementById("waterDistance").style.opacity = (mouse.y/myHeight+0.6);
      document.getElementById("sunDay").style.opacity = (1-mouse.y/myHeight);
      document.getElementById("sky").style.opacity = Math.min((1-mouse.y/myHeight), 0.99);

      document.getElementById("sunSet").style.opacity = (mouse.y/myHeight-0.2);



      if(mouse.y > 0) {
        var clouds = document.getElementsByClassName("cloud");
        for(var i=0; i<clouds.length; i++) {
          clouds[i].style.left = Math.min(myWidth*(Math.pow(mouse.y,2)/Math.pow(myHeight/2,2)) * -1, 0);
        }
      }

      var stars = document.getElementsByClassName('star');
      for(var i=0; i<stars.length; i++) {
        stars[i].style.opacity = (mouse.y/myHeight-0.6);
      }


      if(mouse.y > myHeight/2) {
        document.getElementById("sun").style.opacity = Math.min((myHeight-mouse.y) / (myHeight/2) + 0.2, 0.5);
        document.getElementById("horizon").style.opacity = (myHeight-mouse.y) / (myHeight/2) + 0.2;

        document.getElementById("waterReflectionMiddle").style.opacity = (myHeight-mouse.y) / (myHeight/2) - 0.1;
      } else {
        document.getElementById("horizon").style.opacity = Math.min(mouse.y / (myHeight/2), 0.99);

        document.getElementById("sun").style.opacity = Math.min(mouse.y / (myHeight/2), 0.5);
        document.getElementById("waterReflectionMiddle").style.opacity = mouse.y / (myHeight/2) - 0.1; 
      }

    } else if (mouseIsDownDivision) {
      var sunElement = document.getElementById("sun");
      var water = document.getElementById("water");
      var division = document.getElementById("division");
      sunElement.style.height = (mouse.y).toString() + "px";
      document.getElementById("sunDay").style.height = (mouse.y).toString() + "px";
      division.style.top = (mouse.y).toString() + "px";
      var waterHeight = myHeight-mouse.y;
      water.style.height = waterHeight.toString() + "px";

      document.getElementById("sun").style.height = (mouse.y).toString() + "px";
      document.getElementById("sunDay").style.height = (mouse.y).toString() + "px";
      document.getElementById("horizon").style.height = (mouse.y).toString() + "px";
      document.getElementById("waterDistance").style.height = (myHeight-mouse.y).toString() + "px";
      document.getElementById("oceanRippleContainer").style.height = (myHeight-mouse.y).toString() + "px";
      document.getElementById("darknessOverlay").style.height = (myHeight-mouse.y).toString() + "px";
    }


}, false);

function updateDimensions() {
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {

    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {

    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  
}

function startMove() {
  mouseIsDown = true;
}

function stopMove() {
  mouseIsDown = false;
  mouseIsDownDivision = false;
        var sky = document.getElementById("sun");
}

function startDraggingDivision() {

  mouseIsDownDivision = true;
}

function windowResize() {
  updateDimensions();
  var skyHeight = document.getElementById("horizon").clientHeight;

  


  // update to new sky height
  skyHeight = document.getElementById("sun").clientHeight;
  document.getElementById("waterDistance").style.height = myHeight - skyHeight;
   document.getElementById("division").style.top = skyHeight;
}