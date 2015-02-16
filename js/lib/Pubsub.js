module.exports = () => {
  var channels = {};

  var sub = function(channel, fn) {
    channels[channel] = channels[channel] || [];
    console.log(channels[channel].length);
    channels[channel].push(fn);
  };

  var pub = function(channel, args) {
    var subscribers = channels[channel];
    var len = subscribers && subscribers.length;
    //console.log(len);

    while (len--) subscribers[len](args);
  };

  return {
    pub,
    sub
  };
};
