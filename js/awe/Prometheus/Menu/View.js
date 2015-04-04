const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');
const openPresetModal = require('./OpenPresetModal/View.js');
const savePresetAsModal = require('./SavePresetAsModal/View.js');
const importPresetModal = require('./ImportPresetModal/View.js');
const exportPresetModal = require('./ExportPresetModal/View.js');
const deletePresetModal = require('./DeletePresetModal/View.js');

module.exports = function (localStorageController, channels) {
  return {
    connect: function (parentDomElement) {
      parentDomElement.appendChild(createElement(h("nav", [
        h("ul", [
          h("li", [
            "Menu",
            h("ul", [
              h("li", {onclick: function () {
                openPresetModal(localStorageController.getPresets(), channels, parentDomElement);
              }}, "Open Preset"),
              h("li", {onclick: function () {
                savePresetAsModal(channels, parentDomElement);
              }}, "Save Preset As"),
              h("li", {onclick: function () {
                importPresetModal(channels, parentDomElement);
              }}, "Import Settings"),
              h("li", {onclick: function () {
                exportPresetModal(channels.exportSettings(), parentDomElement);
              }}, "Export Settings"),
              h("li", {onclick: function () {
                deletePresetModal(channels, parentDomElement, localStorageController.getPresets());
              }}, "Delete Preset"),
            ])
          ])
        ])
      ])));
    },
  };
};
