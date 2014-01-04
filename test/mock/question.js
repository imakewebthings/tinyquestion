var _ = require('lodash');

module.exports = function(properties) {
  var defaults = {
    user: {
      id: 'test-user-id',
      displayName: 'test-user-display-name'
    },
    questionSessionId: 'test-session',
    text: 'test question?'
  };

  return _.extend(defaults, properties);
};
