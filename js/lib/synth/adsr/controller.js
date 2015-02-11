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
  model,
  view
};
