var map;
var marker;
var markers = []

var mapstyles = [
  {
    stylers: [
        {
            hue: "#dd0d0d"
        }
    ]
},
{
    featureType: "road",
    elementType: "labels",
    stylers: [
        {
            visibility: "off"
        }
    ]
},
{
    featureType: "road",
    elementType: "geometry",
    stylers: [
        {
            lightness: 100
        },
        {
            visibility: "simplified"
        }
    ]
},
{
  featureType: "transit",
  elementType: "labels.icon",
  stylers: [
      {
          visibility: "off"
      }
  ]
},
];

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

  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    var markerIcon = 'img/swiss-army-knife.png';
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      icon: markerIcon,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);
  }
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
}