(function() {
  var $document = $(document);
  var disabled;

  var addToDisabled = function($form) {
    var questionId = $form.closest('.questions > li').attr('data-questionid');
    disabled.unshift(questionId);
    disabled = disabled.slice(0, 200);
    localStorage.setItem('upvoted', disabled.join(','));
  };

  $document.on('submit', '.upvote-form:not(.disabled)', function() {
    var $this = $(this);
    $this.addClass('disabled');
    if (window.localStorage) {
      addToDisabled($this);
    }
  });

  if (window.localStorage) {
    disabled = localStorage.getItem('upvoted');
    disabled = disabled ? disabled.split(',') : [];
    $(function() {
      $.each(disabled, function(index, id) {
        var $form = $('li[data-questionid="' + id + '"]').find('.upvote-form');
        $form.addClass('disabled');
      });
    });
  }
})();
