var AudioGraphRouter = require('./AudioGraphRouter/Controller.js');
var Oscillator = require('./Oscillator/Controller.js');
var Adsr = require('./Adsr/Controller.js');
var Menu = require('./Menu/Controller.js');
var View = require('./View.js');

var pluginName = "Prometheus";
var view = View(pluginName);

module.exports = function () {
  var adsr = Adsr();

  var audioGraphRouter = AudioGraphRouter();

  var oscillators = [
    "sine",
    "square",
    "sawtooth",
    "triangle"
  ].map(function (type) {
    return Oscillator(adsr, type);
  });
  var menu = Menu(pluginName, [adsr].concat(oscillators));

  oscillators.forEach(function (oscillator) {
    oscillator.connect(audioGraphRouter.destination);
  });

  var connectViewTo = function (master) {
    return function (parentDomElement) {
      var synthParentView = view.connectViewTo(parentDomElement);
      audioGraphRouter.connectView(synthParentView);

      menu.view.connectTo(synthParentView);
      adsr.view.connectTo(synthParentView);
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
