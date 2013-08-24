var check = require('check-types');
var csvLoad = require('csv-load-sync');

function Testers (filename) {
  this.testers = csvLoad(filename);
}

Testers.prototype.length = function () {
  return this.testers.length;
}

function allToUpperCase(items) {
  return items.map(function (item) {
    check.verifyString(item, 'expected string item');
    return item.toUpperCase();
  });
}

Testers.prototype.filterByCountry = function (names) {
  if (check.isString(names)) {
    names = [names];
  }
  check.verifyArray(names, 'expected array of countries');

  names = allToUpperCase(names);
  if (names.length === 1 && names[0] === 'ALL') {
    return this;
  }

  var countries = {};
  names.forEach(function (country) {
    countries[country] = true;
  });

  this.testers = this.testers.filter(function (tester) {
    return countries[tester.country.toUpperCase()];
  });
  return this;
}

function loadTesters(filename) {
  filename = filename || path.join(__dirname, '../data/testers.csv');
  return new Testers(filename);
}

module.exports = loadTesters;