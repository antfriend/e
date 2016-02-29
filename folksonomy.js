/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
//
//port of entry for building and querying a folksonomy
//accepts a statement or question and returns a reply
//input can be a string of terms, for use in a web interface, or the accompanying (start.js) interactive console
//

var pr = require('./primary_representation.json'),
    statement = require('./statement.js'),
    question = require('./question.js'),
    q = require("q"),
    expert = require('expert'),
    _ = require('underscore');
    
var domain   = expert.Domain(),
    Concept  = domain.Concept,
    Relation = domain.Relation;

var i_am = this;
var concepts = [];
var predicates = [];

function get_concepts(){
    return concepts;
}

function get_predicates(){
    return predicates;
}

function get_predicateById(id){
    var array = predicates;
    for (var index = 0; index < array.length; index++) {
        var element = array[index];
        if(element.id === id)
        {
            return element;
        }
    }
    return null;
}

function get_conceptById(id){
    var array = concepts;
    for (var index = 0; index < array.length; index++) {
        var element = array[index];
        if(element.id === id)
        {
            return element;
        }
    }
    return null;
}

function add_concept_if_new(the_concept)
{
    concepts.push(the_concept);
}

function add_predicate_if_new(the_predicate)
{
    predicates.push(the_predicate);
}

//take a string, return a string
function string_to_promise(the_string) {
    var uhmDeferred = q.defer();
    var string_arr = the_string.split(" ");
    process_arguments_inny(string_arr, false, function(the_response) {
        uhmDeferred.resolve(the_response);
    });
    return uhmDeferred.promise;
}

//start from an array of terms for console or other use
function process_arguments_inny(argumentatitves, console_or_not, callback) {
    var start_position = 0;
    if (console_or_not) {
        start_position = 2; //ignore the first two in the array for cmd args
    }
    pr.tokens.length = 0; //clear the array
    for (var i = start_position, len = argumentatitves.length; i < len; i++) {
        if (i === len - 1) //this is the last iteration
        {
            if (argumentatitves[i].endsWith('?')) {
                pr.question = true;
                var justme = argumentatitves[i].substring(0, argumentatitves[i].length - 1);
                pr.tokens.push(justme);
            } else {
                pr.question = false;
                pr.tokens.push(argumentatitves[i]);
            }
        } else { //this is every iteration except the last
            pr.tokens.push(argumentatitves[i]);
        }
    }
    process_tokens(function(response_message) {
        callback(response_message);
    });
}

function process_tokens(callback) {
    var response_object = {};
    if (pr.tokens) {
        if (pr.question === false) {
            response_object = statement.tokenResponse(pr,i_am);
        } else {
            response_object = question.tokenResponse(pr,i_am);
        }
    }
    
    callback(response_object.message);
}

exports.string_to_promise = string_to_promise;
exports.get_concepts = get_concepts;
exports.get_predicates = get_predicates;
exports.add_concept_if_new = add_concept_if_new;
exports.add_predicate_if_new = add_predicate_if_new;
exports.get_predicateById = get_predicateById;
exports.get_conceptById = get_conceptById;