var check = require('check-types');
var fs = require('fs');
var eol = '\n';

function loadTesters(filename) {
  check.verifyString(filename, 'missing filename');
  var content = fs.readFileSync(filename, 'utf-8');
  check.verifyString(content, 'missing content from ' + filename);
  var lines = content.split(eol);
  console.assert(lines.length > 1, 'invalid number of lines ' +
    lines.length + ' in file ' + filename);

  var columns = getColumns(lines[0]);
  var testers = [];
  lines.forEach(function (line, index) {
    if (index === 0) {
      return; // we already have columns
    }
  });

  return testers;
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
    return word.replace('"', '');
  });
}

module.exports = loadTesters;