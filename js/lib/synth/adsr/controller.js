var Model = require('./model.js');
var View = require('./view.js');


module.exports = (pubsub) => {
  var model = Model();
  var view = View(model, pubsub);

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


  return {
    model,
    view
  };
};
