var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

IDGenerationService = function(db) {
  this.db = db;
};


IDGenerationService.prototype.getCollection= function(callback) {
  this.db.collection('ids', function(error, idnumber_collection) {
    if( error ) {
      callback(error);
    } else {      
      callback(null, idnumber_collection);
    }
  });
};

//save new idnumber
IDGenerationService.prototype.save = function(idnumbers, callback) {
    this.getCollection(function(error, idnumber_collection) {      
      if( error ) {
        callback(error);
      } else {
        if( typeof(idnumbers.length)=="undefined")
          idnumbers = [idnumbers];

        for( var i =0;i< idnumbers.length;i++ ) {
          idnumber = idnumbers[i];          
          idnumber.created_at = new Date();
        }

        idnumber_collection.insert(idnumbers, function() {
          callback(null, idnumbers);
        });
      }
    });
};

//find idnumber record
IDGenerationService.prototype.findAll = function(callback) {
    this.getCollection(function(error, idnumber_collection) {
      if( error ) {
        callback(error);
      } else {
        idnumber_collection.find().toArray(function(error, results) {
          if( error ) {
            callback(error)
          } else {
            callback(null, results)
          }
        });
      }
    });
};

//update a task
IDGenerationService.prototype.update = function(idnumber, callback){
  this.getCollection(function(error, idnumber_collection){
    if(error){
      callback(error);
    } else {      
      idnumber_collection.update(
        {'id': idnumber.id},
        {
          $set: {'jobnumber': idnumber.jobnumber, 'invnumber': idnumber.invnumber}
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

exports.IDGenerationService = IDGenerationService;