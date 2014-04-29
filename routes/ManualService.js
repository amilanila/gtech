var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var fs = require("fs");

ManualService = function(db) {
  this.db = db;
};


ManualService.prototype.getCollection= function(callback) {
  this.db.collection('manual', function(error, manual_collection) {
    if( error ) {
      callback(error);
    } else {
      callback(null, manual_collection);
    }
  });
};

//find all manuals
ManualService.prototype.findAll = function(callback) {
    this.getCollection(function(error, manual_collection) {
      if( error ) {        
        callback(error);
      } else {
        manual_collection.find().toArray(function(error, results) {
          if( error ) {
            callback(error);
          } else {         
            callback(null, results);
          }
        });
      }
    });
};

//upload manual
ManualService.prototype.save = function(manual, callback) {
    this.getCollection(function(error, manual_collection) {
      if( error ) {
        callback(error);
      } else {
        manual_collection.insert(manual, function() {
          var dir = __dirname + "/../public/uploads/" + manual.id;
          fs.mkdirSync(dir, '0777');
          fs.writeFileSync(dir + "/" + manual.filename, manual.data);

          callback(null, manual);
        });
      }
    });
};

//find a single manual
ManualService.prototype.findOne = function(id, callback){
  this.getCollection(function(error, manual_collection){
    if(error){
      callback(error);
    } else {
      manual_collection.findOne({'id': id}, function(error, result){
        if(error){
          callback(error);
        } else {
          callback(null, result);
        }
      });
    }   
  });
};

// delete a manual
ManualService.prototype.remove = function(id, callback){
  this.getCollection(function(error, manual_collection){
    if(error){
      callback(error);
    } else {
      manual_collection.remove(
        {'id': id},
        {justOne: true},
        function(err, result){
          var dir = __dirname + "/../public/uploads/" + id;
          fs.unlinkSync(dir);

          callback(result);
        }
      );
    }
  });
}

exports.ManualService = ManualService;