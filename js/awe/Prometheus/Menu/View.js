const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');

// const OpenPresetModal = require('./OpenPresetModal/View.js');
// const SavePresetAsModal = require('./SavePresetAsModal/View.js');
// const ImportPresetModal = require('./ImportPresetModal/View.js');
// const ExportPresetModal = require('./ExportPresetModal/View.js');
// const DeletePresetModal = require('./DeletePresetModal/View.js');

module.exports = function (model, channels) {
  // const openPresetModal = OpenPresetModal(model, channels);
  // const savePresetAsModal = SavePresetAsModal(model, channels);
  // const importPresetModal = ImportPresetModal(channels);
  // const exportPresetModal = ExportPresetModal(model, channels);
  // const deletePresetModal = DeletePresetModal(model, channels);

  const menuView = createElement(h("nav", [
    h("ul", [
      h("li", [
        "Menu",
        h("ul", [
          h("li", "Open Preset"),
          h("li", "Save Preset As"),
          h("li", "Import Settings"),
          h("li", "Export Settings"),
          h("li", "Delete Preset"),
        ])
      ])
    ])
  ]));

  // var populatePresets = function () {
  //   var presets = model;
  //
  //   openPresetModal.populatePresets(presets);
  //   deletePresetModal.populatePresets(presets);
  // };

  return {
    connect: function (parentDomElement) {
      parentDomElement.appendChild(menuView);
      // populatePresets();
    },
    //populatePresets: populatePresets
  };
};
