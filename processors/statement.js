/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
//
//folksonomy root
//

var pr = require('./primary_representation.json');
var expert = require('expert'),
    _ = require('underscore'),
    S = require('string'),
    solr = require('../solr/solr.js');

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

function tokenResponse(pr, folksy) {
    var message = "";
    if (pr.tokens.length === 1) {
        if (pr.tokens[0] === 'exit') {
            return {
                "message": "exit" //special exit message case
            };
        }
    }
    //if there is a predicate
    var pi = predicateIndex(pr);
    if (pi) {
        if (pi == 0) {
            //this is an assertion about a predicate
            message = "predicate " + pr.tokens[0] + ' affected';
            return {
                "message": message
            };
        } else {
            var subject = nameOfTokensFromTo(pr, 0, pi);
            var predicate = pr.tokens[pi];
            if (pi === pr.tokens.length - 1) {
                //no object
                message = "i don't know what you are talking about";
                return {
                    "message": message
                };
            }
            var object = nameOfTokensFromTo(pr, pi + 1, pr.tokens.length);
            var s = makeConcept(subject);
            var p = makeRelationship(predicate);
            var o = makeConcept(object);
            
            //add to the folksy context if new
            folksy.add_predicate_if_new(p);
            folksy.add_concept_if_new(o);
            folksy.add_concept_if_new(s);
            folksy.add_triple_if_new(o, p, s);

            message = 's:' + subject + ' p:' + predicate + ' o:' + object;
            var bottledMessage = {
                "message": message,
                "s": s,
                "p": p,
                "o": o
            };
            solrSync(bottledMessage);
            return bottledMessage;
        }
    } else {
        message = randOreply();
        return {
            "message": message
        };
    }
}

exports.tokenResponse = tokenResponse;

function solrSync(bottledMessage) {
    /*      var bottledMessage = {
                "message": message,
                "s": s,
                "p": p,
                "o": o
            };
    */
    //add this message to solr
    
    solr.flush([solr.formatStatementMessage(bottledMessage)], function(nay, yea) {
        if (nay) {
            console.log(nay);
        }
    });
}



function makeRelationship(naturalName) {
    var new_relationship = Relation.create({
        id: naturalName
    });
    return new_relationship;
}

function makeConcept(naturalName) {
    var new_concept = Concept.create({
        id: conceptName(naturalName)
    });
    return new_concept;
}

function conceptName(naturalName) {
    var step1 = naturalName.trim();
    //var step2 = step1.replace(' ', '_')
    var step2 = S(step1).chompRight('?').s;
    return step2;
}
exports.conceptName = conceptName;

function nameOfTokensFromTo(pr, from, to) {
    var the_result = '';
    var array = pr.tokens;
    for (var index = from; index < to; index++) {
        var element = array[index];
        the_result = the_result + element + ' ';
    }
    return the_result.trim();
}
exports.nameOfTokensFromTo = nameOfTokensFromTo;

function predicateIndex(pr) {
    //token index of the first token that begins with a predicate indicator
    var the_i = 999;
    for (var index = 0; index < pr.tokens.length; index++) {
        var element = pr.tokens[index];
        if (element[0] === '_') {
            the_i = index;
        }
    }
    if (the_i === 999) {
        return null;
    } else {
        return the_i;
    }
}

exports.predicateIndex = predicateIndex;
