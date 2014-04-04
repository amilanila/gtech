var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

JobService = function(host, port) {
  this.db= new Db('gtech', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


JobService.prototype.getCollection= function(callback) {
  this.db.collection('job', function(error, job_collection) {
    if( error ) {
      callback(error);
    } else {
      callback(null, job_collection);
    }
  });
};

//find all jobs
JobService.prototype.findAll = function(callback) {
    this.getCollection(function(error, job_collection) {
      if( error ) {
        callback(error);
      } else {
        job_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new job
JobService.prototype.save = function(jobs, callback) {
    this.getCollection(function(error, job_collection) {
      if( error ) {
        callback(error);
      } else {
        if( typeof(jobs.length)=="undefined")
          jobs = [jobs];

        for( var i =0;i< jobs.length;i++ ) {
          job = jobs[i];
          job.created_at = new Date();
        }

        job_collection.insert(jobs, function() {
          callback(null, jobs);
        });
      }
    });
};

exports.JobService = JobService;