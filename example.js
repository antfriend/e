// *~~-
// *~~- a CLI that lets you enter statements and ask questions
// *~~- folksonomy remembers all
// *~~-

var folksy = require('folksonomy'),
    colors = require('colors'),
    b = require('cmd_style'),
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
        folksy.string_to_promise(line.trim())
            .then(function (new_prompt) {
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

CLI_loop('*** ' + randOgreeter() + ' ***');