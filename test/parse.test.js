var assert = require('assert');
var path = require('path');
var fb2 = require('../node-fb2');

var fixturePath = path.join(__dirname, 'fixtures', 'sample.fb2');

var total = 0;
var failures = [];

function test(name, fn) {
  total++;
  try {
    fn();
    console.log('  OK: ' + name);
  } catch (err) {
    failures.push(name);
    console.log('  FAIL: ' + name);
    console.log('    ' + err.message);
  }
}

function reportAndExit() {
  var passed = total - failures.length;
  console.log('\nResults: ' + passed + ' passed, ' + failures.length + ' failed');
  if (failures.length > 0) {
    process.exit(1);
  }
}

var pending = 2;

function done() {
  pending--;
  if (pending === 0) {
    reportAndExit();
  }
}

console.log('node-fb2 tests\n');

fb2.parse(fixturePath, function(err, info) {
  if (err) {
    console.log('Parse error:', err);
    process.exit(1);
  }

  test('extracts firstName', function() {
    assert.strictEqual(info.firstName, 'John');
  });

  test('extracts lastName', function() {
    assert.strictEqual(info.lastName, 'Doe');
  });

  test('extracts genre', function() {
    assert.strictEqual(info.genre, 'fiction');
  });

  test('extracts bookTitle', function() {
    assert.strictEqual(info.bookTitle, 'Fiction Book');
  });

  test('extracts date', function() {
    assert.strictEqual(info.date, '18.07.2011');
  });

  test('extracts annotation as plain text', function() {
    assert.ok(info.annotation.indexOf('This is a test annotation.') !== -1);
  });

  test('extracts id', function() {
    assert.strictEqual(info.id, 'test-book-id-123');
  });

  done();
});

fb2.parse(fixturePath, 'utf-8', function(err, info) {
  if (err) {
    console.log('Parse with encoding error:', err);
    process.exit(1);
  }

  test('works with explicit encoding', function() {
    assert.strictEqual(info.firstName, 'John');
    assert.strictEqual(info.bookTitle, 'Fiction Book');
  });

  done();
});
