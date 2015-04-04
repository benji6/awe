const LZString = require('lz-string');
const R = require('ramda');
const defaultPresets = require('./defaultPresets.js');

const compress = function (str) {
  return LZString.compressToEncodedURIComponent(str);
};

const decompress = function (str) {
  return LZString.decompressFromEncodedURIComponent(str);
};

window.decompressAndParse = R.compose(JSON.parse, decompress);

const getItem = function (key) {
  return localStorage.getItem(key);
};

const setItem = function (key, data) {
  return localStorage.setItem(key, data);
};

module.exports = function (pluginName) {
  const stringifyCompressAndSet = R.compose(R.curry(setItem)(pluginName), compress, JSON.stringify);
  const getDecompressAndParse = function () {
    return R.compose(decompressAndParse, getItem)(pluginName);
  };

  const savePreset = function (key, data) {
    stringifyCompressAndSet(R.assoc(key, data, getDecompressAndParse()));
  };

  const getPresets = function () {
    return R.sort(function (a, b) {
      return R.toLower(a).localeCompare(R.toLower(b));
    }, R.keys(getDecompressAndParse()));
  };

  const openPreset = function (key) {
    return getDecompressAndParse()[key];
  };

  const hasPresetKey = (key) => {
    return getDecompressAndParse()[key] !== undefined;
  };

  const deletePreset = function (key) {
    stringifyCompressAndSet(dissoc(key, getDecompressAndParse()));
  };

  R.either(R.identity, function () {
    stringifyCompressAndSet({});
  })(localStorage[pluginName]);

  R.forEach(function (defaultPreset) {
    R.either(hasPresetKey, R.curry(savePreset)(defaultPreset.model))(defaultPreset.name);
  }, defaultPresets);

  return {
    compress: compress,
    decompressAndParse: decompressAndParse,
    deletePreset: deletePreset,
    getPresets: getPresets,
    hasPresetKey: hasPresetKey,
    openPreset: openPreset,
    savePreset: savePreset
  };
};
