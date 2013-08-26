gt.module('find testers end to end');

var find = require('../..');

gt.test('basics', function () {
  gt.arity(find, 1, 'single options argument');
});