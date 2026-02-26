var assert = require('assert');
var path = require('path');
var fb2 = require('../node-fb2');

var fixturePath = path.join(__dirname, 'fixtures', 'sample.fb2');

var passed = 0;
var failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('  OK: ' + name);
  } catch (err) {
    failed++;
    console.log('  FAIL: ' + name);
    console.log('    ' + err.message);
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

  console.log('\nResults: ' + passed + ' passed, ' + failed + ' failed');

  if (failed > 0) {
    process.exit(1);
  }
});

// Test with explicit encoding
fb2.parse(fixturePath, 'utf-8', function(err, info) {
  if (err) {
    console.log('Parse with encoding error:', err);
    process.exit(1);
  }

  test('works with explicit encoding', function() {
    assert.strictEqual(info.firstName, 'John');
    assert.strictEqual(info.bookTitle, 'Fiction Book');
  });
});
