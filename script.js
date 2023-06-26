$(document).ready(function() {
  var maxHeight = 0;

  // Find the maximum height of the inner divs
  $('.header-inner').each(function() {
    var height = $(this).outerHeight();
    if (height > maxHeight) {
      maxHeight = height;
    }
  });

  // Set the maximum height to all inner divs
  $('.header-inner').css('height', maxHeight /2+ 'px');
});