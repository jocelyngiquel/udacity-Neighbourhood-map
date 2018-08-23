// Click event on menu icon to toggle in and out the left navbar
$('.navbar-menu').on('click', function() {
    $('.selector-container').toggleClass('selector-container-open');
    var sideHeight = $('.list-box').outerHeight();
    $('#map').height(sideHeight);
  });
