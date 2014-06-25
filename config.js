/**
 * This javscript file is responsible for configuring the application server. 
 * You can configure diffrent middleware that intercept/maipulate/redirect 
 * the request for various reasons.
 *
 * @author : Pritam Biswas
 **/
var bodyParser = require("body-parser");
module.exports = function(app, express) {
	//serve static contents, like index.html is rendered as root
	//of this application
	app.use('/', express.static(__dirname + '/public'));
	//middlewares that handles the request body
	app.use(bodyParser());
}
