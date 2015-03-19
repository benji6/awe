var AudioGraphRouter = require('./AudioGraphRouter/Controller.js');
var Adsr = require('./Adsr/Controller.js');
var Menu = require('./Menu/Controller.js');
var View = require('./View.js');

var pluginName = "Prometheus";
var view = View(pluginName);

module.exports = function () {
  var adsr = Adsr();

  var audioGraphRouter = AudioGraphRouter();

  var menu = Menu(pluginName, [adsr]);

  var connectViewTo = function (master) {
    return function (parentDomElement) {
      var synthParentView = view.connectViewTo(parentDomElement);
      audioGraphRouter.connectView(synthParentView);

      menu.view.connectTo(synthParentView);
      adsr.view.connectTo(synthParentView);
    };
  };

  var connect = function (node) {
    audioGraphRouter.connect(node);
  };

  return {
    channelStart: function (freq) {
      audioGraphRouter.noteStart(freq);
    },
    channelStop: function (freq) {
      audioGraphRouter.noteStop(freq);
    },
    connect,
    connectViewTo: connectViewTo(document.body)
  };
};
