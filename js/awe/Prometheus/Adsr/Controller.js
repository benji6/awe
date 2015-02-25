var Model = require('./Model.js');
var View = require('./View.js');

module.exports = () => {
  var model = Model();
  var channels = {};
  var view = View(model, channels);

  channels.adsrA = (value) => {
    model.getModel().a = +value;
  };
  channels.adsrD = (value) => {
    model.getModel().d = +value;
  };
  channels.adsrS = (value) => {
    model.getModel().s = +value;
  };
  channels.adsrR = (value) => {
    model.getModel().r = +value;
  };

  return {
    model,
    view,
    channels
  };
};
