const R = require('ramda');
const typeToNodeFactoryMap = require('./typeToNodeFactoryMap.js');

module.exports = function (model, parentDestination, parentDomElement, addStartChannel, addStopChannel) {
  const eventListeners = {
    noteStart: [],
    noteStop: []
  };

  const nodeModelsWithIds = R.zipWith(function (id, nodeModel) {
    nodeModel.id = id;
    return nodeModel;
  }, R.pluck("id", model), R.pluck("model", model));

  const nodes = R.zipWith(function (type, nodeModel) {
    return typeToNodeFactoryMap[type](nodeModel);
  }, R.pluck("type", model), nodeModelsWithIds);

  R.zipWith(function (node, connections) {
    R.both(R.identity, R.forEach(function (connection) {
      R.either(R.eq(undefined), function (connectionId) {
        node.connect(R.find(R.propEq("id", connectionId), nodes).destinations[connection.destination]);
      })(connection.id);
    }))(connections);
  }, nodes, R.pluck("connections", model));

  R.zipWith(function (node, inputs) {
    R.both(R.identity, R.forEach(function (input) {
      R.either(R.eq(undefined), function (inputId) {
        node.inputs[input.destination](R.find(R.propEq("id", inputId), nodes));
      })(input.id);
    }))(inputs);
  }, nodes, R.pluck("inputs", model));

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

  nodes[0].connect(parentDestination);

  addStartChannel((function () {
    const listeners = eventListeners.noteStop;
    return function (freq) {
      for (var i = 0; i < listeners.length; i++) {
        listeners[i].noteStart(freq);
      }
    };
  }()));

  addStopChannel((function () {
    const listeners = eventListeners.noteStop;
    return function (freq) {
      for (var i = 0; i < listeners.length; i++) {
        listeners[i].noteStop(freq);
      }
    };
  }()));

  R.forEach(function (node) {
    node.view.connect(parentDomElement);
  }, nodes);
};
