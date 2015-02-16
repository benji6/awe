var Model = require('./Model.js');
var View = require('./View.js');


module.exports = (pubsub) => {
  var model = Model();
  var view = View(model, pubsub);

  pubsub.sub('adsrA', (value) => {
    model.getModel().a = +value;
  });
  pubsub.sub('adsrD', (value) => {
    model.getModel().d = +value;
  });
  pubsub.sub('adsrS', (value) => {
    model.getModel().s = +value;
  });
  pubsub.sub('adsrR', (value) => {
    model.getModel().r = +value;
  });


  return {
    model,
    view
  };
};
