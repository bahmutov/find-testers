var path = require('path');

gt.module('load bugs');
var load = require('../load-bugs');

gt.test('tester on device', function () {
  var filename = path.join(__dirname, 'bugs_small.csv');
  var bugs = load(filename);
  gt.arity(bugs.bugsDetected, 2);
  var count = bugs.bugsDetected('4', '1');
  gt.equal(count, 2, 'tester 4 detected 2 bugs on device 1');
});

gt.test('load all bugs', function () {
  var bugs = load();
  gt.equal(bugs.length, 1000, '1000 bugs total');
});