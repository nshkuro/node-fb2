var fs = require('fs');
var { XMLParser } = require('fast-xml-parser');

var Parser = function(ecoding) {
  this.encoding = ecoding || 'utf-8';
}

function extractText(node) {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join(' ');
  if (typeof node === 'object') {
    var parts = [];
    for (var key in node) {
      if (key.charAt(0) !== ':') {
        parts.push(extractText(node[key]));
      }
    }
    return parts.join(' ');
  }
  return '';
}

Parser.prototype = {
  parse: function(path, cb) {
    var self = this;
    var encoding = self.encoding;

    fs.readFile(path, encoding, function(err, data) {
      if (!err) {
        var parser = new XMLParser({ removeNSPrefix: true });
        var doc = parser.parse(data);

        var titleInfo = doc.FictionBook.description['title-info'];
        var docInfo = doc.FictionBook.description['document-info'];
        var info = {};

        info.firstName = titleInfo.author['first-name'];
        info.lastName = titleInfo.author['last-name'];
        info.genre = titleInfo.genre;
        info.date = titleInfo.date;
        info.bookTitle = titleInfo['book-title'];
        info.annotation = extractText(titleInfo.annotation);
        info.id = docInfo.id;
        cb(null, info);
      } else {
        cb(err);
        console.log(err);
      }
    });
  }
}

module.exports = Parser;
