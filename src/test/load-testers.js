var path = require('path');
var load = require('../load-testers');
var check = require('check-types');

gt.module('load testers');

var filename = path.join(__dirname, 'testers.csv');

gt.test('basics', function () {
  gt.arity(load, 2, 'load takes single argument');
});

gt.test('load test data', function () {
  var testers = load(filename);
  gt.defined(testers, 'loaded testers');
  gt.equal(testers.length(), 9, 'should have 9 testers');
  gt.equal(testers.testers[0].testerId, '1', 'id is correct');
  gt.equal(testers.testers[0].firstName, 'Miguel', 'first name');
  gt.equal(testers.testers[8].lastName, 'Thiagarajan', 'last name');
});

gt.test('values', function () {
  var testers = load(filename);
  gt.defined(testers, 'loaded testers');
  gt.ok(check.isArray(testers.values()));
  gt.equal(testers.values().length, 9);
});

gt.test('find by country ALL', function () {
  var testers = load(filename);
  gt.func(testers.filterByCountry, 'filterByCountry');
  var found = testers.filterByCountry('ALL');
  gt.equal(found.length, testers.length, 'all should match');
});

gt.test('find by country GB', function () {
  var testers = load(filename);
  var found = testers.filterByCountry('GB');
  gt.equal(found.length(), 3, '3 testers in GB');
});

gt.test('find by country US or GB', function () {
  var testers = load(filename);
  var found = testers.filterByCountry(['US', 'GB']);
  gt.equal(found.length(), 6, '6 testers in US or GB');
});

gt.test('find by country US or GB or jp', function () {
  var testers = load(filename);
  var found = testers.filterByCountry(['US', 'GB', 'jp']);
  gt.equal(found.length(), 9, '9 testers in US or GB or JP');
});

gt.test('load default', function () {
  var testers = load();
  gt.equal(testers.length(), 9, '9 default testers');
});

gt.test('devices loaded', function () {
  var testers = load();
  var first = testers.testers[0];
  gt.equal(first.testerId, '1');

  gt.ok(first.devices['1'], 'first tester has device 1');
  gt.ok(first.devices['2'], 'first tester has device 2');
  gt.ok(first.devices['3'], 'first tester has device 3');
  gt.ok(first.devices['10'], 'first tester has device 10');
});

gt.test('filter by device - allow ALL', function () {
  var testers = load();
  var filtered = testers.filterByDevice('ALL');
  gt.equal(filtered.length(), 9, 'all testers remain');
});

gt.test('filter by device - iPhone 4', function () {
  var testers = load();
  var filtered = testers.filterByDevice('iPhone 4');
  gt.equal(filtered.length(), 4, 'four testers have iphone 4');
});

gt.test('filter by device - iPhone 4 case-insensitive', function () {
  var testers = load();
  var filtered = testers.filterByDevice('iphone 4');
  gt.equal(filtered.length(), 4, 'four testers have iphone 4');
});

gt.test('filter by country and device', function () {
  var testers = load();
  var filtered = testers.filterByCountry('US')
    .filterByDevice('iphone 4');
  gt.equal(filtered.length(), 2, 'two US testers have iphone 4');
});

gt.test('have rating for phones', function () {
  var testers = load().filterByDevice('ALL');
  gt.equal(testers.length(), 9, '9 testers');
  gt.ok(testers.testers[0].bugs >= testers.testers[1].bugs,
    'testers are sorted in descending order');
  var first = testers.testers[0];
  gt.equal(first.bugs, 125, 'best tester files a lot of bugs on all devices');
  gt.ok(check.isArray(testers.values()));
});

gt.test('find by country ALL with white space', function () {
  var testers = load(filename);
  var found = testers.filterByCountry(' ALL ');
  gt.equal(found.length, testers.length, 'all should match');
});

gt.test('find by country GB with white space', function () {
  var testers = load(filename);
  var found = testers.filterByCountry('  GB   ');
  gt.equal(found.length(), 3, '3 testers in GB');
});