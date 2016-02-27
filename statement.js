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

function randOreply() {
    return '>>' + randoSponse[0];
}

function tokenResponse(prTokens) {
    //last token prTokens.tokens[prTokens.tokens.length - 1];
    // console.log('--' + prTokens.tokens[0] + '--')
    if (prTokens.tokens.length === 1) {
        if (prTokens.tokens[0] === 'exit') {
            return 'exit';
        }
    }

    //if there is a predicate
    var pi = prTokens.predicateIndex();
    if (pi) {
        console.log('predicate index is ' + pi);
    }

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
