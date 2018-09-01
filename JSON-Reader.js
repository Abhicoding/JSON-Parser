var parser = require('./json_parser.js') 

var fs = require("fs");
fs.readFile("./Test/JSONfile1.js", 'utf-8', function (err, data) {
    if (err) throw err;
    if (parser.parse(data) === null) return `Couldn't parse`
});

fs.readFile("./Test/JSONfile2.js", 'utf-8', function (err, data) {
    if (err) throw err;
    if (parser.parse(data) === null) return `Couldn't parse`
});

fs.readFile("./Test/test.js", 'utf-8', function (err, data) {
    if (err) throw err;
    if (parser.parse(data) === null) return `Couldn't parse`
});