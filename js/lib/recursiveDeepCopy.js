// not currently used

var recursiveDeepCopy = (obj) => {
  if (typeof obj === 'object') {
    var newObj;
    if (obj.constructor === Array) {
      newObj = [];
      obj.forEach((element) => {
        newObj.push(recursiveDeepCopy(element));
      });
      return newObj;
    }

    newObj = {};
    Object.keys(obj).forEach((key) =>
    newObj[key] = recursiveDeepCopy(obj[key]));

    return newObj;
  }
  return obj;
};
