/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
// *~~-
// *~~- the folksonomy website
// *~~- 
var pak = require('../package.json'),
    express = require('express');
var app = express();
var _folksonomy = {};

app.get('/settings', function (req, res) {
    res.send(pak);
});
app.get('/concepts', return_concepts);

function return_concepts(req, res) {
    var cs = _folksonomy.get_concepts();
    res.send(cs);
}

function start(folksonomy) {
    _folksonomy = folksonomy;
    // start ///////////////////////////////
    app.listen(pak.port);
    console.log(
        '//////////////////////////////////////////////////////////////////');
    console.log('// ' + pak.name + ' Version ' + pak.version +
    ' is now listening on port ' + pak.port + ', patiently. //');
    console.log(
        '//////////////////////////////////////////////////////////////////');

}
exports.start = start;