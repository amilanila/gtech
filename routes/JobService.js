var BSON = require('mongodb').BSON,
    ObjectID = require('mongodb').ObjectID,
    fs = require("fs"),
    PDFDocument = require('pdfkit');    

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
                  'make': job.make, 
                  'model': job.model, 
                  'yom': job.yom, 
                  'rego': job.rego, 
                  'odo': job.odo,                        
                  'servicetypes': job.servicetypes, 
                  'status': job.status,
                  'fname': job.fname, 
                  'lname': job.lname, 
                  'contact': job.contact, 
                  'address': job.address,
                  'note': job.note,
                  'startdate': job.startdate,
                  'completedate': job.completedate
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

JobService.prototype.createPrint = function(job, callback){
  var filename = job.rego + ".pdf";
  var file = __dirname + "\\..\\public\\prints\\" + filename;

  var doc = new PDFDocument();                        
  doc.pipe(fs.createWriteStream(file));  

  doc.fontSize(22);
  doc.font('Times-Roman')
    .text('GTech Auto Care');

  doc.lineWidth(1)
  doc.lineCap('butt')
    .moveTo(60, 100)
    .lineTo(550, 100)
    .stroke();  

  doc.moveDown();  

  doc.fontSize(14); 
  doc.text('Make', 60, 120);
  doc.fontSize(12); 
  doc.text(job.make, 140, 120);

  doc.fontSize(14); 
  doc.text('Model', 60, 140);
  doc.fontSize(12); 
  doc.text(job.model, 140, 140);

  doc.fontSize(14); 
  doc.text('YOM', 60, 160);
  doc.fontSize(12); 
  doc.text(job.yom, 140, 160);

  doc.fontSize(14); 
  doc.text('Rego', 60, 180);
  doc.fontSize(12); 
  doc.text(job.rego, 140, 180);

  doc.fontSize(14); 
  doc.text('ODO', 60, 200);
  doc.fontSize(12); 
  doc.text(job.odo, 140, 200);

  
  doc.end(); 

  callback(doc);
}

exports.JobService = JobService;