var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
    crypto = require("crypto"),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    InitService = require('./routes/InitService').InitService
    ManufactureService = require('./routes/ManufacturerService').ManufacturerService,
    ModelService = require('./routes/ModelService').ModelService,
    ServiceTypeService = require('./routes/ServiceTypeService').ServiceTypeService,
    JobService = require('./routes/JobService').JobService;   

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
});

var varManufacturers = null;
var varModels = null;
var varServiceTypes = null;
var varJobs = null;
var makeModelMap = {};

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

/////////////////////////////////////// Model ////////////////////////////////
app.post('/model/save', function(req, res){
    var id = req.body.id;
    var make = req.body.make;
    var name = req.body.name;
    var description = req.body.description;

    if(id == '-1'){
        id = crypto.randomBytes(20).toString('hex');
        modelService.save({
            'id': id,
            'make': make,
            'name': name,
            'description': description        
        }, function( error, docs) {
            res.redirect('/model')
        });
    } else {
        modelService.update({
            'id': id,
            'make': make,
            'name': name,
            'description': description
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

/////////////////////////////////////// Service Types ////////////////////////////////
app.post('/servicetype/save', function(req, res){
    var id = req.body.id;
    var code = req.body.code;
    var name = req.body.name;
    var description = req.body.description;
    
    if(id == '-1'){
        id = crypto.randomBytes(20).toString('hex');
        serviceTypeService.save({
            'id': id,
            'code': code,
            'name': name,
            'description': description
        }, function( error, docs) {
            res.redirect('/servicetype')
        });
    } else {
        serviceTypeService.update({
            'id': id,
            'code': code,
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

/////////////////////////////////////// Services //////////////////////////////////////
app.post('/job/save', function(req, res){
	var id = req.body.id;
    var make = req.body.make;
    var model = req.body.model;
    var rego = req.body.rego;
    var name = req.body.name;
    var contact = req.body.contact;
    var servicetype = req.body.jobservicetype;
    var note = req.body.note;
    var status = req.body.status;

    if(id == '-1'){        
        id = crypto.randomBytes(20).toString('hex');
        jobService.save({
            'id': id,
            'make': make,
            'model': model,
            'rego': rego,
            'name': name,
            'contact': contact,
            'servicetypes': servicetype,
            'note': note,
            'status': status
        }, function( error, docs) {
            res.redirect('/job')
        });
    } else {
        jobService.update({
            'id': id,
            'make': make,
            'model': model,
            'rego': rego,
            'name': name,
            'contact': contact,
            'servicetypes': servicetype,
            'note': note,
            'status': status
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

// create server
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});