/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
//
//questions! for answers!
//

var pr = require('./primary_representation.json');
var expert = require('expert'),
    _ = require('underscore'),
    statement = require('./statement.js');

var domain = expert.Domain(),
    Concept = domain.Concept,
    Relation = domain.Relation;

function tokenResponse(prTokens, folksy) {
    var the_command = pr.tokens[0];

    try {
        return {"message": "ha ha, you said, " + the_command};

    } catch (error) {
        return {"message": "ha ha, you said, " + the_command};
    }

}
exports.tokenResponse = tokenResponse;

