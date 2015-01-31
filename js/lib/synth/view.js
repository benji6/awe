var pubsub = require('./pubsub.js');

var createInputElement = () => {
  var input = document.createElement('input');
  input.type = "range";
  input.min = 0;
  input.max = 1;
  input.step = 0.01;
  input.value = 0.1;
  return input;
};

var createMasterVolumeControl = () => {
  var text = document.createTextNode('Volume: ');
  var input = createInputElement();
  var output = document.createElement('output');
  output.value = (input.value * 100).toFixed(0);
  input.oninput = function () {
    pubsub.emit('volume', input.value);
    output.value = (input.value * 100).toFixed(0);
  };
  var label = document.createElement('label');
  label.appendChild(text);
  label.appendChild(input);
  label.appendChild(output);
  var div = document.createElement('div');
  div.appendChild(label);
  document.body.appendChild(div);
};

var createOscVolumeControl = function (text, channel) {
  var input = createInputElement();
  var output = document.createElement('output');
  output.value = (input.value * 100).toFixed(0);
  input.oninput = function () {
    pubsub.emit(channel, input.value);
    output.value = (input.value * 100).toFixed(0);
  };
  var label = document.createElement('label');
  label.appendChild(document.createTextNode(text));
  label.appendChild(input);
  label.appendChild(output);
  var div = document.createElement('div');
  div.appendChild(label);
  document.body.appendChild(div);
};

module.exports = () => {
  createMasterVolumeControl();
  createOscVolumeControl('Square Volume: ', 'squareVolume');
  createOscVolumeControl('Sawtooth Volume: ', 'sawtoothVolume');
};
