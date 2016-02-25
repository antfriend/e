/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
//
//port of entry for building and querying a folksonomy
//accepts a statement or question and returns a reply
//input can be a string of terms, for use in a web interface, or the accompanying (start.js) interactive console
//or as arguments to this module on the command line
//

var pr = require('./primary_representation.json'),
    statement = require('./statement.js'),
    question = require('./question.js');

//start from a single string, for web or other use
function string_to_pr(the_string) {
    var string_arr = the_string.split(" ");
    return process_arguments(string_arr, false);
}
exports.string_to_pr = string_to_pr;

//start from an array of terms for console or other use
function process_arguments(argumentatitves, console_or_not) {
    var start_position = 0;
    if (console_or_not) {
        start_position = 2; //ignore the first two in the array for new cmd args
    } else {
        start_position = 0;
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
    return pr;
}

function process_tokens(pr_tokens, callback) {
    var response_message = '';
    if (pr_tokens.tokens) {
        if (pr_tokens.question === false) {
            response_message = statement.tokenResponse(pr_tokens);
        } else {
            response_message = question.tokenResponse(pr_tokens);
        }

    }
    callback(response_message);
}
exports.process_tokens = process_tokens;
