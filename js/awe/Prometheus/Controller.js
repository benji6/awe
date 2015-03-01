var Oscillator = require('./Oscillator/Controller.js');
var Master = require('./Master/Controller.js');
var Adsr = require('./Adsr/Controller.js');
var Filter = require('./Filter/Controller.js');
var Menu = require('./Menu/Controller.js');
var View = require('./View.js');

var pluginName = "Prometheus";
var view = View(pluginName);

var connect = (master) =>
  (outputNode) =>
    master.connect(outputNode);

module.exports = () => {
  var master = Master();
  var adsr = Adsr();
  var filter = Filter();
  var oscillators = [
    "sine",
    "square",
    "sawtooth",
    "triangle"
  ].map((type) => {
    return Oscillator(adsr, type);
  });
  var menu = Menu(pluginName, [adsr, master, filter].concat(oscillators));

  oscillators.forEach((oscillator) => {
    oscillator.connect(filter.destination);
  });
  filter.connect(master.destination);

  var connectViewTo = (master) =>
    (parentDomElement) => {
      var synthParentView = view.connectViewTo(parentDomElement);

      menu.view.connectTo(synthParentView);
      master.view.connectTo(synthParentView);
      adsr.view.connectTo(synthParentView);
      filter.view.connect(synthParentView);
      oscillators.forEach((oscillator) => {
        oscillator.view.connectTo(synthParentView);
      });
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
    connect: connect(master),
    connectViewTo: connectViewTo(master)
  };
};
