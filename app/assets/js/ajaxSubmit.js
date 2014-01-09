(function() {
  $(document).on('submit', '.ajax-submit', function(event) {
    var $this = $(this);
    event.preventDefault();
    if (!$this.hasClass('disabled')) {
      $.ajax({
        type: $this.attr('method'),
        data: $this.serializeArray(),
        url: $this.attr('action')
      });
    }
  });
})();
