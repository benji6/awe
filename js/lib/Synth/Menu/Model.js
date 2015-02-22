module.exports = (pluginName) => {
  var getPresets = () => {
    if (!localStorage[pluginName]) {
      return;
    }
    return Object.keys(JSON.parse(localStorage.getItem(pluginName)));
  };

  var getPreset = (key) => {
    if (!localStorage[pluginName]) {
      return;
    }
    return JSON.parse(localStorage.getItem(pluginName))[key];
  };

  var hasPresetKey = (key) => {
    if (!localStorage[pluginName]) {
      return false;
    }
    return JSON.parse(localStorage.getItem(pluginName))[key] !== undefined;
  };

  var savePreset = function (key, data) {
    var storedData = {};

    if (localStorage[pluginName]) {
      storedData = JSON.parse(localStorage.getItem(pluginName));
    }

    storedData[key] = data;
    localStorage.setItem(pluginName, JSON.stringify(storedData));
  };

  var deletePreset = (key) => {
    if (!localStorage[pluginName]) {
      return;
    }
    var storedData = JSON.parse(localStorage.getItem(pluginName));
    
    delete storedData[key];
    localStorage.setItem(pluginName, JSON.stringify(storedData));
  };

  return {
    getPresets,
    getPreset,
    deletePreset,
    hasPresetKey,
    savePreset
  };
};
