/**
 * This javascript file defines the request handlers that serves
 * the different APIs
 *
 * @author : creativemakers
 **/
var http = require("http");
var Repository = require("./repository").Repository;

var repo = new Repository("localhost", 27017);
/**
 * Define routes for each API
 **/
function route(app, worker) {

	app.get("/welcome", function(req, res) {
		res.json(200, {"message" : "Welcome to MedicRack"});
	});

    app.get("/searchByName/:name", function(req, res) {
        repo.getMedicinesByName(req.params.name, function (error, medicines){
            if (error) {
                res.send(500,error);
            } else {
                res.send(medicines);
            }
        })
    });

    app.post("/add", function(req, res) {
        repo.addMedicines(req.body, function (error, medicines){
            if (error) {
                res.send(500,error);
            } else {
                res.send(medicines);
            }
        })
    });
    
    app.post("/update", function(req, res) {
        repo.updateMedicines(req.body, function (errorList, records){
            if (errorList && errorList.length > 0) {
                res.send(500,errorList);
            } else {
                res.send(records);
            }
        })
    });
	
}	

exports.route = route;
