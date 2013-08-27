var path = require('path');
var load = require('../load-devices');

gt.module('load devices');

gt.test('basics', function () {
  gt.arity(load, 2, 'number of arguments');
});

gt.test('load test data', function () {
  var devices = load();
  gt.defined(devices, 'loaded devices');
  gt.equal(devices.length(), 10, 'should have 10 devices');
  gt.equal(devices.devices[0].deviceId, '1', 'id is correct');
  gt.equal(devices.devices[0].description, 'iPhone 4');
});

gt.test('find Galaxy', function () {
  var devices = load();
  var found = devices.filterByDescription(['Galaxy S3', 'Galaxy S4']);
  gt.equal(found.length(), 2, '2 Galaxy phone models');
});

gt.test('all devices', function () {
  var devices = load();
  var found = devices.filterByDescription(['all']);
  gt.equal(found.length(), 10);
});

gt.test('all devices as string', function () {
  var devices = load();
  var found = devices.filterByDescription('ALL');
  gt.equal(found.length(), 10);
});

gt.test('find Galaxy (with spaces)', function () {
  var devices = load();
  var found = devices.filterByDescription([' Galaxy S3', '  Galaxy S4  ']);
  gt.equal(found.length(), 2, '2 Galaxy phone models');
});