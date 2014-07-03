var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
    crypto = require('crypto'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    InitService = require('./routes/InitService').InitService
    ManufactureService = require('./routes/ManufacturerService').ManufacturerService,
    ModelService = require('./routes/ModelService').ModelService,
    ServiceTypeService = require('./routes/ServiceTypeService').ServiceTypeService,
    JobService = require('./routes/JobService').JobService,
    manualService = require('./routes/ManualService').ManualService,
    taskService = require('./routes/TaskService').TaskService,
    idGenerationService = require('./routes/IDGenerationService').IDGenerationService,
    jobcardService = require('./routes/JobCardService').JobCardService,    
    partService = require('./routes/PartService').PartService,    
    fs = require("fs");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

var initService = new InitService('localhost', 27017);
initService.db(function(error, db){
    this.manufactureService = new ManufactureService(db);
    this.modelService = new ModelService(db);
    this.serviceTypeService = new ServiceTypeService(db);
    this.jobService = new JobService(db);
    this.manualService = new ManualService(db);
    this.taskService = new TaskService(db);
    this.idGenerationService = new IDGenerationService(db);
    this.jobcardService = new JobCardService(db);
    this.partService = new PartService(db);
});

var varManufacturers = null;
var varModels = null;
var varServiceTypes = null;
var varJobs = null;
var varTasks = null;
var varJobCards = null;
var makeModelMap = {};
var varTasksMap = {};

/////////////////////////////////////// Root ////////////////////////////////////////
app.get('/', function(req, res){
    manufactureService.findAll(function( error, manufacturers) {
        varManufacturers = manufacturers;    
    });

    modelService.findAll(function( error, models) {
        makeModelMap = {};
        varModels = models;  

        for (var i = 0; i < models.length; i++) {
            var makeTmp = models[i].make;
            var modelTmp = models[i].name;          

            if(makeModelMap[makeTmp] == undefined){
                makeModelMap[makeTmp] = modelTmp;
            } else {
                makeModelMap[makeTmp] = makeModelMap[makeTmp] + '#' + modelTmp;    
            }            
        };           
    });

    serviceTypeService.findAll(function( error, servicetypes) {
        varServiceTypes = servicetypes;    
    });

    jobService.findAll(function( error, jobs) {
        varJobs = jobs;
        res.render('index', {
            'title': 'Jobs',
            'jobs':jobs,
            'manufacturers': varManufacturers,
            'models': varModels,
            'serviceTypes': varServiceTypes,
            'makeModelMap': JSON.stringify(makeModelMap)
        });
    });

    taskService.findAll(function( error, tasks) {
        varTasks = tasks;       
    });

    jobcardService.findAll(function( error, jobcards) {
        varJobCards = jobcards;       
    });
});

/////////////////////////////////////// Manufactures ////////////////////////////////
app.post('/manufacturer/save', function(req, res){
    var id = req.body.id;
    var name = req.body.name;
    var description = req.body.description;

    if(id == '-1'){
        id = crypto.randomBytes(20).toString('hex');
        manufactureService.save({
            'id': id,
            'name': name,
            'description': description
        }, function( error, docs) {
            res.redirect('/manufacturer')
        });    
    } else {
        manufactureService.update({
            'id': id,
            'name': name,
            'description': description
        }, function( error, docs) {
            res.redirect('/manufacturer')
        });    
    }   
});

app.get('/manufacturer', function(req, res){
    manufactureService.findAll(function( error, manufacturers) {
        varManufacturers = manufacturers;
        res.render('index', {
            'title': 'Manufacturers',
            'manufacturers': manufacturers
        });
    });
});

app.get('/manufacturer/:id', function(req, res){
	var id = req.params.id;	
	manufactureService.findOne(id, function(error, manufacturer){
		res.render('index', {
			'title': 'Manufacturers',
			'manufacturer':manufacturer,
			'manufacturers': varManufacturers
		});
	})
});

app.get('/manufacturer/remove/:id', function(req, res){
    var id = req.params.id; 
    manufactureService.remove(id, function( error, docs) {
        res.redirect('/manufacturer')
    });
});

/////////////////////////////////////// Model ////////////////////////////////
app.post('/model/save', function(req, res){
    var id = req.body.id;
    var make = req.body.make;
    var name = req.body.name;
    var yom = req.body.yom;
    var description = req.body.description;

    if(id == '-1'){
        id = crypto.randomBytes(20).toString('hex');
        modelService.save({
            'id': id,
            'make': make,
            'name': name,
            'description': description,
            'yom': yom        
        }, function( error, docs) {
            res.redirect('/model')
        });
    } else {
        modelService.update({
            'id': id,
            'make': make,
            'name': name,
            'description': description,
            'yom': yom
        }, function( error, docs) {
            res.redirect('/model')
        });    
    }   
});

app.get('/model', function(req, res){
    modelService.findAll(function( error, models) {
        varModels = models;

        makeModelMap = {};
        for (var i = 0; i < models.length; i++) {
            var makeTmp = models[i].make;
            var modelTmp = models[i].name;          

            if(makeModelMap[makeTmp] == undefined){
                makeModelMap[makeTmp] = modelTmp;
            } else {
                makeModelMap[makeTmp] = makeModelMap[makeTmp] + '#' + modelTmp;    
            }            
        };   

        res.render('index', {
            'title': 'Models',
            'models': models,
            'manufacturers': varManufacturers
        });
    });
});

app.get('/model/:id', function(req, res){
    var id = req.params.id; 
    modelService.findOne(id, function(error, model){
        res.render('index', {
            'title': 'Models',
            'model': model,
            'models': varModels,            
            'manufacturers': varManufacturers
        });
    })
});

app.get('/model/remove/:id', function(req, res){
    var id = req.params.id; 
    modelService.remove(id, function( error, docs) {
        res.redirect('/model')
    });
});

/////////////////////////////////////// Service Types ////////////////////////////////
app.post('/servicetype/save', function(req, res){
    var id = req.body.id;
    var name = req.body.name;
    var description = req.body.description;
    
    if(id == '-1'){
        id = crypto.randomBytes(20).toString('hex');
        serviceTypeService.save({
            'id': id,            
            'name': name,
            'description': description
        }, function( error, docs) {
            res.redirect('/servicetype')
        });
    } else {
        serviceTypeService.update({
            'id': id,
            'name': name,
            'description': description
        }, function( error, docs) {
            res.redirect('/servicetype')
        });    
    }   
});

app.get('/servicetype', function(req, res){
	serviceTypeService.findAll(function( error, servicetypes) {
        varServiceTypes = servicetypes;
        res.render('index', {
            'title': 'Service Types',
            'servicetypes': servicetypes
        });
    });
});

app.get('/servicetype/:id', function(req, res){
    var id = req.params.id; 
    serviceTypeService.findOne(id, function(error, servicetype){
        res.render('index', {
            'title': 'Service Types',
            'servicetype': servicetype,
            'servicetypes': varServiceTypes
        });
    })
});

app.get('/servicetype/remove/:id', function(req, res){
    var id = req.params.id; 
    serviceTypeService.remove(id, function( error, docs) {
        res.redirect('/servicetype')
    });
});

/////////////////////////////////////// Jobs //////////////////////////////////////
app.post('/job/save', function(req, res){
	var id = req.body.id;
    var make = req.body.make;
    var model = req.body.model;
    var yom = req.body.yom;
    var rego = req.body.rego;
    var odo = req.body.odo;
    var vin = req.body.vin;
    var eno = req.body.eno;
    var servicetype = req.body.jobservicetype;
    var status = req.body.status;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var contact = req.body.contact;
    var addressstreet = req.body.addressstreet;
    var addresssuburb = req.body.addresssuburb;
    var addresspostcode = req.body.addresspostcode;    
    var addressstate = req.body.addressstate;
    var note = req.body.note;
    var startdate = req.body.startdate;
    var completedate = req.body.completedate;
    var total = req.body.total;

    if(id == '-1'){        
        id = crypto.randomBytes(20).toString('hex');

        var timestamp = getDateString();
        idGenerationService.findAll(function(error, idnumbers){

            var jobIndex = 1;
            var jobNumber = '';

            if(idnumbers != null && idnumbers.length == 1 ){
                var obj = idnumbers[0];                
                if(obj.jobnumber != undefined){
                    jobIndex = parseInt(obj.jobnumber) + 1;    
                } else {
                    jobIndex = 1;
                }

                idnumbers[0].jobnumber = jobIndex;
                jobNumber = 'J' + timestamp + '-' + jobIndex;                
            } else {
                jobNumber = 'J' + timestamp + '-' + 1; 
            }

            jobService.save({
                'id': id,
                'jobnumber': jobNumber,
                'make': make,
                'model': model,
                'yom': yom,
                'rego': rego,
                'odo': odo,            
                'vin': vin,            
                'eno': eno,
                'servicetypes': servicetype,
                'status': status,
                'fname': fname,
                'lname': lname,
                'contact': contact,
                'addressstreet': addressstreet,
                'addresssuburb': addresssuburb,
                'addresspostcode': addresspostcode,
                'addressstate': addressstate,
                'note': note,
                'startdate': startdate,
                'completedate': completedate,
                'total': total

            }, function( error, docs) {
                if(idnumbers != null && idnumbers.length == 1){
                     idGenerationService.update(idnumbers[0], function(error, docs){
                        res.redirect('/job')
                    });     
                } else {
                    idGenerationService.save({
                        'id': crypto.randomBytes(20).toString('hex'),
                        'jobnumber' : jobIndex,
                        'invnumber' : '1'
                    }, function(error, docs){
                        res.redirect('/job')
                    });                
                }                
            });            
        });
    } else {
        jobService.update({
            'id': id,
            'make': make,
            'model': model,
            'yom': yom,
            'rego': rego,
            'odo': odo,  
            'vin': vin,     
            'eno': eno,     
            'servicetypes': servicetype,
            'status': status,
            'fname': fname,
            'lname': lname,
            'contact': contact,
            'addressstreet': addressstreet,
            'addresssuburb': addresssuburb,
            'addresspostcode': addresspostcode,
            'addressstate': addressstate,
            'note': note,
            'startdate': startdate,
            'completedate': completedate,
            'total': total
        }, function( error, docs) {
            res.redirect('/job')
        });                 
    }   
});

app.get('/job', function(req, res){
    jobService.findAll(function( error, jobs) {        
        varJobs = jobs;
        res.render('index', {
            'title': 'Jobs',
            'jobs':jobs,
            'manufacturers': varManufacturers,
            'models': varModels,
            'serviceTypes': varServiceTypes,
            'makeModelMap': JSON.stringify(makeModelMap)
        });
    });
});

app.get('/job/:id', function(req, res){
    var id = req.params.id; 
    jobService.findOne(id, function(error, job){
        res.render('index', {
            'title': 'Jobs',
            'jobs': varJobs,
            'job': job,
            'manufacturers': varManufacturers,
            'models': varModels,
            'serviceTypes': varServiceTypes
        });
    })
});

app.get('/job/remove/:id', function(req, res){
    var id = req.params.id; 
    jobService.remove(id, function( error, docs) {
        res.redirect('/job')
    });
});

app.get('/search', function(req, res){    
    var keyword = req.query.keyword; 
    jobService.search(keyword, function(error, result){
        result.toArray(function(err, jobs){
            res.render('index', {
                'title': 'Jobs Search',
                'jobs': jobs,
                'manufacturers': varManufacturers,
                'models': varModels,
                'serviceTypes': varServiceTypes,
                'makeModelMap': JSON.stringify(makeModelMap)
            });                    
        });
    })
});

/////////////////////////////////////// Manual ////////////////////////////////
app.get('/manual', function(req, res){
    manualService.findAll(function( error, manuals) {        
        res.render('index', {
            'title': 'Manuals',
            'manuals': manuals,
            'manufacturers': varManufacturers,
            'models': varModels,
            'makeModelMap': JSON.stringify(makeModelMap)
        });
    });
});

app.post('/manual/save', function(req, res){
    var id = crypto.randomBytes(20).toString('hex');
    var make = req.body.make;
    var model = req.body.model;
    var data = fs.readFileSync(req.files.manualfile.path);
    var fileName = req.files.manualfile.name;

    manualService.save({
        'id': id,
        'make': make,
        'model': model,
        'data': data,
        'filename': fileName
    }, function( error, docs) {
        res.redirect('/manual')
    });
});

app.get('/manual/remove/:id', function(req, res){
    var id = req.params.id; 
    manualService.remove(id, function( error, docs) {
        res.redirect('/manual')
    });
});

app.get('/manual/:id', function(req, res){
    var id = req.params.id; 
    manualService.findOne(id, function(error, manual){

    	var file = __dirname + "\\public\\uploads\\" + manual.id + "\\" + manual.filename;
        fs.readFile(file, function (err,data){
            res.setHeader('Content-disposition', 'attatchment; filename="' + manual.filename + '"');
            res.setHeader('Content-type', 'application/pdf');
            res.send(data);
        });
    })
});

/////////////////////////////////////// Task ////////////////////////////////
app.post('/task/save', function(req, res){
    var id = req.body.id;    
    var name = req.body.name;
    var description = req.body.description;
        
    if(id == '-1'){
        id = crypto.randomBytes(20).toString('hex');
        taskService.save({
            'id': id,            
            'name': name,
            'description': description            
        }, function( error, docs) {
            res.redirect('/task')
        });
    } else {
        taskService.update({
            'id': id,
            'name': name,
            'description': description
        }, function( error, docs) {
            res.redirect('/task')
        });    
    }   
});

app.get('/task', function(req, res){
    taskService.findAll(function( error, tasks) {
        varTasks = tasks;

        for(var i=0; i<tasks.length; i++){
            var taskTmp = tasks[i];
            varTasksMap[taskTmp.id] = taskTmp.name;
        }

        res.render('index', {
            'title': 'Tasks',
            'tasks': tasks
        });
    });
});

app.get('/task/:id', function(req, res){
    var id = req.params.id; 
    taskService.findOne(id, function(error, task){
        res.render('index', {
            'title': 'Tasks',
            'task': task,
            'tasks': varTasks
        });
    })
});

app.get('/task/remove/:id', function(req, res){
    var id = req.params.id; 
    taskService.remove(id, function( error, docs) {
        res.redirect('/task')
    });
});

/////////////////////////////////////// Job Card ////////////////////////////////
app.post('/jobcard/save', function(req, res){
    var id = req.body.id;    
    var jobnumber = req.body.jobnumber;
    var clientrequest = req.body.clientrequest;
    var task = req.body.task;
    var note = req.body.note;
        
    if(id == '-1'){
        id = crypto.randomBytes(20).toString('hex');
        jobcardService.save({
            'id': id,            
            'jobnumber': jobnumber,
            'clientrequest': clientrequest,
            'task': task,
            'note': note            
        }, function( error, docs) {
            res.redirect('/jobcard')
        });
    } else {
        jobcardService.update({
            'id': id,
            'jobnumber': jobnumber,
            'clientrequest': clientrequest,
            'task': task,
            'note': note
        }, function( error, docs) {
            res.redirect('/jobcard')
        });    
    }   
});

app.get('/jobcard', function(req, res){
    jobcardService.findAll(function( error, jobcards) {
        varJobCards = jobcards;
        res.render('index', {
            'title': 'Job Card',
            'jobcards': jobcards,
            'tasks': varTasks
        });
    });
});

app.get('/jobcard/:id', function(req, res){
    var id = req.params.id; 
    jobcardService.findOne(id, function(error, jobcard){
        res.render('index', {
            'title': 'Job Card',
            'jobcard': jobcard,
            'tasks': varTasks,
            'jobcards': varJobCards
        });
    })
});

app.get('/jobcard/remove/:id', function(req, res){
    var id = req.params.id; 
    jobcardService.remove(id, function( error, docs) {
        res.redirect('/jobcard')
    });
});

app.get('/jobcard/search/:jobnumber', function(req, res){    
    var jobnumber = req.params.jobnumber; 
    jobcardService.search(jobnumber, function(error, result){
        result.toArray(function(err, jobcards){
            if(jobcards.length > 0){                
                var jc = jobcards[0];
                if(jc == undefined){
                    res.render('index', {
                        'title': 'Job Card',
                        'jobcard': null,
                        'jobnumberTmp': jobnumber,
                        'tasks': varTasks,
                        'jobcards': varJobCards
                    });
                } else {
                    res.render('index', {
                        'title': 'Job Card',
                        'jobcard': jc,
                        'tasks': varTasks,
                        'jobcards': varJobCards
                    });
                }
            } else {
                res.render('index', {
                    'title': 'Job Card',
                    'jobcard': null,
                    'jobnumberTmp': jobnumber,
                    'tasks': varTasks,
                    'jobcards': varJobCards
                });
            }            
        });
    })
});

/////////////////////////////////////// Spare parts ////////////////////////////////
app.post('/part/save', function(req, res){
    var id = req.body.id;
    var make = req.body.make;
    var model = req.body.model;
    var yom = req.body.yom;
    var name = req.body.name;
    var description = req.body.description;

    if(id == '-1'){
        id = crypto.randomBytes(20).toString('hex');
        partService.save({
            'id': id,
            'make': make,
            'model': model,
            'yom': yom,
            'name': name,
            'description': description        
        }, function( error, docs) {
            res.redirect('/part')
        });
    } else {
        partService.update({
            'id': id,
            'make': make,
            'model': model,
            'yom': yom,
            'name': name,
            'description': description
        }, function( error, docs) {
            res.redirect('/part')
        });    
    }   
});

app.get('/part', function(req, res){
    partService.findAll(function( error, parts) {
        varParts = parts;
        res.render('parts', {
            'title': 'Spare parts',
            'parts': parts,
            'manufacturers': varManufacturers,
            'models': varModels
        });
    });
});

app.get('/part/:id', function(req, res){
    var id = req.params.id; 
    partService.findOne(id, function(error, part){
        res.render('parts', {
            'title': 'Spare parts',
            'part': part,
            'manufacturers': varManufacturers,
            'models': varModels,
            'parts': varParts
        });
    })
});

app.get('/part/remove/:id', function(req, res){
    var id = req.params.id; 
    partService.remove(id, function( error, docs) {
        res.redirect('/part')
    });
});

/////////////////////////////////////// Reports & Printing////////////////////////////////
app.get('/report', function(req, res){
    res.render('report', {

    });    
});

// --> Print job invoice
app.get('/job/print/:id', function(req, res){
    var id = req.params.id; 
    var dateStr = getDateString();

    jobService.findOne(id, function( error, job) {       
        idGenerationService.findAll(function(error, idnumbers){
            var invIndex = 1;
            var invNumber = '';

            if(idnumbers != null && idnumbers.length == 1 ){
                var obj = idnumbers[0];
                invIndex = parseInt(obj.invnumber) + 1;
                
                idnumbers[0].invnumber = invIndex;
                invNumber = 'INV' + dateStr + '-' + invIndex;
            } else {
                invNumber = 'INV' + dateStr + '-' + 1;
            }

            idGenerationService.update(idnumbers[0], function(error, docs){
                job.invnumber = invNumber;
                jobService.update(job, function(err, docs){
                    var url = 'http://localhost:3000/printjob/' + id;

                    var filename = job.rego;
                    jobService.convertToPdf(filename, url , function(error, doc){                                        
                        res.redirect('/job/download/'+ filename + '.pdf');                
                    });
                });
            });             
        });
    });
});

app.get('/printjob/:id', function(req, res){
    var id = req.params.id; 
    
    var now = new Date();
    var timestamp = getDescriptiveDateString(now);
    
    jobService.findOne(id, function( error, job) {     
        res.render('printjob', {
            'job': job,
            'timestamp': timestamp
        });
    });
});

// --> Print job summaries
app.get('/report/jobsummary', function(req, res){
    var s = req.query.start;
    var e = req.query.end;

    var url = 'http://localhost:3000/jobsummary?start=' + s + '&end=' + e;

    var filename = 'job-summary-report';
    jobService.convertToPdf(filename, url , function(error, doc){                        
        res.redirect('/job/download/'+ filename + '.pdf');                
    });
});

app.get('/jobsummary', function(req, res){
    var s = req.query.start;
    var e = req.query.end;
    var status = req.query.status;

    var parameters = {};
    parameters['start'] = s;
    parameters['end'] = e;
    parameters['status'] = status;

    var startDate = new Date(parseInt(s));
    var endDate = new Date(parseInt(e));

    var startStr = getDescriptiveDateString(startDate);
    var endStr = getDescriptiveDateString(endDate);

    //jobService.getJobsSummary(parameters, function(error, jobs){
    jobService.findAll(function(error, jobs){

        var len = 0;
        if(jobs != undefined && jobs != null){
            len = jobs.length;
        }

        for(var i=0; i<len; i++){
            var createDate = getDescriptiveDateString(jobs[i].created_at);
            //var completeDate = getDescriptiveDateString(jobs[i].completedate);
            jobs[i].created_at = createDate;
            //jobs[i].completedate = completeDate;
        }

        res.render('jobsummary', {
            'jobs': jobs,
            'start': startStr,
            'end': endStr
        });
    });
});

// --> Print job card
app.get('/jobcard/print/:id', function(req, res){
    var id = req.params.id; 

    jobcardService.findOne(id, function(error, jobcard){
        var url = 'http://localhost:3000/jobcardprint/' + id;

        var filename = jobcard.jobnumber + '-jobcard';
        jobService.convertToPdf(filename, url , function(error, doc){                                        
            res.redirect('/job/download/'+ filename + '.pdf');                
        });  
    })
});

app.get('/jobcardprint/:id', function(req, res){
    var id = req.params.id; 
    var dateStr = getDescriptiveDateString(new Date());    

    if(id != 'Background Image'){
        jobcardService.findJobcardAndJob(id, function(error, jobcard, job) {   

            var taskTmp = '' + jobcard.task;
            var taskArr = taskTmp.split(',');
            var tasks = new Array();

            for(var x = 0; x < taskArr.length; x++){
                var val = taskArr[x];
                tasks.push(varTasksMap[val]);
            }

            res.render('printjobcard', {
                'jobcard': jobcard,
                'job': job,
                'dateStr': dateStr,
                'tasks': tasks
            });
        });    
    } else {
        res.redirect('/jobcard');
    }
});

// --> Download pdf
app.get('/job/download/:filename', function(req, res){
    var filename = req.params.filename; 
    var file = __dirname + "\\public\\prints\\" + filename;

    // read file and send to browser
    fs.readFile(file, function (err,data){
        res.setHeader('Content-disposition', 'attatchment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');
        res.send(data);
    });
});

///////////////////////////// utils //////////////////////////
function getDateString(){
    // get id custom identification number
    var now = new Date();
    var strYear = '' + now.getFullYear();
    var strMonth = (now.getMonth()+1) < 10 ? '0' + (now.getMonth()+1) : '' + (now.getMonth()+1);
    var strDate = now.getDate() < 10 ? '0' + now.getDate() : '' + now.getDate();
    var timestamp = strYear + strMonth + strDate;

    return timestamp;
}

var monthNames = [ "January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December" ];

function getDescriptiveDateString(date){
    return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
}

// create server
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});