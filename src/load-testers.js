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
  this.testers.forEach(addOwnedDevice);
}

function addOwnedDevice(tester) {
  tester.devices = {};
  testerToDevice.forEach(function (t2d) {
    if (t2d.testerId === tester.testerId) {
      tester.devices[t2d.deviceId] = true;
    }
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

  // remove any white space
  names = names.map(function (name) {
    return name.trim();
  });
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

  this.computeBugsByTester(acceptableIds);
  this.testers.sort(higherBugsFirst);

  return this;
};

function higherBugsFirst(a, b) {
  return b.bugs - a.bugs;
}

Testers.prototype.computeBugsByTester = function (allowedDeviceIds) {
  console.assert(allowedDeviceIds, 'missing acceptable device ids object');

  this.testers.forEach(function (tester) {
    tester.bugs = 0;
    var deviceIds = Object.keys(tester.devices);
    var onlyCountDeviceIds = deviceIds.filter(function (id) {
      return allowedDeviceIds[id];
    });

    tester.bugs = onlyCountDeviceIds.reduce(function (sum, id) {
      var n = bugs.bugsDetected(tester.testerId, id);
      return sum + n;
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