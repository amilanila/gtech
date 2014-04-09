var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
    ManufactureService = require('./routes/ManufacturerService').ManufacturerService,
    ModelService = require('./routes/ModelService').ModelService,
    ServiceTypeService = require('./routes/ServiceTypeService').ServiceTypeService,
	JobService = require('./routes/JobService').JobService,
	crypto = require("crypto");

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

app.get('/', routes.index);

var varManufacturers = null;
var varModels = null;
var varServiceTypes = null;

/////////////////////////////////////// Manufactures ////////////////////////////////
var manufactureService= new ManufactureService('localhost', 27017);

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
var modelService= new ModelService('localhost', 27017);

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
        
        console.log(JSON.stringify(model));

        res.render('index', {
            'title': 'Models',
            'model': model,
            'models': varModels,            
            'manufacturers': varManufacturers
        });
    })
});

/////////////////////////////////////// Service Types ////////////////////////////////
var serviceTypeService= new ServiceTypeService('localhost', 27017);

app.post('/addServicetype', function(req, res){
    var id = crypto.randomBytes(20).toString('hex');
    var code = req.body.code;
    var name = req.body.name;
    var description = req.body.description;
    
    serviceTypeService.save({
        'id': id,
        'code': code,
        'name': name,
        'description': description
    }, function( error, docs) {
        res.redirect('/servicetype')
    });
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

/////////////////////////////////////// Services //////////////////////////////////////
var jobService= new JobService('localhost', 27017);

app.post('/addJob', function(req, res){
	var id = crypto.randomBytes(20).toString('hex');
    var make = req.body.make;
    var model = req.body.model;
    var rego = req.body.rego;
    var name = req.body.name;
    var contact = req.body.contact;
    var servicetypes = req.body.servicetype;
    var note = req.body.note;
        
    jobService.save({
	    'id': id,
        'make': make,
        'model': model,
        'rego': rego,
        'name': name,
        'contact': contact,
        'servicetypes': servicetypes,
        'note': note
    }, function( error, docs) {
        res.redirect('/job')
    });
});

app.get('/job', function(req, res){
    jobService.findAll(function( error, jobs) {
        res.render('index', {
            'title': 'Jobs',
            'jobs':jobs,
            'manufacturers': varManufacturers,
            'models': varModels,
            'serviceTypes': varServiceTypes
        });
    });
});

// create server
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});