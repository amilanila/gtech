var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

PartService = function(db) {
  this.db = db;
};


PartService.prototype.getCollection= function(callback) {
  this.db.collection('part', function(error, part_collection) {
    if( error ) {
      callback(error);
    } else {
      callback(null, part_collection);
    }
  });
};

//find all parts
PartService.prototype.findAll = function(callback) {
    this.getCollection(function(error, part_collection) {
      if( error ) {        
        callback(error);
      } else {
        part_collection.find().toArray(function(error, results) {
          if( error ) {
            callback(error);
          } else {         
            callback(null, results);
          }
        });
      }
    });
};

//save new part
PartService.prototype.save = function(parts, callback) {
    this.getCollection(function(error, part_collection) {
      if( error ) {
        callback(error);
      } else {
        if( typeof(parts.length)=="undefined")
          parts = [parts];

        for( var i =0;i< parts.length;i++ ) {
          part = parts[i];
          parts.created_at = new Date();
        }

        part_collection.insert(parts, function() {
          callback(null, parts);
        });
      }
    });
};

//find a single part
PartService.prototype.findOne = function(id, callback){
  this.getCollection(function(error, part_collection){
    if(error){
      callback(error);
    } else {
      part_collection.findOne({'id': id}, function(error, result){
        if(error){
          callback(error);
        } else {
          callback(null, result);
        }
      });
    }   
  });
};

//update a part
PartService.prototype.update = function(part, callback){
  this.getCollection(function(error, part_collection){
    if(error){
      callback(error);
    } else {      
      part_collection.update(
        {'id': part.id},
        {
          $set: {'make': part.make, 'model': part.model, 'yom': part.yom, 'name': part.name, 'description': part.description}
        },
        function(err, result){
          if(err){
            callback(err);
          } else {
            callback(result);
          }
        }
      );
    }
  });
};


// delete a part
PartService.prototype.remove = function(id, callback){
  this.getCollection(function(error, part_collection){
    if(error){
      callback(error);
    } else {
      part_collection.remove(
        {'id': id},
        {justOne: true},
        function(err, result){
          callback(result);
        }
      );
    }
  });
}

exports.PartService = PartService;