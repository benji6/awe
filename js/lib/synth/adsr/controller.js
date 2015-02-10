var pubsub = require('../pubsub.js');

var model = require('./model.js');
var view = require('./view.js');

pubsub.on('adsrA', (value) => {
  model.getModel().a = +value;
});
pubsub.on('adsrD', (value) => {
  model.getModel().d = +value;
});
pubsub.on('adsrS', (value) => {
  model.getModel().s = +value;
});
pubsub.on('adsrR', (value) => {
  model.getModel().r = +value;
});


module.exports = {
  connectViewTo: view.connectTo,
  getModel: model.getModel,
  init: model.init,
  setModel: model.setModel,
  render: view.render
};
