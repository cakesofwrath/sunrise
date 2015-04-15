var mouse = {x: 0, y: 0};
var myWidth = 0, myHeight = 0;
var mouseIsDown = false;
var mouseIsDownDivision = false;

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

$(document).ready(function() {
    $("#title").fadeIn(2000);
    startY = $(window).height()/2;
    startX = $(window).width()/2;
    endY = 280; //change later.
    move(startX, startY);
});

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
