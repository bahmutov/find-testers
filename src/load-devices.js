var check = require('check-types');
var csvLoad = require('csv-load-sync');
var path = require('path');

function Devices(filename) {
  this.devices = csvLoad(filename);
}

Devices.prototype.length = function () {
  return this.devices.length;
};

function load(filename) {
  filename = filename || path.join(__dirname, '../data/devices.csv');
  return new Devices(filename);
}

module.exports = load;