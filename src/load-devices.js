var check = require('check-types');
var csvLoad = require('csv-load-sync');
var path = require('path');
var allToUpperCase = require('./utils').allToUpperCase;
var set = require('./utils').set;

function Devices(filename) {
  this.devices = csvLoad(filename);
}

Devices.prototype.length = function () {
  return this.devices.length;
};

Devices.prototype.filterByDescription = function (names) {
  if (check.isString(names)) {
    names = [names];
  }
  check.verifyArray(names, 'expected array of names');

  names = allToUpperCase(names);
  if (names.length === 1 && names[0] === 'ALL') {
    return this;
  }

  var descriptions = set(names);

  this.devices = this.devices.filter(function (device) {
    return descriptions[device.description.toUpperCase()];
  });
  return this;
};

function load(filename) {
  filename = filename || path.join(__dirname, '../data/devices.csv');
  return new Devices(filename);
}

module.exports = load;