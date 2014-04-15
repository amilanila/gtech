var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ManufacturerService = function(db) {
  this.db = db;  
};

ManufacturerService.prototype.getCollection= function(callback) {
  this.db.collection('manufacturer', function(error, manufacturer_collection) {
    if( error ) {
      callback(error);
    } else {
      callback(null, manufacturer_collection);
    }
  });
};

//find all manufacturers
ManufacturerService.prototype.findAll = function(callback) {
    this.getCollection(function(error, manufacturer_collection) {
      if( error ) {        
        callback(error);
      } else {
        manufacturer_collection.find().toArray(function(error, results) {
          if( error ) {
            callback(error);
          } else {   
            callback(null, results);
          }
        });
      }
    });
};

//save new manufacturer
ManufacturerService.prototype.save = function(manufacturers, callback) {
    this.getCollection(function(error, manufacturer_collection) {
      if( error ) {
        callback(error);
      } else {
        if( typeof(manufacturers.length)=="undefined")
          manufacturers = [manufacturers];

        for( var i =0;i< manufacturers.length;i++ ) {
          manufacturer = manufacturers[i];
          manufacturers.created_at = new Date();
        }

        manufacturer_collection.insert(manufacturers, function() {
          callback(null, manufacturers);
        });
      }
    });
};

//find a single manufacturer
ManufacturerService.prototype.findOne = function(id, callback){
	this.getCollection(function(error, manufacturer_collection){
		if(error){
			callback(error);
		} else {
			manufacturer_collection.findOne({'id': id}, function(error, result){
				if(error){
					callback(error);
				} else {
					callback(null, result);
				}
			});
		}		
	});
};

//update a manufacturer
ManufacturerService.prototype.update = function(manufacturer, callback){
  this.getCollection(function(error, manufacturer_collection){
    if(error){
      callback(error);
    } else {      
      manufacturer_collection.update(
        {'id': manufacturer.id},
        {
          $set: {'name': manufacturer.name, 'description': manufacturer.description}
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

exports.ManufacturerService = ManufacturerService;