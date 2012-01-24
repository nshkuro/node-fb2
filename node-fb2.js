var Parser = require('./lib/parser.js');

module.exports.parse = function(filepath, encoding, callback) {
  var fb2
    , result;
  if (typeof encoding == 'function') {
    fb2 = new Parser();
    // if arg is function then this callback and encoding is undefined
    result = fb2.parse(filepath, encoding);
  } else {
    fb2 = new Parser(encoding);
    result = fb2.parse(filepath, callback);
  }
  return result;
}