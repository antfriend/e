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

var randOgreetings = [
    "hello",
    "And now for something completely different"
];

function randOgreeter() {
    return randOgreetings[1];
}

var incromonitor = 0;

function loop(the_prompt) {
    incromonitor++;
    //console.log(incromonitor)
    console.log(the_prompt);
    rl.question('>', (the_response) => {

        folk.process_tokens(folk.string_to_pr(the_response), function(new_prompt) {
            if (new_prompt === 'exit') {
                console.log('exiting, thank you for such a nice time!');
                rl.close();
                process.exit(0);
            }
            loop(new_prompt);
        });
    });
}

b.box1('rapid\rfolksonomy\rbuilder');
b.box1('"Ctrl+c" to end\rend with a "?" to make a question\rotherwise, just enter a statement');
// rl.question('What is your favorite food?', (answer) => {
//     console.log(`Oh, so your favorite food is ${answer}`);
//     rl.close();
// });

loop('*** ' + randOgreeter() + ' ***');
