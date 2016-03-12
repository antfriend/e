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
    command = require('./command.js'),
    q = require("q"),
    expert = require('expert'),
    _ = require('underscore');

var domain = expert.Domain(),
    Concept = domain.Concept,
    Relation = domain.Relation;

var i_am = this; //possible strict violation?
var concepts = [];
var predicates = [];
var type = {
    "error": "error",
    "question": "question",
    "statement": "statement",
    "command": "command",
    "object": "object"
};

// **************************************************************************************
// * the main entry point for a string, returns a promise with an object.message string *
// **************************************************************************************
function string_to_promise(the_string) {
    var uhmDeferred = q.defer();
    the_string = the_string.trim();
    var string_arr = the_string.split(" ");
    process_arguments_inny(string_arr, false, function(the_response) {
        uhmDeferred.resolve(the_response);
    });
    return uhmDeferred.promise;
}

// ********************************************************************************************************
// * the secondary entry point, takes an array of words, returns a callback with an object.message string *
// * this does first order interpretation and creates the internally used primary_representation          *
// ********************************************************************************************************
function process_arguments_inny(argumentatitves, console_or_not, callback) {
    var start_position = 0;
    if (console_or_not) {
        start_position = 3; //ignore the first two in the array for cmd args
    }
    //clear the pr object state
    pr.tokens.length = 0; //clear the array
    pr.type = null;
    pr.message = "";

    for (var i = start_position, len = argumentatitves.length; i < len; i++) {
        if (i === start_position) //this is the first term, duh
        {
            if (this_is_a_keyword(argumentatitves[i])) {
                pr.type = type.command;
            }
        }
        if (i === len - 1) //this is the last iteration
        {
            if (argumentatitves[i].endsWith('?')) {
                if (pr.type !== type.command) {
                    pr.type = type.question;
                    //remove the ? from the last token
                    var justme = argumentatitves[i].substring(0, argumentatitves[i].length - 1);
                    pr.tokens.push(justme);
                } else { //it is a command - maybe we need that '?'
                    pr.tokens.push(argumentatitves[i]);
                }
            } else {
                if (pr.type !== type.command) {
                    pr.type = type.statement;
                }
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

// ************************************************************
// * routes the primary_representation to the correct handler *
// ************************************************************
function process_tokens(callback) {
    var response_object = {};
    if (pr.tokens) {
        if (pr.type === type.statement) {
            response_object = statement.tokenResponse(pr, i_am);
        }
        if (pr.type === type.question) {
            response_object = question.tokenResponse(pr, i_am);
        }
        if (pr.type === type.command) {
            response_object = command.tokenResponse(pr, i_am);
        }
        if (pr.tokens.length === 1) {
            //check if this is just an empty nothing
            if (pr.type !== type.command) //not an already recognized command
            {
                //if this is a really short token it is assumed to be garbage
                if (pr.tokens[0].length < 3) {
                    response_object = error_response();
                }
            }
        }
    } else {
        response_object = error_response();
    }
    callback(response_object);
}

function error_response() {
    return {
        "message": "what are you trying to say?",
        "type": "error"
    };
}

function this_is_a_keyword(the_word) {
    if (the_word === 'folksonomy') {
        return true;
    }
    return false;
}

function get_concepts() {
    return concepts;
}

function get_predicates() {
    return predicates;
}

function get_predicateById(id) {
    var array = predicates;
    for (var index = 0; index < array.length; index++) {
        var element = array[index];
        if (element.id === id) {
            return element;
        }
    }
    return null;
}

function get_conceptById(id) {
    var array = concepts;
    for (var index = 0; index < array.length; index++) {
        var element = array[index];
        if (element.id === id) {
            return element;
        }
    }
    return null;
}

function add_concept_if_new(the_concept) {
    concepts.push(the_concept);
}

function add_predicate_if_new(the_predicate) {
    predicates.push(the_predicate);
}

// ****************
// * other stuff  *
// ****************
function test(args) {
    //console.log('testing ' + args[3]);
    process_arguments_inny(args, true, function(response) {
        console.log(response.message);
    });
}

function cmd_test_startup() {
    var c = process.argv;
    if (c.length > 2) {
        if (c[2] === 'test') { //if started from the command line with the argument 'test' then the sample test script will run
            if (c.length > 3) {
                test(c);
            } else {
                console.log('use this command to enter a statement for processing ');
                console.log('for example: ');
                console.log('>node folksonomy test oranges _are_a fruit ');
            }
        }
    }
}

// ****************
// * public       *
// ****************
exports.string_to_promise = string_to_promise;
exports.get_concepts = get_concepts;
exports.get_predicates = get_predicates;
exports.add_concept_if_new = add_concept_if_new;
exports.add_predicate_if_new = add_predicate_if_new;
exports.get_predicateById = get_predicateById;
exports.get_conceptById = get_conceptById;
exports.type = type;

// ****************
// * cmd test     *
// ****************
cmd_test_startup(this);