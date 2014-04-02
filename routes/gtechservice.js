var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

GtechService = function(host, port) {
  this.db= new Db('gtech', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


GtechService.prototype.getCollection= function(callback) {
  this.db.collection('job', function(error, job_collection) {
    if( error ) callback(error);
    else callback(null, job_collection);
  });
};

//find all employees
GtechService.prototype.findAll = function(callback) {
    this.getCollection(function(error, job_collection) {
      if( error ) callback(error)
      else {
        job_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new employee
GtechService.prototype.save = function(employees, callback) {
    this.getCollection(function(error, job_collection) {
      if( error ) callback(error)
      else {
        if( typeof(employees.length)=="undefined")
          employees = [employees];

        for( var i =0;i< employees.length;i++ ) {
          employee = employees[i];
          employee.created_at = new Date();
        }

        job_collection.insert(employees, function() {
          callback(null, employees);
        });
      }
    });
};

exports.GtechService = GtechService;