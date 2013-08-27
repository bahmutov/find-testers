var check = require('check-types');

// converting list of strings into all upper case
function allToUpperCase(items) {
  return items.map(function (item) {
    check.verifyString(item, 'expected string item');
    return item.toUpperCase();
  });
}

// each item becomes a key in the returned object
function set(list) {
  if (arguments.length === 2) {
    return setFromProperty.call(null, arguments[0], arguments[1]);
  }
  check.verifyArray(list, 'expected an array');

  var S = {};
  list.forEach(function (item) {
    check.verifyString(item, 'invalid key ' + item);
    S[item] = true;
  });
  return S;
}

function setFromProperty(list, property) {
  var items = list.map(function (item) {
    return item[property];
  });
  return set(items);
}

module.exports = {
  allToUpperCase: allToUpperCase,
  set: set
};