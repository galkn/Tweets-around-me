var tweet_coordinates = [];

function initialize() {
	var myOptions = {
		zoom: 10,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		mapTypeControl: false,
		zoomControl: false,
		streetViewControl: false
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			initialLocation = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
			map.setCenter(initialLocation);
	/*		
			var populationOptions = {
			      strokeColor: "#FF0000",
			      strokeOpacity: 0.8,
			      strokeWeight: 2,
			      fillColor: "#FF0000",
			      fillOpacity: 0.35,
			      map: map,
			      center: initialLocation,
			      radius: 1000 * 5
			    };
			    cityCircle = new google.maps.Circle(populationOptions);
			*/
		});
	}
	
	google.maps.event.addListener(map, 'dragend', function() {
		center = map.getCenter();
		addMarkersAround(center.lat(), center.lng(), map);
	});
}

function coordinates_are_in_array(latitude, longitude, array) {
	for(i in array) {
		var coordinates = array[i];
		if((coordinates['latitude'] == latitude) && (coordinates['longitude'] == longitude)) {
			return true;
		}
	}
	return false;
}

function addMarkersAround(latitude, longitude, map) {
	$.getJSON("http://search.twitter.com/search.json?callback=?",{
		q: $("#saved_term").text(),
		geocode: latitude +","+ longitude +","+ 20 +"km",
		result_type: "recent",
		page: 1,
		rpp: 100
	}, function(data) {
		$(data["results"]).each(function() {		
			var geocoder = new google.maps.Geocoder();

			geocoder.geocode({
				address: $(this)[0]["location"]
	        }, function(result) {
				if(result && (result.length > 0)) {
	            	var lat = result[0].geometry.location.lat();
		            var lng = result[0].geometry.location.lng();
				
					if(!coordinates_are_in_array(lat, lng, tweet_coordinates)) {
						var new_coordinates = new Array();
						new_coordinates['latitude'] = lat;
						new_coordinates['longitude'] = lng;
						tweet_coordinates.push(new_coordinates);
						
						var image = '/images/marker_blue.png';
						var shadow = '/images/marker_shadow.png';
						var marker = new google.maps.Marker({
							position: new google.maps.LatLng(lat, lng),
							map: map, 
							icon: image,
							shadow: shadow
						});
					}
				}
	        });
		});
	});
}

function fade_out_content() {
	$("#bg_inner").animate({opacity: "0"}, 500, function() {$("#bg_inner").remove();});
	$("#content_c").animate({opacity: "0"}, 500, function() {$("#content_c").remove();});
}

$(function() {
	$("#close").click(function() {
		fade_out_content();
		return false;
	});
	
	$("#find_button").click(function() {
		$("#saved_term").html($("#term_field").val());
		fade_out_content();
		return false;
	});
});