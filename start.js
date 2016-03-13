/*jslint node: true */
/*jshint esversion: 6 */
"use strict";
// 
//folksonomy console interface
//
require('./primary_representation.json');
var express = require('express'),
    b = require('cmd_style'),
    folk = require('./folksonomy.js'),
    website = require('./server/site.js'),
    colors = require('colors'),
    readline = require('readline'),
    rl = readline.createInterface({
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

function CLI_loop(the_prompt) {
    rl.setPrompt('');
    rl.prompt();
    console.log(the_prompt.green);
    rl.on('line', (line) => {
        folk.string_to_promise(line.trim())
            .then(function(new_prompt) {
                if (new_prompt.type) {
                    if (new_prompt.type === folk.type.error) {
                        console.log(new_prompt.message.red);
                    }
                    if (new_prompt.type === folk.type.object) {
                        //parse the object
                        console.log(new_prompt.message.blue);
                        b.hr();
                        b.tree(new_prompt.object);
                    }
                } else {
                    if (new_prompt.message === 'exit') {
                        console.log('exiting, thank you for such a nice time!'.green);
                        rl.close();
                        process.exit(0);
                    }
                    console.log(new_prompt.message.green);
                }
            });
        rl.prompt();
    }).on('close', () => {
        console.log('Have a great day!'.green);
        process.exit(0);
    });
}

function start_console() {
    b.box1('rapid\rfolksonomy\rbuilder');
    b.box1('"Ctrl+c" to end\rend with a "?" to make a question\rotherwise, just enter a statement');
    CLI_loop('*** ' + randOgreeter() + ' ***');
}

function start() {

    website.start(folk);
    start_console();
}

function cmd_test_startup() {
    var the_argument_following_process_start_arguments = 3;
    var the_argument = 2;
    var c = process.argv;
    if (c.length === the_argument_following_process_start_arguments)//exactly one please
    {
        if (c[the_argument] === 'start') { //if started from the command line with the argument 'test' then the sample test script will run
            start();
        }
    }
}

exports.start = start;

// ****************
// * cmd test     *
// ****************
cmd_test_startup();
