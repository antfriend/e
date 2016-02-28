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
    return the_response;
}

function tokenResponse(pr) {
    //last token prTokens.tokens[prTokens.tokens.length - 1];
    // console.log('--' + prTokens.tokens[0] + '--')
    if (pr.tokens.length === 1) {
        if (pr.tokens[0] === 'exit') {
            return 'exit';
        }
    }

    //if there is a predicate
    var pi = predicateIndex(pr);
    if (pi) {
        if(pi === 0)
        {
            //this is an assertion about a predicate
            
        }else{
            var subject = nameOfTokensFromTo(pr,0,pi);
            var predicate  = pr.tokens[pi];
            if(pi === pr.tokens.length -1)
            {
                //no object
                return "i don't know what you are talking about";
            }
            var object = nameOfTokensFromTo(pr,pi+1,pr.tokens.length);
            return 's:' + subject + ' p:' + predicate + ' 0:' + object;
        }
    }
    return randOreply();
}
exports.tokenResponse = tokenResponse;

function nameOfTokensFromTo(pr, from, to)
{
    var the_result = '';
    var array = pr.tokens;
    for (var index = from; index < to; index++) {
        var element = array[index];
        the_result = the_result + element + ' ';
    }
    return the_result.trim();
}

function predicateIndex(pr) {
    //token index of the first token that begins with a predicate indicator
    var the_i = 999;
    for (var index = 0; index < pr.tokens.length; index++) {
        var element = pr.tokens[index];
        if(element[0] === '_')
        {
            the_i = index;
        }
    };
    if(the_i === 999)
    {
        return null;
    }else{
        return the_i;
    }
}


