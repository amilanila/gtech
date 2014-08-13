var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

AuthenticationService = function(db) {
  this.db = db;  
};

AuthenticationService.prototype.getCollection= function(callback) {
  this.db.collection('auth', function(error, auth_collection) {
    if( error ) {
      callback(error);
    } else {
      callback(null, auth_collection);
    }
  });
};

AuthenticationService.prototype.findAll = function(callback) {
    this.getCollection(function(error, auth_collection) {
      if( error ) {        
        callback(error);
      } else {
        auth_collection.find().toArray(function(error, results) {
          if( error ) {
            callback(error);
          } else {   
            callback(null, results);
          }
        });
      }
    });
};

AuthenticationService.prototype.save = function(auths, callback) {
    this.getCollection(function(error, auth_collection) {
      if( error ) {
        callback(error);
      } else {
        if( typeof(auths.length)=="undefined")
          auths = [auths];

        for( var i =0;i< auths.length;i++ ) {
          manufacturer = auths[i];
          auths.created_at = new Date();
        }

        auth_collection.insert(auths, function() {
          callback(null, auths);
        });
      }
    });
};


exports.AuthenticationService = AuthenticationService;