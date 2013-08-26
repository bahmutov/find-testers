var check = require('check-types');
var loadTesters = require('./src/load-testers');

function find(countries, devices) {
  var testers = loadTesters();
  var inCountry = testers.filterByCountry(countries);
  var usedDevice = inCountry.filterByDevice(devices);
  return usedDevice.values();
}

module.exports = function findTesters (options) {
  console.log('finding testers');

  // input arguments
  options = options || {};
  var countries = options.country || options.countries || 'ALL';
  console.assert(check.isString(countries) ||
    check.isArray(countries), 'wrong country format ' + countries);

  return find(countries, devices);
};