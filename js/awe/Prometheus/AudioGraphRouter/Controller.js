const R = require('ramda');
const AudioGraphModel = require('./AudioGraphModel.js');
const TypeToNodeFactoryMap = require('./TypeToNodeFactoryMap.js');

module.exports = function () {
  const audioGraphModel = AudioGraphModel();

  const eventListeners = {
    noteStart: [],
    noteStop: []
  };

  const nodes = audioGraphModel.model.map(function (modelNode) {
    return TypeToNodeFactoryMap[modelNode.type](modelNode.params);
  });

  audioGraphModel.model.forEach(function (modelNode, index, array) {
    const inputs = modelNode.inputs;

    R.both(R.always(modelNode.eventListeners), R.forEach(function (event) {
      switch (event) {
        case "noteStart":
          eventListeners.noteStart.push(nodes[index]);
        case "noteStop":
          eventListeners.noteStop.push(nodes[index]);
        }
    }))(modelNode.eventListeners);

    const connectionKeys = R.both(
      R.identity,
      function (connections) {
        return Object.keys(connections);
      }
    )(modelNode.connections);

    R.both(R.always(connectionKeys), R.forEach(function (connectionKey) {
      nodes[index].connect(nodes[connectionKey].destinations[modelNode.connections[connectionKey]]);
    }))(connectionKeys);

    if (inputs) {
      Object.keys(inputs).forEach(function (key) {
        var value = inputs[key];
        nodes[index].inputs[key](nodes[value]);
      });
    }
  });

  var connect = function (destination) {
    nodes[0].connect(destination);
  };

  var connectView = function (parentView) {
    nodes.forEach(function (node) {
      node.view.connect(parentView);
    });
  };

  var noteStart = (function () {
    var listeners = eventListeners.noteStop;
    var i;

    return function (freq) {
      for (i = 0; i < listeners.length; i++) {
        listeners[i].noteStart(freq);
      }
    };
  }());

  var noteStop = (function () {
    var listeners = eventListeners.noteStop;
    var i;

    return function (freq) {
      for (i = 0; i < listeners.length; i++) {
        listeners[i].noteStop(freq);
      }
    };
  }());

  return {
    connect,
    connectView,
    noteStart,
    noteStop
  };
};
