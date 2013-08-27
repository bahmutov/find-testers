var allToUpperCase = require('../utils').allToUpperCase;
var set = require('../utils').set;

gt.module('utils');

gt.test('list to upper case', function () {
  gt.arity(allToUpperCase, 1);
  var list = ['aa', 'aB', 'BB'];
  var LIST = allToUpperCase(list);
  gt.aequal(LIST, ['AA', 'AB', 'BB']);
});

gt.test('set', function () {
  var s = set(['a', 'b']);
  gt.ok(s.a, 'has a');
  gt.ok(s['a'], 'has ["a"]');
  gt.ok(s.b, 'has b');
  gt.ok(!s.c, 'has no c');
});

gt.test('set from property', function () {
  var s = set([{
    name: 'a',
    age: 10
  }, {
    name: 'b',
    age: 20
  }], 'name');
  gt.ok(s.a, 'has a');
  gt.ok(!s.age, 'has no age');
  gt.ok(!s.c, 'has no c');
});