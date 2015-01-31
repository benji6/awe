var pubsub = require('./pubsub.js');

module.exports = () => {
  var text = document.createTextNode('volume: ');
  input = document.createElement('input');
  input.type = "range";
  input.min = 0;
  input.max = 1;
  input.step = 0.01;
  input.value = 0.1;
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
  document.body.appendChild(label);
};
