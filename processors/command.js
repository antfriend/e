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
    if (the_command === 'folksonomy') {
        var return_message = {
            "message": "FOLKSONOMY",
            "type": folksy.type.object,
            "object": {
                "concepts": folksy.get_concepts(),
                "predicates": folksy.get_predicates()
            }
        };
        //if this is the only command
        if (pr.tokens.length === 1) {
            //return everything

            return return_message;
        } else {
            //handle the command
            

            return_message.message = "ha ha, you said, " + pr.tokens[1];
            return return_message;

        }
    } else {
        try {
            return {
                
                "message": "ha ha, you said, " + the_command
            };

        } catch (error) {
            return {
                "type": folksy.type.error,
                "message": "ha ha, you said, " + the_command
            };
        }
    }
}
exports.tokenResponse = tokenResponse;
