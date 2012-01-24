var fs = require('fs');
var libxmljs = require("libxmljs");

var Parser = function(ecoding) {
  this.encoding = ecoding || 'utf-8';
}

Parser.prototype = {
  parse: function(path, cb) {
    var self = this;
    var encoding = self.encoding;

    fs.readFile(path, encoding, function(err, data) {
      if (!err) {

        var book
          , firstName
          , lastName
          , genre
          , id
          , bookTitle
          , annotation
          , date
          , nameSpace = {FictionBook: 'http://www.gribuser.ru/xml/fictionbook/2.0'}
          , info = {};

        book = libxmljs.parseXmlString(data);

        firstName = book.get('//FictionBook:first-name', nameSpace).text();
        lastName = book.get('//FictionBook:last-name', nameSpace).text();
        genre = book.get('//FictionBook:genre', nameSpace).text();
        date = book.get('//FictionBook:date', nameSpace).text();
        bookTitle = book.get('//FictionBook:book-title', nameSpace).text();
        annotation = book.get('//FictionBook:annotation', nameSpace).text();
        id = book.get('//FictionBook:id', nameSpace).text();

        info.firstName = firstName;
        info.lastName = lastName;
        info.genre = genre;
        info.date = date;
        info.bookTitle = bookTitle;
        info.annotation = annotation;
        info.id = id;
        cb(null, info);
      } else {
        cb(err);
        console.log(err);
      }
    });
  }
}

module.exports = Parser;