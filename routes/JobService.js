var BSON = require('mongodb').BSON,
    ObjectID = require('mongodb').ObjectID,
    fs = require("fs"),
    path = require('path'),
    childProcess = require('child_process'),
    phantomjs = require('phantomjs'),
    binPath = phantomjs.path;    

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
                  {'fname' : regex},
                  {'lname' : regex},
                  {'rego' : regex},
                  {'jobnumber' : regex}
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

//find job by job number
JobService.prototype.findByJobNumber = function(jobnumber, callback){
  this.getCollection(function(error, job_collection){
    if(error){
      callback(error);
    } else {
      job_collection.find(
        {
          'jobnumber' : jobnumber
        },        
        function(error, result){
          if(error){
            callback(error);
          } else {                   
            callback(null, result);
          }
        }
      );
    }   
  });
};

//find all jobs
JobService.prototype.findAll = function(callback) {
    this.getCollection(function(error, job_collection) {
      if( error ) {
        callback(error);
      } else {
        job_collection.find().sort({created_at: -1}).toArray(function(error, results) {
          if( error ) {
            callback(error)
          } else {
            callback(null, results)
          }
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
          var d = new Date();
          job.created_at = d.getTime();
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
                  'make': job.make, 
                  'model': job.model, 
                  'yom': job.yom, 
                  'rego': job.rego, 
                  'odo': job.odo,
                  'vin': job.vin,
                  'eno': job.eno,                        
                  'servicetypes': job.servicetypes, 
                  'status': job.status,
                  'fname': job.fname, 
                  'lname': job.lname, 
                  'contact': job.contact, 
                  'addressstreet': job.addressstreet,
                  'addresssuburb': job.addresssuburb,
                  'addresspostcode': job.addresspostcode,
                  'addressstate': job.addressstate,
                  'note': job.note,
                  'startdate': job.startdate,
                  'completedate': job.completedate,
                  'total': job.total,
                  'invnumber': job.invnumber
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

// delete a job
JobService.prototype.remove = function(id, callback){
  this.getCollection(function(error, job_collection){
    if(error){
      callback(error);
    } else {
      job_collection.remove(
        {'id': id},
        {justOne: true},
        function(err, result){
          callback(result);
        }
      );
    }
  });
}

JobService.prototype.getJobsSummary = function(params, callback){
  var millsInDay = 3600 * 24 * 1000;
  var start = params['start'];
  var end = parseInt(params['end']) + millsInDay;
  var sts = params['status'];
  
  if(sts != undefined && sts != '-') {
    this.getCollection(function(error, job_collection){
      job_collection.find(
      {
        $and: 
        [
          {
            'created_at': {
                          $gte: parseInt(start),
                          $lt: parseInt(end)                        
                        }
          },
          {
            'status': sts
          }
        ]
      }, function(error, result){
          result.toArray(function(err, jobsArr){
            callback(null, jobsArr);
          });
        }
      );
    });    
  } else {    
    this.getCollection(function(error, job_collection){
      job_collection.find(
      {
        'created_at': {
                        $gte: parseInt(start),
                        $lt: parseInt(end)                        
                      }
      }, function(error, result){
          result.toArray(function(err, jobsArr){
            callback(null, jobsArr);
          });
        }
      );
    });
  }
}

JobService.prototype.convertToPdf = function(filename, url, callback){  
  var childArgs = [path.join(__dirname, 'PrintService.js'), filename, url];
  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    callback();   
  });
}

exports.JobService = JobService;