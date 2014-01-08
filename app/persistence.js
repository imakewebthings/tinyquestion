var memoryStrategy = require('./memoryStrategy');
var redisStrategy = require('./redisStrategy');
var selectedStrategy = memoryStrategy;

module.exports = function(strategy) {
  if (strategy) {
    selectedStrategy = strategy === 'redis' ? redisStrategy : memoryStrategy;
  }
  return selectedStrategy;
};
