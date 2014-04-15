var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,

InitService = function(host, port){		
	this.host = host;
	this.port = port;
};

InitService.prototype.db = function(callback){
	var db = new Db('gtech', new Server(this.host, this.port, {safe: false}, {auto_reconnect: true}, {}));
	db.open(function(){});
	
	callback(null, db);
};

exports.InitService = InitService;