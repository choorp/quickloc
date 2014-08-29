console.log("QuickLoc launched.");

// Let's get all the divs we need
var divPitch = document.getElementById("pitch");
var divHeading = document.getElementById("heading");
var divHeadingDeg = document.getElementById("heading-deg");
var divLat = document.getElementById("lat");
var divLong = document.getElementById("long");
var divAccuracy = document.getElementById("accuracy");
var divSpeed = document.getElementById("speed");
var divAltitude = document.getElementById("altitude");

// Watchers
var locWatch;

// Ready the map!
var mapOptions = {
	disableDefaultUI: true,
	zoom: 8,
	center: new google.maps.LatLng(39.95, -75.166667),
	mapTypeId: google.maps.MapTypeId.HYBRID
};
var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
var marker;

function startWatchingLocation() {
	locWatch = navigator.geolocation.watchPosition(function(pos) {
		// console.log(pos.coords);
		divLat.textContent = pos.coords.latitude.toFixed(6);
		divLong.textContent = pos.coords.longitude.toFixed(6);
		divAccuracy.textContent = pos.coords.accuracy.toFixed(1);
		divSpeed.textContent = pos.coords.speed;
		divAltitude.textContent = pos.coords.altitude;

		// Sample values for demo purposes. Let's use Philly!
		// var demoLat = 39.95;
		// var demoLong = -75.166667;
		// map.setCenter(new google.maps.LatLng(demoLat, demoLong));

		map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
		// map.setZoom(15);
		if (!marker) {
			marker = new google.maps.Marker({
				position: map.getCenter(),
				map: map
			});
		} else {
			marker.position = map.getCenter();
			marker.map = map;
		}
	});
}

function handleOrientation(e) {
	var h = parseInt(e.alpha);
	var p = parseInt(e.beta);
	var r = parseInt(e.gamma);
	var d;

	// We need to convert degrees to the proper letter(s)
	if (h <= 22 || h >= 338) {
		d = "N";
	} else if (h <= 67) {
		d = "NW";
	} else if (h <= 112) {
		d = "W";
	} else if (h <= 157) {
		d = "SW";
	} else if (h <= 202) {
		d = "S";
	} else if (h <= 247) {
		d = "SE";
	} else if (h <= 292) {
		d = "E";
	} else if (h <= 337) {
		d = "NE";
	} else {
		d = "??";
	}

	divHeadingDeg.textContent = h;
	divHeading.textContent = d;
	divPitch.textContent = p + "/" + r;
}

// Begin watching app visibility so we can stop polling location and orientation while app is hidden
// TODO: Make background tracking a setting
document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
    	// console.log("App hidden.");
        navigator.geolocation.clearWatch(locWatch);
        window.removeEventListener("deviceorientation", handleOrientation, false);
    }
    else {
        // console.log("App shown.");
        startWatchingLocation();
        window.addEventListener("deviceorientation", handleOrientation, false);
    }
});

// Begin watching device orientation
window.addEventListener("deviceorientation", handleOrientation, false);

// Begin polling device location
startWatchingLocation();