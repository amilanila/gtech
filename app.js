
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	job = require('./routes/job'),
	http = require('http'),
	path = require('path'),
	GtechService = require('./routes/gtechservice').GtechService,
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
app.get('/users', user.list);
app.post('/addjob', job.addjob);

var gtechservice= new GtechService('localhost', 27017);

app.post('/addgtechservice', function(req, res){
	var id = crypto.randomBytes(20).toString('hex');
    var make = req.body.make;
    var model = req.body.model;
    var rego = req.body.rego;
    var name = req.body.name;
    var contact = req.body.contact;

    gtechservice.save({
	    'id': id,
        'make': make,
        'model': model,
        'rego': rego,
        'name': name,
        'contact': contact
    }, function( error, docs) {
        res.redirect('/findgtechservice')
    });
});

app.get('/findgtechservice', function(req, res){
    gtechservice.findAll(function( error, gtechservices) {
        res.render('index', {
            title: 'Gtech services',
            services:gtechservices
        });
    });
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});