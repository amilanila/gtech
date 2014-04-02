/**
 * New node file
 */

var mongo = require('mongodb').MongoClient,
    crypto = require("crypto");

exports.addjob = function(req, res, next){
    console.log("1111111111111111111111111111111111111111111111111111111111111111111")
	
	mongo.connect('mongodb://' + 'localhost' + ':' + '27017' + '/gtech', function(err, db) {
		if(err) {
			console.log('Sorry, there is no mongo db server running.');
		} else {			
            // Get our form values. These rely on the "name" attributes
            var id = crypto.randomBytes(20).toString('hex');
            var make = req.body.make;
            var model = req.body.model;
            var rego = req.body.rego;
            var name = req.body.name;
            var contact = req.body.contact;

            console.log(id + " : " + make + " : " + model + " : " + rego + " : " + name + " : " + contact + " >> " + db);

            // Submit to the DB
            db.job.insert({
                "id" : id,
                "make" : make,
                "model" : model,
                "rego" : rego,
                "name" : name,
                "contact" : contact
            }, function (err, doc) {
                if (err) {
                    console.log("There was a problem adding the information to the database.");
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
	});
};