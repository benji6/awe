const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');

const openPresetModal = require('./OpenPresetModal/View.js');
// const SavePresetAsModal = require('./SavePresetAsModal/View.js');
// const ImportPresetModal = require('./ImportPresetModal/View.js');
const exportPresetModal = require('./ExportPresetModal/View.js');
// const DeletePresetModal = require('./DeletePresetModal/View.js');

module.exports = function (model, presetNames, channels) {
  return {
    connect: function (parentDomElement) {
      parentDomElement.appendChild(createElement(h("nav", [
        h("ul", [
          h("li", [
            "Menu",
            h("ul", [
              h("li", {onclick: function () {
                openPresetModal(presetNames, channels, parentDomElement);
              }}, "Open Preset"),
              h("li", "Save Preset As"),
              h("li", "Import Settings"),
              h("li", {onclick: function () {
                exportPresetModal(channels.exportSettings(), parentDomElement);
              }}, "Export Settings"),
              h("li", "Delete Preset"),
            ])
          ])
        ])
      ])));
    },
  };
};
