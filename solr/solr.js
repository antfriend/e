/*jslint node: true */
/*jshint esversion: 6 */
"use strict";

var solr = require('solr-client'),
    pak = require('../package.json');

var serverInst = pak.solr.serverInst;
var coreInst = pak.solr.coreInst;

String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

exports.formatStatementMessage = function (bottledMessage) {
    return {
        "id": bottledMessage.message,
        "timestamp_dt": 'NOW'
}
}

exports.flush = function (docs, callback) {
    if (!pak.solr.isRunning) {
        //callback(null, { "isRunning": false });
        callback(null, { "docs": docs });
        return;
    }
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
