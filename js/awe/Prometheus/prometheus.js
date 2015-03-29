const R = require('ramda');
const typeToNodeFactoryMap = require('./typeToNodeFactoryMap.js');

module.exports = function (model) {
  const eventListeners = {
    noteStart: [],
    noteStop: []
  };

  const params = R.pluck("params");
  const ids = R.pluck("id");

  const paramsWithIds = R.zipWith(function (id, params) {
    return R.assoc("id", id, params);
  }, R.pluck("id", model), R.pluck("params", model));

  const nodes = R.zipWith(function (type, params) {
    return typeToNodeFactoryMap[type](params);
  }, R.pluck("type", model), paramsWithIds);

  console.log(nodes);

  R.zipWith(function (node, connections) {
    R.forEach(function (connection) {
      R.either(R.eq(undefined), function (connectionId) {
        // console.log(nodes[R.indexOf(R.find(R.propEq('id', connectionId), model), model)]);
        node.connect(nodes[R.indexOf(R.find(R.propEq('id', connectionId), model), model)]);
      })(connection.id);
    }, connections);
  }, nodes, R.pluck("connections", model));


  // console.log(nodes);

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
  }, model);

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
