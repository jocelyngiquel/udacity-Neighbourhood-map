var map;
var marker;
var markers = []

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 46.2051251,
      lng: 6.1555332
    },
    zoom: 15,
    styles: mapstyles
  });

  var infoWindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    var fsid = locations[i].fsid;
    var markerIcon = 'img/swiss-army-knife.png';
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      icon: markerIcon,
      animation: google.maps.Animation.DROP,
      fsid: fsid,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, infoWindow);
    });
    bounds.extend(markers[i].position);
  }
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.setContent('');
    infowindow.marker = marker;

    url = "https://api.foursquare.com/v2/venues/";
    clientID = "?&client_id=ISZVSBC0XU3A0FY0GOXREVFAKP5ID410LUJQJ4LJMHRC4ICB";
    clientSecret = "&client_secret=YZEU550LVWJVGML2SL0WJDF4ICD2UPVFJM52HO3FPWMSWIGJ";
    version = "&v=20180822";

    var fsURL = url + marker.fsid + clientID + clientSecret + version;

    $.ajax({
      url: fsURL,
      dataType: 'jsonp',
      success:function(result) {
        if (result.meta["code"] == 429) {
          render = '<div>' + '<p>' + 'Foursquare error: ' + result.meta["errorDetail"] + '</p>' + '</div>';
          infowindow.setContent(window.render);
        } else {
        var response = result.response;
        var shortURL = response.venue["shortUrl"];
            photoUrl = response.venue.bestPhoto["prefix"] + "height150" + response.venue.bestPhoto["suffix"];
            rating = response.venue["rating"];
            ratingColor = response.venue["ratingColor"];
            render = '<div>' + '<p>' + marker.title + '<br>' + rating + '<br>' + shortURL + '<br>' + ratingColor + '<br>' + photoUrl + '</p>' + '</div>';            
            infowindow.setContent(window.render2);
      }},
      error: function() {
        render = '<div>' + '<p>' + "Okay, houston, we've had a problem" + '</p>' + '</div>';
        infowindow.setContent(window.render);
      }

    });
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}