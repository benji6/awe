const h = require('virtual-dom/h');
const createElement = require('virtual-dom/create-element');
const openPresetModal = require('./OpenPresetModal/View.js');
const savePresetAsModal = require('./SavePresetAsModal/View.js');
const importPresetModal = require('./ImportPresetModal/View.js');
const exportPresetModal = require('./ExportPresetModal/View.js');
const deletePresetModal = require('./DeletePresetModal/View.js');
const keyBoardController = require('../../keyboard/controller.js');

module.exports = (localStorageController, channels) => {
  return {
    connect: (parentDomElement) => {
      const modalContainer = parentDomElement.appendChild(createElement(h("div")));
      keyBoardController.setEscapeListener(() => {
        while (modalContainer.firstChild) {
          modalContainer.removeChild(modalContainer.firstChild);
        }
      });
      parentDomElement.appendChild(createElement(h("nav", [
        h("ul", [
          h("li", [
            "Menu",
            h("ul", [
              h("li", {
                onclick: () => openPresetModal(localStorageController.getPresets(), channels, modalContainer)
              }, "Open Preset"),
              h("li", {
                onclick: () => savePresetAsModal(channels, modalContainer)
              }, "Save Preset As"),
              h("li", {
                onclick: () => importPresetModal(channels, modalContainer)
              }, "Import Settings"),
              h("li", {
                onclick: () => exportPresetModal(channels.exportSettings(), modalContainer)
              }, "Export Settings"),
              h("li", {
                onclick: () => deletePresetModal(channels, modalContainer, localStorageController.getPresets())
              }, "Delete Preset"),
            ])
          ])
        ])
      ])));
    },
  };
};
