module.exports = function (f) {
  return function (x) {
    return f(function (v) {
      return x(x)(v);
    });
  }(function (x) {
    return f(function (v) {
      return x(x)(v);
    });
  });
};
