const R = require('ramda');
const typeToNodeFactoryMap = require('./typeToNodeFactoryMap.js');

module.exports = function (model) {
  const eventListeners = {
    noteStart: [],
    noteStop: []
  };

  const paramsWithIds = R.zipWith(function (id, params) {
    return R.assoc("id", id, params);
  }, R.pluck("id", model), R.pluck("params", model));

  const nodes = R.zipWith(function (type, params) {
    return typeToNodeFactoryMap[type](params);
  }, R.pluck("type", model), paramsWithIds);

  R.zipWith(function (node, connections) {
    R.forEach(function (connection) {
      R.either(R.eq(undefined), function (connectionId) {
        node.connect(R.find(R.propEq("id", connectionId), nodes).destinations[connection.destination]);
      })(connection.id);
    }, connections);
  }, nodes, R.pluck("connections", model));

  R.zipWith(function (node, modelEventListener) {
      R.either(R.eq(undefined), R.forEach(R.cond(
        [R.eq("noteStart"), function () {
          eventListeners.noteStart.push(node);
        }],
        [R.eq("noteStop"), function () {
          eventListeners.noteStop.push(node);
        }]
      )))(modelEventListener);
  }, nodes, R.pluck("eventListeners", model));

  const connect = function (destination) {
    nodes[0].connect(destination);
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
    view: {
      connect: function (parentView) {
        nodes.forEach(function (node) {
          node.view.connect(parentView);
        });
      }
    },
    noteStart: noteStart,
    noteStop: noteStop
  };
};
