/**
 * This javascript file is responsible to create an app server.
 * It forks separate process for each core of the CPU,
 * thus replicates the web server to each core of the CPU to scale out the application.
 * It routes each requests to request handler. This functionality
 * is exposed through start() function.
 *
 * @author : Pritam Biswas
 **/
var cluster = require("cluster");
var os = require("os");

/**
 * Start the app server, configure it and forked
 * separate processes for multi-core CPU.
 **/
function start() {
	if (cluster.isMaster) {
		var noOfCore = os.cpus().length;
		console.log(noOfCore + " core detected in the system...");
		// Fork workers
		for (var cpuIndex = 0; cpuIndex < noOfCore; cpuIndex++) {
			var worker = cluster.fork();
			console.log("forked worker#" + worker.id);
		}
		//shut down hook
		cluster.on("exit", function(worker, code, signal) {
			console.log("worker#" + worker.id + " died");
			//if a worker died, fork another worker
			var newWorker = cluster.fork();
			console.log("forked worker#" + newWorker.id);
		});
		//Irrecoverable error
		cluster.on("error", function(e) {
			console.log("error for the shut down is : " + e);
		});
    } else {
		console.log("worker#"+ cluster.worker.id + " initiated...");
		var express = require("express");
		var configure = require("./config");
		var router = require("./route");
		var app = express();
		//configure this application
		configure(app, express);
		router.route(app, cluster.worker);
		app.listen(8888);
		console.log("Server running at "+ os.hostname() + ":8888");
    }
}

module.exports.start=start;
