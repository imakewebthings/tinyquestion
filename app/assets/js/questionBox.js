(function() {
  var $questionBox = $();

  $(document).on('submit', '.question-form', function(event) {
    window.setTimeout(function() {
      $questionBox.val('');
    }, 50);
  });

  $(document).on('keydown', '#question_id', function(event) {
    if(event.keyCode == 13 && (event.metaKey || event.ctrlKey)) {
      $(this).parents('form').trigger('submit');
    }
  });

  $(function() {
    $questionBox = $('#question_id');
    if ($questionBox.length) {
      $questionBox.autosize();
    }
  });
})();
