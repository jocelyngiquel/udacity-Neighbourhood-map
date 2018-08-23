//Initialize google map, markers and infowindow
//Retrieve the data from model to populate the markers location and title
//Retrieve the data from model and fs to query the Foursquare API to retrieve
//photo url, foursquare url of the place, rating and rating color.

//Set global variable for the app
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

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position and other details from the location array.
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

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position and response from the Foursquare API.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
  
      //Compute the Foursquare API request based on fs inputs and the marker fsid
      var fsURL = foursquare[0].url + marker.fsid + foursquare[0].clientID + foursquare[0].clientSecret + foursquare[0].version;
  
      $.ajax({
        url: fsURL,
        dataType: 'jsonp',
        success:function(result) {
          //In case of request successful but quota exceeded, pass the error into the infowindow
          if (result.meta["code"] == 429) {
            render = '<div>' + '<p>' + 'Foursquare error: ' + result.meta["errorDetail"] + '</p>'+ '</div>';
            infowindow.setContent(window.render);
          } else {
          //In case of request successful, parse the response and compute the
          //infowindow
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
        //In case of unsuccessful request, pass an error message
        error: function() {
          render = '<div>' + '<p>' + "Okay, houston, we've had a problem" + '</p>' + '</div>';
          infowindow.setContent(window.render);
        }
  
      });
      // Open the infowindow on the correct marker.
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
  // Apply Knockout.js bindings
  ko.applyBindings(vm);
}
