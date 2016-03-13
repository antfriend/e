
# folksonomy

a rapid taxonomy, folksonomy builder

    // *~~-
    // *~~- folksy.start() launches a web api to access and use your folksonomy
    // *~~- and launches a CLI for you to build your folksonomy
    // *~~- folksonomy remembers all
    // *~~-
    var folksy = require('folksonomy');
    folksy.start();

start entering your taxonomy terms
like:
>a bat _isa mamal

is stored as

"subject": "a bat",
"predicate": "_isa",
"object": "mamal"

questions end in a "?" will elicit a response

>what _isa mamal?
>>a bat

the underscore "_" starts a predicate.  A space ends a predicate.
