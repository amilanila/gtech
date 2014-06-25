var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ReportService = function(db) {
  this.db = db;
};


ReportService.prototype.getCollection= function(callback) {
  this.db.collection('part', function(error, report_collection) {
    if( error ) {
      callback(error);
    } else {
      callback(null, report_collection);
    }
  });
};

//find all reports
ReportService.prototype.findAll = function(callback) {
  this.getCollection(function(error, report_collection) {
    if( error ) {        
      callback(error);
    } else {
      report_collection.find().toArray(function(error, results) {
        if( error ) {
          callback(error);
        } else {         
          callback(null, results);
        }
      });
    }
  });
};

//find a single part
ReportService.prototype.findOne = function(id, callback){
  this.getCollection(function(error, report_collection){
    if(error){
      callback(error);
    } else {
      report_collection.findOne({'id': id}, function(error, result){
        if(error){
          callback(error);
        } else {
          callback(null, result);
        }
      });
    }   
  });
};

ReportService.prototype.search = function(keyword, callback){
  this.getCollection(function(error, report_collection){
    var regex = new RegExp(["^",keyword,"$"].join(""),"i");

    if(error){
      callback(error);
    } else {
      report_collection.find(
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

exports.ReportService = ReportService;