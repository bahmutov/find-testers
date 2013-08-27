var check = require('check-types');

gt.module('find testers end to end');

var find = require('../..');

gt.test('basics', function () {
  gt.arity(find, 1, 'single options argument');
});

gt.test('default', function () {
  var found = find();
  gt.ok(check.isArray(found));
  gt.equal(found.length, 9, 'all 9 testers');
});

gt.test('country and phone', function () {
  var found = find({
    country: 'US',
    device: 'iphone 4'
  });
  gt.equal(found.length, 2, 'two US testers have iphone 4');
  gt.ok(found[0].bugs >= found[1].bugs);
});

gt.test('country and [phone]', function () {
  var found = find({
    country: 'US',
    device: ['iphone 4']
  });
  gt.equal(found.length, 2, 'two US testers have iphone 4');
  gt.ok(found[0].bugs >= found[1].bugs);
});

gt.test('country and phones', function () {
  var found = find({
    country: 'US',
    device: ['iphone 4', 'iphone 4s']
  });
  gt.equal(found.length, 2, 'two US testers have iphone 4');
  gt.ok(found[0].bugs >= found[1].bugs);
});

gt.test('invalid country', function () {
  var found = find({
    country: 'doesNotExist'
  });
  gt.equal(found.length, 0);
});

gt.test('invalid device', function () {
  var found = find({
    device: ['doesNotExist']
  });
  gt.equal(found.length, 0);
});

gt.test('valid and invalid device', function () {
  var found = find({
    device: ['iPhone 4S', 'doesNotExist']
  });
  gt.equal(found.length, 2);
});

gt.test('iphone 4s in several countries', function () {
  var found = find({
    country: ['us', 'jp'],
    device: ['iPhone 4S']
  });
  gt.equal(found.length, 2);
});