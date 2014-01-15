(function() {
  var ontouchstart = 'ontouchstart' in window;
  var documentTouch = window.DocumentTouch && document instanceof DocumentTouch;
  var featureClass = ontouchstart || documentTouch ? 'touch' : 'no-touch';

  $('html').addClass(featureClass);
})();
