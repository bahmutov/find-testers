var allToUpperCase = require('../utils').allToUpperCase;

gt.module('utils');

gt.test('list to upper case', function () {
  gt.arity(allToUpperCase, 1);
  var list = ['aa', 'aB', 'BB'];
  var LIST = allToUpperCase(list);
  gt.aequal(LIST, ['AA', 'AB', 'BB']);
});