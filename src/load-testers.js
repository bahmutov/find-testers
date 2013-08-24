var check = require('check-types');
var csvLoad = require('csv-load-sync');

function Testers (filename) {
  this.testers = csvLoad(filename);
}

Testers.prototype.length = function () {
  return this.testers.length;
}

Testers.prototype.filterByCountry = function (name) {
  name = name.toUpperCase();
  if (name === 'ALL') {
    return this;
  }

  this.testers = this.testers.filter(function (tester) {
    return tester.country.toUpperCase() === name;
  });
  return this;
}

function loadTesters(filename) {
  return new Testers(filename);
}

module.exports = loadTesters;