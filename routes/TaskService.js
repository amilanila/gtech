var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

TaskService = function(db) {
  this.db = db;
};


TaskService.prototype.getCollection= function(callback) {
  this.db.collection('task', function(error, task_collection) {
    if( error ) {
      callback(error);
    } else {
      callback(null, task_collection);
    }
  });
};

//find all tasks
TaskService.prototype.findAll = function(callback) {
    this.getCollection(function(error, task_collection) {
      if( error ) {        
        callback(error);
      } else {
        task_collection.find().toArray(function(error, results) {
          if( error ) {
            callback(error);
          } else {         
            callback(null, results);
          }
        });
      }
    });
};

//save new task
TaskService.prototype.save = function(tasks, callback) {
    this.getCollection(function(error, task_collection) {
      if( error ) {
        callback(error);
      } else {
        if( typeof(tasks.length)=="undefined")
          tasks = [tasks];

        for( var i =0;i< tasks.length;i++ ) {
          task = tasks[i];
          task.created_at = new Date();
        }

        task_collection.insert(tasks, function() {
          callback(null, tasks);
        });
      }
    });
};

//find a single task
TaskService.prototype.findOne = function(id, callback){
  this.getCollection(function(error, task_collection){
    if(error){
      callback(error);
    } else {
      task_collection.findOne({'id': id}, function(error, result){
        if(error){
          callback(error);
        } else {
          callback(null, result);
        }
      });
    }   
  });
};

//update a task
TaskService.prototype.update = function(task, callback){
  this.getCollection(function(error, task_collection){
    if(error){
      callback(error);
    } else {      
      task_collection.update(
        {'id': task.id},
        {
          $set: {'name': task.name, 'description': task.description}
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


// delete a task
TaskService.prototype.remove = function(id, callback){
  this.getCollection(function(error, task_collection){
    if(error){
      callback(error);
    } else {
      task_collection.remove(
        {'id': id},
        {justOne: true},
        function(err, result){
          callback(result);
        }
      );
    }
  });
}

exports.TaskService = TaskService;