// View Model - data control and storage
"use strict";

var ViewModel = function() {
  var self = this;

  // Set up a Location constructor to be used to set the locations to the list view as well as for markers
  var Location = function(data) {
    this.title = data.title;
    this.marker = data.marker;
  };

  self.locationList = ko.observableArray([]);
  this.searchItem = ko.observable('');

  // Push all locations to an array - locationList
  locations.forEach(function(locationItem) {
    self.locationList.push(new Location(locationItem));
  });

  // Filter the location on map and on the navbar list based on the Search Item input
  this.locationFiltered = ko.computed(function() {
    var searchFilter = self.searchItem().toLowerCase();
    if (searchFilter) {
        return ko.utils.arrayFilter(self.locationList(), function(location) {
            var str = location.title.toLowerCase();
            var result = str.includes(searchFilter);
            location.marker.setVisible(result);
    return result;
    });
    }
    self.locationList().forEach(function(location) {
      if(location.marker) {
        location.marker.setVisible(true);
      }
    });
    return self.locationList();
    
  });

  //Reset the marker display on map
  self.clearFilter = function() {
    self.searchItem('');
    self.locationList().forEach(function(location) {
      location.marker.setVisible(true);
  });
  };
  //  Initiate google event to open infoWindow when list item is clicked
  self.openWindow = function(place) {
    google.maps.event.trigger(place.marker, 'click');
  };

  // Close view model
};
// Store ViewModel in vm variable for instantiation in map.js
var vm = new ViewModel();