var AudioGraphRouter = require('./AudioGraphRouter/Controller.js');
var Oscillator = require('./Oscillator/Controller.js');
var Adsr = require('./Adsr/Controller.js');
var Filter = require('./Filter/Controller.js');
var Menu = require('./Menu/Controller.js');
var View = require('./View.js');

var Gain = require('./Gain/Controller.js');
var Panner = require('./Panner/Controller.js');

var pluginName = "Prometheus";
var view = View(pluginName);

module.exports = function () {
  var adsr = Adsr();
  var filter = Filter();

  var audioGraphRouter = AudioGraphRouter();

  var oscillators = [
    "sine",
    "square",
    "sawtooth",
    "triangle"
  ].map(function (type) {
    return Oscillator(adsr, type);
  });
  var menu = Menu(pluginName, [adsr, filter].concat(oscillators));

  oscillators.forEach(function (oscillator) {
    oscillator.connect(filter.destination);
  });
  filter.connect(audioGraphRouter.destination);

  var connectViewTo = function (master) {
    return function (parentDomElement) {
      var synthParentView = view.connectViewTo(parentDomElement);
      audioGraphRouter.connectView(synthParentView);

      menu.view.connectTo(synthParentView);
      adsr.view.connectTo(synthParentView);
      filter.view.connect(synthParentView);
      oscillators.forEach(function (oscillator) {
        oscillator.view.connectTo(synthParentView);
      });
    };
  };

  var connect = function (node) {
    audioGraphRouter.connect(node);
  };

  return {
    channelStart: function (freq) {
      oscillators.forEach(function (oscillator) {
        oscillator.noteStart(freq);
      });
    },
    channelStop: function (freq) {
      oscillators.forEach(function (oscillator) {
        oscillator.noteFinish(freq);
      });
    },
    connect,
    connectViewTo: connectViewTo(document.body)
  };
};
