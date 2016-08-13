/*jslint node: true */
/*jshint esversion: 6 */
"use strict";

var solr = require('solr-client'),
    pak = require('../package.json');

var serverInst = pak.solr.serverInst;
var coreInst = pak.solr.coreInst;

exports.formatStatementMessage = function (bottledMessage)
{
    return {
        "id": JSON.stringify(bottledMessage.message)
    }
}

exports.flush = function (docs, callback) {
    var iclient = solr.createClient(serverInst, '8983', coreInst);
    iclient.autoCommit = false;
    iclient.add(docs, function (err, obj) {
        if (err) {
            callback(err, null);
        } else {
            iclient.commit(function (err, cres) {
                if (err) {
                    callback(err, null);
                } else {
                    var options = {
                        waitSearcher: true
                    };
                    iclient.optimize(options, function (err, obj) {
                        if (err) {
                            callback(err, null);
                        } else {
                            callback(null, obj);
                        }
                    });
                }
            });
        }
    });
};
