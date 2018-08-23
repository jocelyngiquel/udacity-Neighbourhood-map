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
      map.panTo(marker.getPosition());
      map.panBy(0, -200);
      populateInfoWindow(this, infoWindow);
    });
    bounds.extend(marker.position);
    vm.locationList()[i].marker = marker;
  }
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);

  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.setContent('');
      infowindow.marker = marker;
  
      var fsURL = foursquare[0].url + marker.fsid + foursquare[0].clientID + foursquare[0].clientSecret + foursquare[0].version;
  
      $.ajax({
        url: fsURL,
        dataType: 'jsonp',
        success:function(result) {
          if (result.meta["code"] == 429) {
            render = '<div>' + '<p>' + 'Foursquare error: ' + result.meta["errorDetail"] + '</p>'+ '</div>';
            infowindow.setContent(window.render);
          } else {
          var response = result.response;
          var shortURL = response.venue["shortUrl"];
              photoURL = response.venue.bestPhoto["prefix"] + "height150" + response.venue.bestPhoto["suffix"];
              rating = response.venue["rating"];
              ratingColor = response.venue["ratingColor"];
              render = '<div style = "text-align: center;">'+ '<b>' + marker.title + '</b>' +
                      '<div>' + 'Rating:  ' + '<b style = "font-size:20px; color:#' + ratingColor + '">' +
                      rating + '</b>' + '</div>'+
                      '<img src="' +photoURL +'"><br>'+
                      '<a href ="'+ shortURL +'">'+ 'More info on Foursquare</a>' + '</div>' +
                      '<img src="img/Foursquare_150.png">';          
              infowindow.setContent(window.render);
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
       // Close infowindow when clicked elsewhere on the map
      map.addListener("click", function(){
      infowindow.close(infowindow);
      });
    }
  }
  ko.applyBindings(vm);

}