module.exports = () => {
  var channels = {};

  var sub = function(channel, fn) {
    channels[channel] = channels[channel] || [];
    channels[channel].push(fn);
  };

  var pub = function(channel, args) {
    var subscribers = channels[channel];
    var len = subscribers && subscribers.length;
    while (len--) subscribers[len](args);
  };

  return {
    pub,
    sub
  };
};
