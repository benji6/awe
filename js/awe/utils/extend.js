module.exports = (derivedObj, baseObj) => {
  var ret = Object.create(baseObj);

  Object.keys(derivedObj).forEach((key) => {
    ret[key] = derivedObj[key];
  });

  return ret;
};
