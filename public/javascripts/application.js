var tweet_coordinates = [];
var map;
var infoWindow = new google.maps.InfoWindow({
	maxWidth: 350
});

function initialize() {
	var myOptions = {
		zoom: 11,
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
			// NYC:
			// initialLocation = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
			map.setCenter(initialLocation);			
		});
	}
	
	google.maps.event.addListener(map, 'dragend', function() {
		load_tweets();
	});
}

function replace_url_with_html_link(text) {
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(exp,"<a href='$1'>$1</a>"); 
}

function load_tweets() {
	center = map.getCenter();
	add_marker_on(center.lat(), center.lng());
}

function load_info_windows() {
	for(i in tweet_coordinates) {
		marker_info_window(tweet_coordinates[i]['marker'], tweet_coordinates[i]['tweets']);
	}
}

function index_of_coordinates_in_array(latitude, longitude, array) {
	for(i in array) {
		var coordinates = array[i];
		if((coordinates['latitude'] == latitude) && (coordinates['longitude'] == longitude)) {
			return i;
		}
	}
	return -1;
}

function add_marker_on(latitude, longitude) {
	$.getJSON("http://search.twitter.com/search.json?callback=?",{
		q: $("#saved_term").text(),
		geocode: latitude +","+ longitude +","+ 40 +"km",
		result_type: "recent",
		page: 1,
		rpp: 100
	}, function(data) {
		$(data["results"]).each(function() {		
			var geocoder = new google.maps.Geocoder();
			
			var tweet = $(this)[0];

			geocoder.geocode({
				address: $(this)[0]["location"]
	        }, function(result) {
				if(result && (result.length > 0)) {
	            	var lat = result[0].geometry.location.lat();
		            var lng = result[0].geometry.location.lng();
				
					var index_in_array = index_of_coordinates_in_array(lat, lng, tweet_coordinates);
					if(index_in_array == -1) {
						var new_coordinates = new Array();
						new_coordinates['latitude'] = lat;
						new_coordinates['longitude'] = lng;
						new_coordinates['tweets'] = [tweet];
						
						var image = '/images/marker_blue.png';
						var shadow = '/images/marker_shade.png';
						var marker = new google.maps.Marker({
							position: new google.maps.LatLng(lat, lng),
							map: map, 
							icon: image,
							shadow: shadow
						});
						new_coordinates['marker'] = marker;
						
						tweet_coordinates.push(new_coordinates);
					} else {
						// Coordinates already exist in the array,
						// Push tweet into it only if the tweet doens't already exist
						push_tweet_in(index_in_array, tweet);
					}
				}
				
				load_info_windows();
	        });
		});
	});
}

function push_tweet_in(index_in_array, tweet) {
	// Push tweet only if the tweet doens't already exist
	for(i in tweet_coordinates[index_in_array]['tweets']) {
		if(i<10 && tweet_coordinates[index_in_array]['tweets'][i]["id"] == tweet["id"]) {
			return false;
		}
	}
	tweet_coordinates[index_in_array]['tweets'].push(tweet);
	return true;
}

function marker_info_window(marker, tweets) {
	google.maps.event.addListener(marker, 'click', function() {
		var infoWindowContent = '';
		for(i in tweets) {
			text = replace_url_with_html_link(tweets[i]["text"]);
			thumbnail = tweets[i]["profile_image_url"];
			created_at = tweets[i]["created_at"];
			username = tweets[i]["from_user"];
			
			infoWindowContent += "<div class='tweet'>";
			infoWindowContent += "<img class='thumbnail' width='35' height='35' src='" + thumbnail + "' alt='' />";
			infoWindowContent += "<a title='" + username + "' href='http://twitter.com/" + username + "' class='twitter_username'>" + username + ": </a>";
			infoWindowContent += text + "</div>";
		}
		infoWindow.setContent(infoWindowContent);
		infoWindow.open(map, marker);
	});
}

function fade_out_content() {
	$("#bg_inner").animate({opacity: "0"}, 500, function() {$("#bg_inner").remove();});
	$("#content_c").animate({opacity: "0"}, 500, function() {$("#content_c").remove();});
}

$("body").ready(function() {
	initialize();
});

$(function() {
	$("#close").click(function() {
		fade_out_content();
		return false;
	});
	
	$("#find_button").click(function() {
		var search_term = $("#term_field").val();
		$("#saved_term").html(search_term);
		fade_out_content();
		load_tweets();
		
		// Reveal top bar
		$("#top_term_info").html(search_term);
		setTimeout(function() {$("#top_term_info_c").slideDown();}, 1000);
		
		var interval_id;
		$(window).focus(function() {
		    //interval_id = setInterval(load_tweets, 5000);
		});
		$(window).blur(function() {
		    clearInterval(interval_id);
		});
		
		return false;
	});
});