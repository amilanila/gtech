var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var JobService = require('./JobService.min').JobService;

JobCardService = function(db) {
  this.db = db;  
  this.jobService = new JobService(db);
};


JobCardService.prototype.getCollection= function(callback) {
  this.db.collection('jobcard', function(error, jobcard_collection) {
    if( error ) {
      callback(error);
    } else {
      callback(null, jobcard_collection);
    }
  });
};

//find all job cards
JobCardService.prototype.findAll = function(callback) {
    this.getCollection(function(error, jobcard_collection) {
      if( error ) {        
        callback(error);
      } else {
        jobcard_collection.find().sort({created_at: -1}).toArray(function(error, results) {
          if( error ) {
            callback(error);
          } else {         
            callback(null, results);
          }
        });
      }
    });
};

//save new job card
JobCardService.prototype.save = function(jobcards, callback) {
    this.getCollection(function(error, jobcard_collection) {
      if( error ) {
        callback(error);
      } else {
        if( typeof(jobcards.length)=="undefined")
          jobcards = [jobcards];

        for( var i =0;i< jobcards.length;i++ ) {
          jobcard = jobcards[i];
          jobcard.created_at = new Date();
        }

        jobcard_collection.insert(jobcards, function() {
          callback(null, jobcards);
        });
      }
    });
};

//find a single job card
JobCardService.prototype.findOne = function(id, callback){
  this.getCollection(function(error, jobcard_collection){
    if(error){
      callback(error);
    } else {
      jobcard_collection.findOne({'id': id}, function(error, result){
        if(error){
          callback(error);
        } else {
          callback(null, result);
        }
      });
    }   
  });
};

//update a job card
JobCardService.prototype.update = function(jobcard, callback){
  this.getCollection(function(error, jobcard_collection){
    if(error){
      callback(error);
    } else {      
      jobcard_collection.update(
        {'id': jobcard.id},
        {
          $set: {'jobnumber': jobcard.jobnumber, 'clientrequest': jobcard.clientrequest, 'task': jobcard.task, 'note': jobcard.note}
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

// delete a job card
JobCardService.prototype.remove = function(id, callback){
  this.getCollection(function(error, jobcard_collection){
    if(error){
      callback(error);
    } else {
      jobcard_collection.remove(
        {'id': id},
        {justOne: true},
        function(err, result){
          callback(result);
        }
      );
    }
  });
}

//search for job card with job number
JobCardService.prototype.search = function(jobnumber, callback){
  this.getCollection(function(error, jobcard_collection){
    if(error){
      callback(error);
    } else {
      jobcard_collection.find(
        {
          'jobnumber' : jobnumber
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

//search for job card with job number
JobCardService.prototype.findJobcardAndJob = function(id, callback){
  this.getCollection(function(error, jobcard_collection){
    jobcard_collection.findOne({'id': id}, function(err1, jobcard){

      this.jobService.findByJobNumber(jobcard.jobnumber, function(err2, result){
        result.toArray(function(err, jobs){
          callback(null, jobcard, jobs[0]);
        });
      });      
    });
  });
};

exports.JobCardService = JobCardService;