
# folksonomy

a rapid taxonomy, folksonomy builder
(in development - check back later)

to play with the interactive console, execute
>node start.js

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
