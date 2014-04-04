var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ServiceTypeService = function(host, port) {
  this.db= new Db('gtech', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


ServiceTypeService.prototype.getCollection= function(callback) {
  this.db.collection('servicetype', function(error, servicetype_collection) {
    if( error ) {
      callback(error);
    } else {
      callback(null, servicetype_collection);
    }
  });
};

//find all service types
ServiceTypeService.prototype.findAll = function(callback) {
    this.getCollection(function(error, servicetype_collection) {
      if( error ) {        
        callback(error);
      } else {
        servicetype_collection.find().toArray(function(error, results) {
          if( error ) {
            callback(error);
          } else {         
            callback(null, results);
          }
        });
      }
    });
};

//save new service type
ServiceTypeService.prototype.save = function(servicetypes, callback) {
    this.getCollection(function(error, servicetype_collection) {
      if( error ) {
        callback(error);
      } else {
        if( typeof(servicetypes.length)=="undefined")
          servicetypes = [servicetypes];

        for( var i =0;i< servicetypes.length;i++ ) {
          model = servicetypes[i];
          servicetypes.created_at = new Date();
        }

        servicetype_collection.insert(servicetypes, function() {
          callback(null, servicetypes);
        });
      }
    });
};

exports.ServiceTypeService = ServiceTypeService;