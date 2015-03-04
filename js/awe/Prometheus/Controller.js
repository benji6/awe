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
  var masterGain = Gain();
  var masterPanner = Panner();
  masterPanner.connect(masterGain.destination);

  var oscillators = [
    "sine",
    "square",
    "sawtooth",
    "triangle"
  ].map((type) => {
    return Oscillator(adsr, type);
  });
  var menu = Menu(pluginName, [adsr, filter].concat(oscillators));

  oscillators.forEach((oscillator) => {
    oscillator.connect(filter.destination);
  });
  filter.connect(masterPanner.destination);

  var connectViewTo = (master) =>
    (parentDomElement) => {
      var synthParentView = view.connectViewTo(parentDomElement);

      menu.view.connectTo(synthParentView);
      adsr.view.connectTo(synthParentView);
      filter.view.connect(synthParentView);
      oscillators.forEach((oscillator) => {
        oscillator.view.connectTo(synthParentView);
      });
    };

  var connect = function (node) {
    masterGain.connect(node);
  };

  return {
    channelStart: (freq) => {
      oscillators.forEach((oscillator) => {
        oscillator.noteStart(freq);
      });
    },
    channelStop: (freq) => {
      oscillators.forEach((oscillator) => {
        oscillator.noteFinish(freq);
      });
    },
    connect,
    connectViewTo: connectViewTo(document.body)
  };
};
