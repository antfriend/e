/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
//
//folksonomy console interface
//

var b = require('cmd_style');
require('./primary_representation.json');
var folk = require('./folksonomy.js');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

b.box1('rapid\rfolksonomy\rbuilder');
b.box1('"exit" to end\rend with a "?" to make a question\rotherwise, just enter a statement');
loop('hello ');

function loop(the_question) {
    console.log('*' + the_question);
    rl.question('>', (answer) => {
        folk.process_tokens(folk.string_to_pr(answer), function(response_message) {
            if (response_message === 'exit') {
                console.log('exiting, thank you for such a nice time!');
                rl.close();
            } else {
                loop(response_message);
            }
        });
    });
}
