var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

JobService = function(db) {
  this.db = db;
};

JobService.prototype.getCollection= function(callback) {
  this.db.collection('job', function(error, job_collection) {
    if( error ) {
      callback(error);
    } else {
      callback(null, job_collection);
    }
  });
};

//search for jobs with matching criteria
JobService.prototype.search = function(keyword, callback){
  this.getCollection(function(error, job_collection){
    var regex = new RegExp(["^",keyword,"$"].join(""),"i");

    if(error){
      callback(error);
    } else {
      job_collection.find(
        {
          $or: [
                  {'name' : regex},
                  {'rego' : regex}
               ]
        }, 
        function(error, result){
        if(error){
          callback(error);
        } else {          
          callback(null, result);
        }
      });
    }   
  });
};

//find all jobs
JobService.prototype.findAll = function(callback) {
    this.getCollection(function(error, job_collection) {
      if( error ) {
        callback(error);
      } else {
        job_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find a single job
JobService.prototype.findOne = function(id, callback){
  this.getCollection(function(error, job_collection){
    if(error){
      callback(error);
    } else {
      job_collection.findOne({'id': id}, function(error, result){
        if(error){
          callback(error);
        } else {
          callback(null, result);          
        }
      });
    }   
  });
};

//save new job
JobService.prototype.save = function(jobs, callback) {
    this.getCollection(function(error, job_collection) {
      if( error ) {
        callback(error);
      } else {
        if( typeof(jobs.length)=="undefined")
          jobs = [jobs];

        for( var i =0;i< jobs.length;i++ ) {
          job = jobs[i];
          job.created_at = new Date();
        }

        job_collection.insert(jobs, function() {
          callback(null, jobs);
        });
      }
    });
};

//update a job
JobService.prototype.update = function(job, callback){
  this.getCollection(function(error, job_collection){
    if(error){
      callback(error);
    } else {      
      job_collection.update(
        {'id': job.id},
        {
          $set: {
                  'make': job.make, 'model': job.model, 'rego': job.rego, 'name': job.name, 
                  'contact': job.contact, 'servicetypes': job.servicetypes, 'note': job.note,
                  'status': job.status
                }
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

exports.JobService = JobService;