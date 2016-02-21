/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
//
//eg
//

var b = require('cmd_style');
var expert = require('expert'),
    _ = require('underscore');
var pr = require('./primary_representation.json');
var eg = require('./eg.js');
//var ConceptNet = require('concept-net');//https://www.npmjs.com/package/concept-net
//http://conceptnet5.media.mit.edu/data/5.4/c/en/toast
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

b.box1('ee\rg\rdeduce');
loop('hello ');

function loop(the_question) {
    console.log('*' + the_question);
    rl.question('>', (answer) => {
        //var pr_tokens = string_to_pr(answer);
        eg.process_tokens(eg.string_to_pr(answer), function(response_message) {
            if (response_message === 'exit') {
                console.log('exiting, thank you for such a nice time!');
                rl.close();
            } else {
                loop(response_message);
            }
        });
    }); //end rl.question
}
