 /*jslint node: true */
/*jshint esversion: 6 */
"use strict";
//
// luv2crawl loves to crawl web pages!
// give an array of urls to the crawlHere(urls) function - give it a new array to cancel a run in progress
// and handle the results in the hereWeAre(url) function
//
var getjson = require('../getjson.js');

var countDownFrom = 3;
var countDown = countDownFrom;

var mod = {
    log: function log(message) {
        //replace this public function with your own if you want something else
        console.log(message);
    }
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ! concepts, what a concept !
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!
var concepticons = {
    unique_ids: {},
    ids_queue: [],
    countOfRemaining: 0
};

// <><><><><><><>
// <> requests <>
// <><><><><><><>
var requests = {
    areoptimized: false,
    optimizationInProgress: false,
    maxPendingMaximum: 20,
    pending: 0,
    addedSoFar: 0,
    maxAddedSoFarMaximum: 500 //concepts to add before a solr commit
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// the spider's beating heart
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var heart = {
    i: {},
    callMeDarling: function () { },
    beat: 10,//milliseconds of delay
    start: function (callmeback) {
        heart.callMeDarling = callmeback;
        heart.i = setInterval(function () {
            heart.callMeDarling();
        }, heart.beat);
        //return heart.i;
    },
    stop: function () {
        clearInterval(heart.i);
    }
};

///////////////////////////////////////////////////////
/// timer tracks and reports the total run duration ///
///////////////////////////////////////////////////////
var timer = {
    hrstart: {},
    start: function () {
        this.hrstart = process.hrtime();
        mod.log('starting ...');
    },
    stop: function () {
        var hrend = process.hrtime(this.hrstart);
        var my_message = "Execution time (m ms): " + hrend[0] / 60 +
            " " +
            hrend[1] / 1000000;
        mod.log(my_message);
        //console.info();
    }
};

function addIfnew(url) {
    if (concepticons.unique_ids[url]) {
        return;
    }
    concepticons.unique_ids[url] = true;
    concepticons.ids_queue.push(url);
    concepticons.countOfRemaining++;
}

function pulse() {
    if (requests.maxAddedSoFarMaximum <= requests.addedSoFar) {
        stats('coffee break ...');
        theQueueIsEmpty();
    }
    if (concepticons.countOfRemaining === 0) {
        //mod.log('the end is near ');
        stats('the end is near ');
        theQueueIsEmpty();
    } else {
        if (requests.pending < requests.maxPendingMaximum) {
            pullFromTheQueueAndWhatNot();
        } else {
            //mod.log('maximum velocity attained ');
        }
    }
}

function pullFromTheQueueAndWhatNot() {
    //**********************************************
    //* If the queue is empty, start to count down *
    //* until done.
    //**********************************************
    if (pullFromTheQueue()) {
        countDown = countDownFrom;//reset the countdown in case it had started
    } else {
        mod.log(' counting down');
        countDown--;
        if (countDown > 0) {
            stats('pullFromTheQueueAndWhatNot, false === pullFromTheQueue()');
        } else {
            if (concepticons.countOfRemaining === 0) {
                done();
            } else {
                doneWithError('Error! not all requested concepts were indexed - perhaps the prototaxonomy or solr services are hung up?');
            }
        }
    }
}

function stats(message) {
    mod.log(message);
    mod.log(Object.keys(concepticons.unique_ids).length + ' urls indexed');
    mod.log(concepticons.countOfRemaining + ' urls remaining');
    mod.log(concepticons.ids_queue.length + ' urls ids_queue');
    mod.log(requests.pending + ' requests pending');
    mod.log(requests.addedSoFar + ' requests addedSoFar');
}

function initialize() {
    heart.stop();
    concepticons.unique_ids = {};
    concepticons.ids_queue.length = 0;
    concepticons.countOfRemaining = 0;

    requests.areoptimized = false;
    requests.optimizationInProgress = false;
    requests.pending = 0;
    requests.addedSoFar = 0;

    timer.start();

}

function resultsHere(callMeBack) {
    thecallMeBack = callMeBack;
}

var thecallMeBack = function(results) {
    
}

function gotThis(result) {
    thecallMeBack(result);
}

function gotThisError(error) {
    doneWithError(error);
}

function pullFromTheQueue() {
    //get a concept id off the queue
    var theId = concepticons.ids_queue.shift();
    if (theId === undefined) {
        //then we are done with everything so far
        //so let's commit -- 
        theQueueIsEmpty();
        return false;
    } else {
        //mod.log(ids_queue.length + ' more to be indexed');
        getUrl(theId);
        return true;
    }
}

function getUrl(url) {
    requests.pending++;
    getjson.getJSON(url).then(
        function success(theData) {
            concepticons.countOfRemaining--;
            requests.pending--;
            requests.areoptimized = false;//dirty bit - a new document has been added, so solr will need to commit
            requests.addedSoFar++;
            gotThis(theData);
        },
        function failed(error) {
            mod.log("Got an error: ", error);
            gotThisError(error);
        }).catch(function (err) {
        mod.log("Got an err: ", err);
        gotThisError(err);
    });
}

function theQueueIsEmpty() {
    //wait for the pending requests to all come back
    if (heart.callMeDarling === pulse) {
        heart.stop();
        mod.log(requests.pending + ' requests pending as the pulse is stopped');

        if (requests.pending > 0) {
            heart.start(theQueueIsEmpty);
        }
    }
    //check for the pending requests to all come back
    if (requests.pending < 1) {
        heart.stop();
        mod.log(requests.pending + ' requests pending');
        optimize(function () {
            //mod.log('committed');
            requests.addedSoFar = 0;
            //heart.stop();
            heart.start(pulse);
                //pulse(shortWaitTime);
        });
    }
}

function stopForAMoment(next) {
    //optimize or other thing here
    //must call a callback
    next();
}

function optimize(callback) {
    if (requests.areoptimized === false && requests.optimizationInProgress === false) {
        mod.log('optimizing ...');
        requests.optimizationInProgress = true;
        stopForAMoment(function () {
            requests.areoptimized = true; //clear the dirty bit
            requests.optimizationInProgress = false;
            callback();
        });
    } else {
        done();
    }
}

function finished() {
    //replace this method with your own
}

function finishedWithError() {
    //replace this method with your own
}

function done() {
    mod.log('all done! ');
    timer.stop();
    finished();
}

function doneWithError(message) {
    mod.log(message);
    timer.stop();
    finishedWithError(message);
}

exports.crawlHere = function (urls) {
    //urls is an array of urls to get things started
    initialize();//reset stuff for the new crawl
    for (var j = 0; j < urls.length; j++) {
        addIfnew(urls[j]);
    }
    heart.start(pulse);//starts the crawling
}
////////////////
exports.mod = mod;
exports.callBackFunctionTakesResult = resultsHere;
exports.finished = finished;
exports.finishedWithError = finishedWithError;
exports.stopForAMoment = stopForAMoment;
exports.addIfnew = addIfnew;