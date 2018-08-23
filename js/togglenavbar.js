// jQuery event for toggling mobile nav in and out
$('.navbar-menu').on('click', function() {
    $('.selector-container').toggleClass('selector-container-open');
    var sideHeight = $('.list-box').outerHeight();
    $('#map').height(sideHeight);
  });
