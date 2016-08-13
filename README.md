
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
>a bat _isa mammal

is stored as

   "subject": "a bat",
   "predicate": "_isa",
   "object": "mammal"

questions end in a "?" will elicit a response

>what _isa mammal?
>>a bat

the underscore "_" starts a predicate.  A space ends a predicate.

>I _am_like myself
>I _am me
>I _am what I am
>what _am I?
>>[try it to find out]
>what _am what I am?
>>[try it to find out]

returns ... find out for yourself!