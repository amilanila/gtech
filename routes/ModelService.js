var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ModelService = function(host, port) {
  this.db= new Db('gtech', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


ModelService.prototype.getCollection= function(callback) {
  this.db.collection('model', function(error, model_collection) {
    if( error ) {
      callback(error);
    } else {
      callback(null, model_collection);
    }
  });
};

//find all models
ModelService.prototype.findAll = function(callback) {
    this.getCollection(function(error, model_collection) {
      if( error ) {        
        callback(error);
      } else {
        model_collection.find().toArray(function(error, results) {
          if( error ) {
            callback(error);
          } else {         
            callback(null, results);
          }
        });
      }
    });
};

//save new model
ModelService.prototype.save = function(models, callback) {
    this.getCollection(function(error, model_collection) {
      if( error ) {
        callback(error);
      } else {
        if( typeof(models.length)=="undefined")
          models = [models];

        for( var i =0;i< models.length;i++ ) {
          model = models[i];
          models.created_at = new Date();
        }

        model_collection.insert(models, function() {
          callback(null, models);
        });
      }
    });
};

exports.ModelService = ModelService;