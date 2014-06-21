var BSON = require('mongodb').BSON,
    ObjectID = require('mongodb').ObjectID,
    fs = require("fs"),
    PDFDocument = require('pdfkit'),
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
                  'total': job.total
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

JobService.prototype.convertToPdf = function(job, url, callback){  
  var childArgs = [path.join(__dirname, 'PrintService.js'), job.rego, url];
  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    callback();   
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

  var y = 120;
  var vehicleInfoTitleX = 60;
  var vehicleInfoValueX = 120;
  
  var contactInfoTitleX = 300;
  var contactInfoValueX = 420;

  var titleFontSize = 14;
  var valueFontSize = 12;

  // headers
  doc.fontSize(16); 
  doc.text('Vehicle Information', vehicleInfoTitleX, y - 5);
  doc.text('Contact Information', contactInfoTitleX, y - 5);
  
  // vehicle information
  doc.fontSize(titleFontSize); 
  doc.text('Make', vehicleInfoTitleX, y + 20);
  doc.fontSize(valueFontSize); 
  doc.text(job.make, vehicleInfoValueX, y + 20);

  doc.fontSize(titleFontSize); 
  doc.text('Model', vehicleInfoTitleX, y + 40);
  doc.fontSize(valueFontSize); 
  doc.text(job.model, vehicleInfoValueX, y + 40);

  doc.fontSize(titleFontSize); 
  doc.text('YOM', vehicleInfoTitleX, y + 60);
  doc.fontSize(valueFontSize); 
  doc.text(job.yom, vehicleInfoValueX, y + 60);

  doc.fontSize(titleFontSize); 
  doc.text('Rego', vehicleInfoTitleX, y + 80);
  doc.fontSize(valueFontSize); 
  doc.text(job.rego, vehicleInfoValueX, y + 80);

  doc.fontSize(titleFontSize); 
  doc.text('ODO', vehicleInfoTitleX, y + 100);
  doc.fontSize(valueFontSize); 
  doc.text(job.odo + ' km', vehicleInfoValueX, y + 100);

  // contact information
  doc.fontSize(titleFontSize); 
  doc.text('First Name', contactInfoTitleX, y + 20);
  doc.fontSize(valueFontSize); 
  doc.text(job.fname, contactInfoValueX, y + 20);

  doc.fontSize(titleFontSize); 
  doc.text('Last Name', contactInfoTitleX, y + 40);
  doc.fontSize(valueFontSize); 
  doc.text(job.lname, contactInfoValueX, y + 40);

  doc.fontSize(titleFontSize); 
  doc.text('Contact', contactInfoTitleX, y + 60);
  doc.fontSize(valueFontSize); 
  doc.text(job.contact, contactInfoValueX, y + 60);

  doc.fontSize(titleFontSize); 
  doc.text('Address', contactInfoTitleX, y + 80);
  doc.fontSize(valueFontSize); 
  doc.text(job.addressstreet, contactInfoValueX, y + 80);
  doc.text(job.addresssuburb, contactInfoValueX, y + 100);
  doc.text(job.addressstate, contactInfoValueX, y + 120);
  doc.text(job.addresspostcode, contactInfoValueX + 25, y + 120);  

  // Job information
  doc.fontSize(16); 
  doc.text('Job Information', vehicleInfoTitleX, y + 160);
  doc.fontSize(valueFontSize); 
  
  var serviceTypeCodeNameMap = {};
  for (var i = job.serviceTypesDetailed.length - 1; i >= 0; i--) {
    var x = job.serviceTypesDetailed[i];
    serviceTypeCodeNameMap[x.code] = x.name;
  };
  
  var serviceTypeInitY = y + 180;
  var serviceTypeIntiX = vehicleInfoTitleX + 20;
  
  doc.fontSize(titleFontSize); 
  doc.text('Service', vehicleInfoTitleX, serviceTypeInitY);
  serviceTypeInitY += 20;

  doc.fontSize(valueFontSize); 
  for (var i = job.servicetypes.length - 1; i >= 0; i--) {
    var serviceTypeCode = job.servicetypes[i];
    var serviceTypeName = serviceTypeCodeNameMap[serviceTypeCode];
    doc.text("* " + serviceTypeName, serviceTypeIntiX, serviceTypeInitY);
    serviceTypeInitY += 20;
  };

  doc.end(); 
  callback(doc);
}

exports.JobService = JobService;