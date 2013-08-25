var check = require('check-types');
var csvLoad = require('csv-load-sync');
var path = require('path');
var allToUpperCase = require('./utils').allToUpperCase;
var set = require('./utils').set;
var loadDevices = require('./load-devices');

var testerToDevice = csvLoad(path.join(__dirname, '../data/tester_device.csv'));
console.assert(testerToDevice.length > 0, 'could not load tester to device');

function hasDevice(devices) {
  check.verifyString(this.testerId, 'missing tester id');

  return false;
}

function Testers(filename) {
  this.testers = csvLoad(filename);

  this.testers.forEach(function (tester) {
    tester.devices = {};
    testerToDevice.forEach(function (t2d) {
      if (t2d.testerId === tester.testerId) {
        tester.devices[t2d.deviceId] = true;
      }
    });
  });

  this.testers.forEach(function (tester) {
    tester.hasDevice = hasDevice;
  });
}

Testers.prototype.length = function () {
  return this.testers.length;
};

Testers.prototype.filterByCountry = function (names) {
  if (check.isString(names)) {
    names = [names];
  }
  check.verifyArray(names, 'expected array of countries');

  names = allToUpperCase(names);
  if (names.length === 1 && names[0] === 'ALL') {
    return this;
  }

  var countries = set(names);

  this.testers = this.testers.filter(function (tester) {
    return countries[tester.country.toUpperCase()];
  });
  return this;
};

Testers.prototype.filterByDevice = function (names) {
  var devices = loadDevices();
  console.assert(devices.length() > 0, 'loaded 0 devices');

  var acceptableDevices = devices.filterByDescription(names);
  var acceptableIds = set(acceptableDevices.devices, 'deviceId');

  this.testers = this.testers.filter(function (tester) {
    return Object.keys(tester.devices).some(function (deviceId) {
      return acceptableIds[deviceId];
    });
  });

  return this;
}

function load(filename) {
  filename = filename || path.join(__dirname, '../data/testers.csv');
  return new Testers(filename);
}

module.exports = load;