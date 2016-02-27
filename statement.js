/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
//
//folksonomy root
//

var pr = require('./primary_representation.json');
var expert = require('expert'),
    _ = require('underscore');

var domain = expert.Domain(),
    Concept = domain.Concept,
    Relation = domain.Relation;

var randoSponse = [
    "ok",
    "thank you",
    "you said it",
    "fascinating...",
    "you can say that again"
];

function random(low, high) { //does not include 'high'
    return Math.floor(Math.random() * (high - low) + low);
}

function randOreply() {
    var the_number = random(0, randoSponse.length);
    var the_response = randoSponse[the_number];
    return '>>' + the_response;
}

function tokenResponse(folksy) {
    //last token prTokens.tokens[prTokens.tokens.length - 1];
    // console.log('--' + prTokens.tokens[0] + '--')
    if (folksy.tokens.length === 1) {
        if (folksy.tokens[0] === 'exit') {
            return 'exit';
        }
    }

    //if there is a predicate
    // var pi = folksy.predicateIndex();
    // if (pi) {
    //     console.log('predicate index is ' + pi);
    // }
    return randOreply();
}
exports.tokenResponse = tokenResponse;


// for (var i = 0, len = pr_tokens.tokens.length; i < len; i++) {
//     //
//     if (i === len - 1) //this is the last iteration
//     {
//         if (pr_tokens.question === true) {
//             response_message = pr.tokens[0] + '?';
//         } else {
//             response_message = pr.tokens[i];
//         }
//     } else { //this is every iteration except the last
//         console.log('working on ' + pr.tokens[i]);
//     }
// }
