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
    var pi = statement.predicateIndex(pr);
    var predicate = pr.tokens[pi];

    var object = statement.nameOfTokensFromTo(pr, pi + 1, pr.tokens.length);
    var oname = statement.conceptName(object);

    var thisPred = folksy.get_predicateById(predicate);
    var thisConcept = folksy.get_conceptById(oname);
    try {
        var ans1 = thisPred(thisConcept);
        //var answer1 = whatHas(fur);
        var the_message = "";
        for (var i = 0; i < ans1.length; i++) {
            the_message+= ans1[i].id + ", ";
        }
        return {
            "message": the_message
        };
    } catch (error) {
        return {"message": "i can't answer that"};
    }

}
exports.tokenResponse = tokenResponse;
