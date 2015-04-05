const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');
const openPresetModal = require('./OpenPresetModal/View.js');
const savePresetAsModal = require('./SavePresetAsModal/View.js');
const importPresetModal = require('./ImportPresetModal/View.js');
const exportPresetModal = require('./ExportPresetModal/View.js');
const deletePresetModal = require('./DeletePresetModal/View.js');
const keyBoardController = require('../../keyboard/controller.js');

module.exports = function (localStorageController, channels) {
  return {
    connect: function (parentDomElement) {
      const modalContainer = parentDomElement.appendChild(createElement(h("div")));
      keyBoardController.setEscapeListener(function () {
        while (modalContainer.firstChild) {
          modalContainer.removeChild(modalContainer.firstChild);
        }
      });
      parentDomElement.appendChild(createElement(h("nav", [
        h("ul", [
          h("li", [
            "Menu",
            h("ul", [
              h("li", {onclick: function () {
                openPresetModal(localStorageController.getPresets(), channels, modalContainer);
              }}, "Open Preset"),
              h("li", {onclick: function () {
                savePresetAsModal(channels, modalContainer);
              }}, "Save Preset As"),
              h("li", {onclick: function () {
                importPresetModal(channels, modalContainer);
              }}, "Import Settings"),
              h("li", {onclick: function () {
                exportPresetModal(channels.exportSettings(), modalContainer);
              }}, "Export Settings"),
              h("li", {onclick: function () {
                deletePresetModal(channels, modalContainer, localStorageController.getPresets());
              }}, "Delete Preset"),
            ])
          ])
        ])
      ])));
    },
  };
};
