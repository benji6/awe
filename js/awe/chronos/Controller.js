const createModel = require('./createModel.js');
const data = require('./data.js');
const createView = require('./createView.js');



module.exports = (parentDomElement) => {
  const controllerChannels = {

  };



  const model = createModel(data);
  const view = createView(model, parentDomElement, controllerChannels);

  
};
