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
var _approot = "/folksonomy";

function root_handler(req, res) {
    var blarg = {
        "folksonomy": "http://localhost:404/folksonomy",
        "log": "http://localhost:8983/solr/folksonomy/browse"
    };
    res.send(blarg);
}
app.get('/', root_handler);
app.get(_approot, function (req, res) {
    var my_root = "http://localhost:" + pak.port + _approot;
    var blarg = {
        "concepts": my_root + "/concepts",
        "settings": my_root + "/settings"
    };
    res.send(blarg);
});

app.get(_approot + '/settings', function (req, res) {
    res.send(pak);
});
app.get(_approot + '/concepts', return_concepts);

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

function start_with_app(folksonomy, newapp) {
    app = newapp;
    //start(folksonomy);
    _folksonomy = folksonomy;
}
exports.start_with_app = start_with_app;