module.exports = function (derivedObj, baseObj) {
  var ret = Object.create(baseObj);

  Object.keys(derivedObj).forEach(function (key) {
    ret[key] = derivedObj[key];
  });

  return ret;
};
