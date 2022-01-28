/**
 * Exposes the log
 **/
var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var path = require('path');
var winston = require('winston');
var winstonMongo = require('winston-mongodb');

var origin = require('../../lib/application')();
var server = require('express')();

var COLLECTION_NAME = 'logs';
var DB_LOG_LENGTH = 2048; // in DB
var UI_LOG_LENGTH = 250; // in UI

function initialise(server) {
  async.series([
    loadSchema,
    addTransport,
    trimLogs
  ], function(error) {
    if(error) console.log(error);
  });
}

function loadSchema(cb) {
  fs.readFile(path.join(__dirname, 'log.schema'), function(error, data) {
    if(error) return cb(error);
    origin.db.addModel('log', JSON.parse(data), cb);
  });
}

function addTransport(cb) {
  origin.logger.add(new winston.transports.MongoDB({
    db: getDb(),
    collection: COLLECTION_NAME
  }));
  cb();
}

initialise();

function getDb() {
  var dbString = 'mongodb://';
  var user = origin.configuration.getConfig('dbUser');
  var pass = origin.configuration.getConfig('dbPass');

  if(user && pass) {
    dbString += user + ':' + pass + '@';
  }
  dbString += origin.configuration.getConfig('dbHost');
  dbString += ':' + origin.configuration.getConfig('dbPort');
  dbString += "/" + origin.configuration.getConfig('dbName');

  return dbString;
}

function getLogs(query, cb) {
  origin.db.retrieve('log', {}, query, cb);
}

function removeLogs(idsToRemove, cb) {
  async.each(idsToRemove, function(id, done) {
    origin.db.destroy('log', { _id: id }, done);
  });
}

// Trims DB logs to DB_LOG_LENGTH, removing oldest first
function trimLogs(cb) {
  getLogs({ operators: { sort: { timestamp: 1 } } }, function(error, logs) {
    if(error) return cb(error);
    if(logs && logs.length > DB_LOG_LENGTH) {
      var noToDelete = logs.length - DB_LOG_LENGTH;
      removeLogs(_.pluck(logs.slice(0, noToDelete), '_id'), cb);
    }
  });
};

server.get('/log', function (req, res, next) {
  getLogs({
    jsonOnly: true,
    operators: {
      sort: { timestamp: -1 },
      limit: UI_LOG_LENGTH
    }
  }, function(error, logs) {
    if(error) {
      return res.status(500).json(error.toString());
    }
    res.status(200).json(logs || []);
  });
});

module.exports = server;
