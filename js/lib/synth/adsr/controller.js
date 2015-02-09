var model = require('./model.js');

module.exports = {
  getModel: () => model,
  setModel: (newModel) => model = newModel
};
