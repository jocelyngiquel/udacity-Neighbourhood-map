// View Model - data control and storage
var ViewModel = function() {
    var self = this;
  
    // Set up a Location constructor to be used to set the locations to the list view as well as for markers
    var Location = function(data) {
      this.title = data.title;
      this.marker = data.marker;
    };
  
    self.locationList = ko.observableArray([]);
  
    // Push all locations to an array - locationList
  
    locations.forEach(function(locationItem) {
      self.locationList.push(new Location(locationItem));
    });
  
    //  Initiate google event to open infoWindow when list item is clicked
    self.openWindow = function(place) {
      google.maps.event.trigger(place.marker, 'click');
    };
  
    // Close view model
  };
  // Store ViewModel in vm variable for instantiation in map.js
  var vm = new ViewModel();