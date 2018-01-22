var parser = require('./json_parser.js') 

var fs = require("fs");

fs.readFile("./Test/JSONfile2.js", 'utf-8', function (err, data) {
    if (err) throw err;
    console.log(parser.parse(data));
});
