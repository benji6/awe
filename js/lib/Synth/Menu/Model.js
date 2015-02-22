module.exports = (pluginName) => {
  var getPresets = () => {
    if (!localStorage[pluginName]) {
      return;
    }
    return Object.keys(JSON.parse(localStorage.getItem(pluginName)));
  };

  var hasPresetKey = (key) =>
    JSON.parse(localStorage.getItem(pluginName))[key] !== undefined;

  var savePreset = function (key, data) {
    var storedData = {};

    if (localStorage[pluginName]) {
      storedData = JSON.parse(localStorage.getItem(pluginName));
    }

    storedData[key] = data;
    localStorage.setItem(pluginName, JSON.stringify(storedData));
  };

  return {
    getPresets,
    hasPresetKey,
    savePreset
  };
};
