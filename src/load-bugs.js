var path = require('path');
var check = require('check-types');
var csvLoad = require('csv-load-sync');

var bugs = null;

function bugsDetected(testerId, deviceId) {
  return this.reduce(function (sum, bug) {
    if (bug.testerId === testerId &&
      bug.deviceId === deviceId) {
      return sum + 1;
    } else {
      return sum;
    }
  }, 0);
}

function load(filename) {
  filename = filename || path.join(__dirname, '../data/bugs.csv');
  check.verifyString(filename, 'expected filename');

  bugs = csvLoad(filename);
  console.assert(bugs.length > 0, 'could not load bugs info');
  bugs.bugsDetected = bugsDetected.bind(bugs);
  return bugs;
}

module.exports = load;
