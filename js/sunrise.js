"use strict";
/*
Much creds to http://blog.char95.com/demos/daylight-on-google-maps/js/sunriseSunset/SunriseSunsetLayer.js .
*/

//currently looks crappy, sticking with Preston Hunt's version in SunriseSunsetLayer.js for now.

var DayNightLayer = (function() {
    //Privates
    var MINUTES_TO_HOURS = 1/60,
        SECONDS_TO_HOURS = 1/3600,
        HOURS_TO_GRADS = 360/24,
        DEFINITION = 100;

    var DayNightLayer = function(map, api) {
        this.autoUpdate = false;
        this.map = map;
        this.api = api;
        this.dayLight = [];
        this.dayLightInterval = undefined;
        this.eFunction = {
            draw: this.draw.bind(this)
        };
        this.all = [
            new google.maps.LatLng(90, 0),
            new google.maps.LatLng(90, 180),
            new google.maps.LatLng(-90, 180),
            new google.maps.LatLng(-90, 0),
            new google.maps.LatLng(-90, -180),
            new google.maps.LatLng(90, -180)
        ];
        this.calculateLightAreaCoordinates();
    }

    DayNightLayer.prototype = {
        destroy: function() {
            this.update(false);
            if(this.shadow) this.shadow.setMap(null);
            this.shadow = null;
            this.map = null;
            this.dayLight = null;
            this.eFunction = null;
        },
        getMapZoom: function() {
            switch(this.api) {
                case "GOOGLE":
                    return this.map.getZoom();
                    break;
            }
            return 1;
        },
        update: function(active) {
            if(active !== false) {
                var mapZoom = this.getMapZoom(),
                    dt = parseInt(1000 * (0.5 + (10/mapZoom)));

                this.autoUpdate = true;
                this.timeout = setTimeout(this.eFunction.draw, dt);
            }
            else {
                this.autoUpdate = false;
                clearTimeout(this.timeout);
            }
        },
        calculateLightAreaCoordinates: function() {
            var now = new Date(),
                y = now.getFullYear(),
                m = now.getMonth() + 1,
                d = now.getDate(),
                hUtc = now.getUTCHours(),
                mUtc = now.getUTCMinutes(),
                sUtc = now.getUTCSeconds(),
                offset = hUtc + (mUtc * MINUTES_TO_HOURS) + (sUtc * SECONDS_TO_HOURS),
                location = SunCalc.getTimes(now, 0, 0),
                dLat = 0.5,
                lMax = 90,
                lMin = -90;

            //Get North Lat Limit
            while(lMax > -90) {
                var location = SunCalc.getTimes(now, lMax -= dLat, 0);
                if(!(isNaN(location.sunrise.getUTCHours()) || isNaN(location.sunset.getUTCHours())))
                    break;
            }
            //Get South Lat Limit
            while(lMin < 90) {
                var location = SunCalc.getTimes(now, lMin += dLat, 0);
                if(!(isNaN(location.sunrise.getUTCHours()) || isNaN(location.sunset.getUTCHours())))
                    break;
            }
            dLat = (lMax - lMin) / DEFINITION;
            var sunrise = [],
                sunset = [],
                gapN = [],
                gapS = [],
                l = lMin;

            for(var n=0; n<DEFINITION; n++) {
                var location = SunCalc.getTimes(now, l, 0);
                this.dayLight[n] = {
                    l: l, 
                    sunrise: location.sunrise.getUTCHours() * HOURS_TO_GRADS,
                    sunset: location.sunset.getUTCHours() * HOURS_TO_GRADS
                };
                l += dLat;
            }

            var lNorth = SunCalc.getTimes(now, lMax, 0),
                lEquator = SunCalc.getTimes(now, 0, 0),
                lSouth = SunCalc.getTimes(now, lMin, 0),

                dln = lNorth.sunset.getUTCHours() - lNorth.sunrise.getUTCHours(),
                dle = lEquator.sunset.getUTCHours() - lEquator.sunrise.getUTCHours(),
                dls = lSouth.sunset.getUTCHours() - lSouth.sunrise.getUTCHours();

            this.shadowAlone = true;
            if(lNorth.sunrise.getUTCHours() < lEquator.sunrise.getUTCHours() && lEquator.sunrise.getUTCHours() < lSouth.sunrise.getUTCHours())
                this.shadowAlone = false;
                
        },
        draw: function() {
            var now = new Date(),
                hUtc = now.getUTCHours(),
                mUtc = now.getUTCMinutes(),
                sUtc = now.getUTCSeconds(),
                offset = (hUtc + (mUtc * MINUTES_TO_HOURS) + (sUtc * SECONDS_TO_HOURS)) * HOURS_TO_GRADS,
                n = DEFINITION,
                dn = n - 1,
                shadow = [];

            while(n--) {
                shadow[dn - n] = new google.maps.LatLng(this.dayLight[n].l, this.dayLight[n].sunrise - offset);
                shadow[dn + n] = new google.maps.LatLng(this.dayLight[n].l, this.dayLight[n].sunset - offset);
            }

            //Draw sun shadow
            if(this.shadow) {
                var options = {
                    paths: this.shadowAlone ? [shadow] : [this.all, shadow] 
                };
                this.shadow.setOptions(options);
            }
            else {
                this.shadow = new google.maps.Polygon({
                    zIndex: 10,
                    paths: this.shadowAlone ? [shadow] : [this.all, shadow],
                    strokeWeight: 0,
                    fillColor: "#000000",
                    fillOpacity: 0.35,
                    geodesic: true
                });
                this.shadow.setMap(this.map);
                // todo >>> triger movement events in the map !!!!!!!!
                //with (this) google.maps.event.addListener( shadow , 'mousemove' , function(e) { mouseMove(e); });
            }
            this.update(this.autoUpdate);
        }
    }
    return DayNightLayer;
}());
