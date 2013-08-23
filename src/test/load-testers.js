var path = require('path');
var load = require('../load-testers');

gt.module('load testers');

var filename = path.join(__dirname, 'testers.csv');

gt.test('load test data', function () {
  gt.arity(load, 1, 'load takes single argument');
  var testers = load(filename);
  gt.defined(testers, 'loaded testers');
});