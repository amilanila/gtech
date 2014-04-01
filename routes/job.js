/**
 * New node file
 */

var mongo = require('mongodb').MongoClient;

exports.addjob = function(){
	return function(req, res) {
		var self = this;
		var db = null;
		
		mongo.connect('mongodb://' + 'localhost' + ':' + '27017' + '/gtech', function(err, db) {
			if(err) {
				console.log('Sorry, there is no mongo db server running.');
			} else {
				self.db = db;
			}
		});
		
        // Get our form values. These rely on the "name" attributes
        var make = req.body.make;
        var model = req.body.model;
        var rego = req.body.rego;
        var name = req.body.name;
        var contact = req.body.contact;

        // Set our collection
        var collection = db.get('gtech');

        // Submit to the DB
        collection.insert({
            "make" : make,
            "model" : model,
            "rego" : rego,
            "name" : name,
            "contact" : contact
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                res.location("users");
                // And forward to success page
                res.redirect("users");
            }
        });
	}
};