(function() {
  var $document = $(document);
  var questionTemplate, currentUserId;

  var createQuestion = function(question) {
    var $question = $(questionTemplate);
    var twitterHref = 'http://twitter.com/' + question.userDisplayName;

    $question.attr('data-questionid', question.id);
    $question.find('.user-photo').attr('href', twitterHref);
    $question.find('.user-photo img').attr({
      src: question.userPhoto,
      alt: question.userDisplayName,
      title: question.userDisplayName
    });
    $question.find('p').text(question.text);
    $question.find('form').attr('action', '/questions/' + question.id);

    if (currentUserId === question.userId) {
      $question.append('<form action="/questions/' + question.id + '" method="post"> <input type="hidden" name="_method" value="delete"> <input class="delete-question" type="submit" value="&times;" title="Delete" ></form>');
    }

    $('.questions').append($question);
  };

  var deleteQuestion = function(questionId) {
    $('li[data-questionid="' + questionId + '"]').remove();
  };

  var upvote = function(questionId) {
    var $question = $('li[data-questionid="' + questionId + '"]');
    var $upvote = $question.find('.upvote');
    var voteCount = parseInt($upvote.attr('data-votes'), 10) + 1;
    var voteWord = voteCount === 0 ? 'vote' : 'votes';
    var $pivot = $question.prev();

    $upvote.text(voteCount + ' ' + voteWord);
    $upvote.attr('data-votes', voteCount);
    console.log(voteCount);

    while(parseInt($pivot.find('.upvote').attr('data-votes'), 10) < voteCount) {
      $pivot = $pivot.prev();
    }
    if ($pivot.length && $pivot[0] !== $question[0]) {
      $pivot.after($question);
    }
    else if (!$pivot.length) {
      $('.questions').prepend($question);
    }
  };

  var initSocket = function() {
    var socket = io.connect('/');
    var room = $('meta[name="socket-room"]').attr('content');

    socket.on('connect', function() {
      socket.emit('joinRoom', room);
    });

    socket.on('createdQuestion', createQuestion);
    socket.on('deletedQuestion', deleteQuestion);
    socket.on('upvoted', upvote);
  };

  $(function() {
    if ($('.questions')) {
      initSocket();
      questionTemplate = $('#template-question').html();
      currentUserId = $('meta[name="user-id"]').attr('content');
    }
  });

  $document.on('submit', '.ajax-submit', function(event) {
    var $this = $(this);
    $.ajax({
      type: $this.attr('method'),
      data: $this.serializeArray(),
      url: $this.attr('action')
    });
    event.preventDefault();
  });
})();
