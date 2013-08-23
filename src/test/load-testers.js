var path = require('path');
var load = require('../load-testers');

gt.module('load testers');

var filename = path.join(__dirname, 'testers.csv');

gt.test('load test data', function () {
  gt.arity(load, 1, 'load takes single argument');
  var testers = load(filename);
  gt.defined(testers, 'loaded testers');
  gt.equal(testers.length, 9, 'should have 9 testers');
  gt.equal(testers[0].testerId, '1', 'id is correct');
  gt.equal(testers[0].firstName, 'Miguel', 'first name');
  gt.equal(testers[8].lastName, 'Thiagarajan', 'last name');
});

gt.test('find by country ALL', function () {
  var testers = load(filename);
  gt.func(testers.filterByCountry, 'filterByCountry');
  var found = testers.filterByCountry('ALL');
  gt.equal(found.length, testers.length, 'all should match');
});