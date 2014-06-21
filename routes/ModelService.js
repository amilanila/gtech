var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ModelService = function(db) {
  this.db = db;
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

//find a single model
ModelService.prototype.findOne = function(id, callback){
  this.getCollection(function(error, model_collection){
    if(error){
      callback(error);
    } else {
      model_collection.findOne({'id': id}, function(error, result){
        if(error){
          callback(error);
        } else {
          callback(null, result);
        }
      });
    }   
  });
};

//update a model
ModelService.prototype.update = function(model, callback){
  this.getCollection(function(error, model_collection){
    if(error){
      callback(error);
    } else {      
      model_collection.update(
        {'id': model.id},
        {
          $set: {'make': model.make,  'name': model.name, 'yom':model.yom, 'description': model.description}
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


// delete a model
ModelService.prototype.remove = function(id, callback){
  this.getCollection(function(error, model_collection){
    if(error){
      callback(error);
    } else {
      model_collection.remove(
        {'id': id},
        {justOne: true},
        function(err, result){
          callback(result);
        }
      );
    }
  });
}

exports.ModelService = ModelService;