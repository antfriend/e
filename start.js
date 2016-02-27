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
    "Hello",
    "And now for something completely different",
    "Greetings Sentient!"
];

function random(low, high) { //does not include 'high'
    return Math.floor(Math.random() * (high - low) + low);
}

function randOgreeter() {
    var numb = random(0, randOgreetings.length);
    var something = randOgreetings[numb];
    return something;
}

var incromonitor = 0;

function loop(the_prompt) {
    incromonitor++;
    //console.log(incromonitor)
    console.log(the_prompt);
    rl.question('>', (the_response) => {

        folk.string_to_promise(the_response)
        .then(function(new_prompt){
            if (new_prompt === 'exit') {
                console.log('exiting, thank you for such a nice time!');
                rl.close();
                process.exit(0);
            }
            loop(new_prompt);
            //return the_response;
        });

 

    });
}

b.box1('rapid\rfolksonomy\rbuilder');
b.box1('"Ctrl+c" to end\rend with a "?" to make a question\rotherwise, just enter a statement');
loop('*** ' + randOgreeter() + ' ***');
