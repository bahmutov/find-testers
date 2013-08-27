var check = require('check-types');
var csvLoad = require('csv-load-sync');
var path = require('path');
var allToUpperCase = require('./utils').allToUpperCase;
var set = require('./utils').set;
var loadDevices = require('./load-devices');
var loadBugs = require('./load-bugs');

var defaultDataFolder = path.join(__dirname, '../data');

// common global data
var bugs = [];
var devices = [];
var testerToDevice = [];

function Testers(filename) {
  this.testers = csvLoad(filename);

  // attach device information
  this.testers.forEach(function (tester) {
    tester.devices = {};
    testerToDevice.forEach(function (t2d) {
      if (t2d.testerId === tester.testerId) {
        tester.devices[t2d.deviceId] = true;
      }
    });
  });
}

Testers.prototype.length = function () {
  return this.testers.length;
};

Testers.prototype.values = function () {
  return this.testers;
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
  console.assert(devices.length() > 0, 'loaded 0 devices');

  var acceptableDevices = devices.filterByDescription(names);
  var acceptableIds = set(acceptableDevices.devices, 'deviceId');

  this.testers = this.testers.filter(function (tester) {
    return Object.keys(tester.devices).some(function (deviceId) {
      return acceptableIds[deviceId];
    });
  });

  this.computeBugs();
  this.testers.sort(function (a, b) {
    return b.bugs - a.bugs;
  });

  return this;
};

Testers.prototype.computeBugs = function () {
  this.testers.forEach(function (tester) {
    tester.bugs = 0;
    var deviceIds = Object.keys(tester.devices);
    tester.bugs = deviceIds.reduce(function (sum, id) {
      return sum + bugs.bugsDetected(tester.testerId, id);
    }, 0);
  });
};

function loadTesterToDevice(dataFolder) {
  check.verifyString(dataFolder, 'missing data folder');
  var filename = path.join(dataFolder, 'tester_device.csv');
  testerToDevice = csvLoad(filename);
  console.assert(testerToDevice.length > 0, 'could not load tester to device');
}

function load(filename, dataFolder) {
  dataFolder = dataFolder || defaultDataFolder;
  devices = loadDevices(null, dataFolder);
  loadTesterToDevice(dataFolder);
  bugs = loadBugs(null, dataFolder);

  filename = filename || path.join(dataFolder, 'testers.csv');
  return new Testers(filename);
}

module.exports = load;