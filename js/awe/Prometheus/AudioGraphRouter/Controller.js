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

  R.forEachIndexed(function (modelNode, index, array) {
    const inputs = modelNode.inputs;

    R.both(R.identity, R.forEach(function (event) {
      switch (event) {
        case "noteStart":
          eventListeners.noteStart.push(nodes[index]);
        case "noteStop":
          eventListeners.noteStop.push(nodes[index]);
        }
    }))(modelNode.eventListeners);

    const connectionsKeys = R.both(
      R.identity,
      function (connections) {
        return Object.keys(connections);
      }
    )(modelNode.connections);

    R.both(R.identity, R.forEach(function (connectionKey) {
      nodes[index].connect(nodes[connectionKey].destinations[modelNode.connections[connectionKey]]);
    }))(connectionsKeys);

    const inputsKeys = R.both(
      R.identity,
      function (connections) {
        return Object.keys(connections);
      }
    )(modelNode.inputs);

    R.both(R.identity, R.forEach(function (key) {
      nodes[index].inputs[key](nodes[inputs[key]]);
    }))(inputsKeys);
  }, audioGraphModel.model);

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
    connect: connect,
    connectView: connectView,
    noteStart: noteStart,
    noteStop: noteStop
  };
};
