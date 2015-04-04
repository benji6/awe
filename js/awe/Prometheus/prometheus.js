const R = require('ramda');
const typeToNodeFactoryMap = require('./typeToNodeFactoryMap.js');

module.exports = function (parentDestination, parentDomElement, startChannel, stopChannel) {
  const oldState = {};

  const purgeOldState = function () {
    while (parentDomElement.firstChild) {
      parentDomElement.removeChild(parentDomElement.firstChild);
    }
  };

  return function (model) {
    purgeOldState();

    const noteStartListeners = [];
    const noteStopListeners = [];

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
            noteStartListeners.push(node);
          }],
          [R.eq("noteStop"), function () {
            noteStopListeners.push(node);
          }]
        )))(modelEventListener);
    }, nodes, R.pluck("eventListeners", model));

    console.log(oldState.rootAudioNode);
    oldState.rootAudioNode && oldState.rootAudioNode.disconnect();
    console.log(oldState.rootAudioNode);
    oldState.rootAudioNode = nodes[0].destinations.destination;
    nodes[0].connect(parentDestination);

    const onStart = function (freq) {
      for (var i = 0; i < noteStartListeners.length; i++) {
        noteStartListeners[i].noteStart(freq);
      }
    };

    const onStop = function (freq) {
      for (var i = 0; i < noteStopListeners.length; i++) {
        noteStopListeners[i].noteStop(freq);
      }
    };

    startChannel.remove(oldState.onStart);
    stopChannel.remove(oldState.onStop);

    oldState.onStart = onStart;
    oldState.onStop = onStop;

    startChannel.add(onStart);
    stopChannel.add(onStop);

    R.forEach(function (node) {
      node.view.connect(parentDomElement);
    }, nodes);
  };
};
