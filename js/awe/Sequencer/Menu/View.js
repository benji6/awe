const createElement = require('virtual-dom/create-element');
const h = require('virtual-dom/h');

module.exports = (parentDomElement) => {
  const createVirtualRoot = () => h("nav", h("ul", h("li", [
        "Menu",
        h("ul", [
          h("li", "Nothing here yet!"),
        ])
      ]))
  );

  var virtualRoot = createVirtualRoot();

  const domRoot = parentDomElement.appendChild(createElement(virtualRoot));

  return {

  };
};
