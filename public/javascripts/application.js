var initialLocation;
var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
var map;
var infowindow = new google.maps.InfoWindow();
  
function initialize() {
	var myOptions = {
		zoom: 13,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		mapTypeControl: false,
		zoomControl: false,
		streetViewControl: false
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
			initialLocation = newyork;
			
			var image = '/images/marker_blue.png';
			var shadow = '/images/shadow.png';
			var marker = new google.maps.Marker({
			      position: initialLocation, 
			      map: map, 
				  icon: image,
				  shadow: shadow
			  });
			
			map.setCenter(initialLocation);
			infowindow.setPosition(initialLocation);
			infowindow.open(map,marker);
			
		});
	}
	
	google.maps.event.addListener(map, 'dragend', function() {
		center = map.getCenter();
		addMarkersAround(center.lat(), center.lng());
	});
}

function addMarkersAround(lat, lng) {
	$.getJSON("http://search.twitter.com/search.json?callback=?",{
		q: "rails"
	}, function(data) {
		alert(data);
	});
}

$(function() {
	$("#close").click(function() {
		$("#bg_inner").animate({opacity: "0"}, 500, function() {$("#bg_inner").remove();});
		$("#content_c").animate({opacity: "0"}, 500, function() {$("#content_c").remove();});
		return false;
	});
});