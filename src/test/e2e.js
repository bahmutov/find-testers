var check = require('check-types');

gt.module('find testers end to end');

var find = require('../..');

gt.test('basics', function () {
  gt.arity(find, 1, 'single options argument');
});

gt.test('default', function () {
  var found = find();
  gt.ok(check.isArray(found));
});

gt.test('country and phone', function () {
  var found = find({
    country: 'US',
    device: 'iphone 4'
  });
  gt.equal(found.length, 2, 'two US testers have iphone 4');
  gt.ok(found[0].bugs >= found[1].bugs);
});