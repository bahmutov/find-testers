var check = require('check-types');
var fs = require('fs');
var eol = '\n';

function Testers (filename) {
  this.testers = [];

  check.verifyString(filename, 'missing filename');
  var content = fs.readFileSync(filename, 'utf-8');
  check.verifyString(content, 'missing content from ' + filename);
  var lines = content.split(eol);
  console.assert(lines.length > 1, 'invalid number of lines ' +
    lines.length + ' in file ' + filename);

  var columns = getColumns(lines[0]);
  lines.forEach(function (line, index) {
    if (index === 0) {
      return; // we already have columns
    }

    var tester = {};
    var values = getColumns(line);
    values.forEach(function (value, columnIndex) {
      tester[columns[columnIndex]] = value;
    });
    this.testers.push(tester);
  }, this);
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

function getColumns(line) {
  check.verifyString(line, 'missing header line');
  var columns = line.split(',');
  console.assert(columns.length > 1, 'invalid columns ' +
    JSON.stringify(columns) + ' from line ' + line);
  columns = stripQuotes(columns);
  return columns;
}

function stripQuotes(words) {
  check.verifyArray(words, 'missing an array');
  return words.map(function (word) {
    check.verifyString(word, 'expected string, found ' + word);
    word = word.trim();
    return word.replace(/"/g, '');
  });
}

module.exports = loadTesters;