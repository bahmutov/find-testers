check = require('check-types');

function allToUpperCase(items) {
  return items.map(function (item) {
    check.verifyString(item, 'expected string item');
    return item.toUpperCase();
  });
}

// each item becomes a key in the returned object
function set(list) {
  check.verifyArray(list, 'expected an array');
  var S = {};
  list.forEach(function (item) {
    check.verifyString(item, 'invalid key ' + item);
    S[item] = true;
  });
  return S;
}

module.exports = {
  allToUpperCase: allToUpperCase,
  set: set
};