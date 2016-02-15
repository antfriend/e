/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
//
//eg
//

var pr = require('./primary_representation.json');

function string_to_pr(the_string) {
    var string_arr = the_string.split(" ");
    return process_arguments(string_arr, false);
}
exports.string_to_pr = string_to_pr;

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
//exports.process_cmd_arguments = process_arguments;

function process_tokens(pr_tokens, callback) {
    var response_message = '';
    if (pr_tokens.tokens) {
        for (var i = 0, len = pr_tokens.tokens.length; i < len; i++) {
            if (i === len - 1) //this is the last iteration
            {
                if (pr_tokens.question === true) {
                    //pr_tokens.tokens[0];
                    response_message = pr.tokens[0] + '?';
                } else {
                    response_message = pr.tokens[i];
                }
            } else { //this is every iteration except the last
                //console.log('working ... ');
            }
        }
    }
    callback(response_message);
}
exports.process_tokens = process_tokens;



// function preprocess_term(this_term)
// {
//     return this_term;
// }

// function interpret_statement(these_terms)
// {

// }

// function interpret_question(these_terms)
// {

// }
