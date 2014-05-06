console.log("Accessed server.js page.");

var express = require("express"), 
	http = require("http"),
	pc = require("./voter.js"), //this is the little modulate at the bottom of prime checker
	app = express();

// set up a static file directory to use for default routing
// also see the note below about Windows
app.use(express.static(__dirname + "/client"));
console.log("Set up static file directory for default routing.");

// Create our Express-powered HTTP server // and have it listen on port 3000
http.createServer(app).listen(3000);
console.log("created express server");

    // set up our routes
app.get("/dogcheck", function (req, res) { 
		console.log("inside app.get");
		console.log( req );
		var my_object = req.query; //{target: 111}
		var the_response = pc.dogChecker( my_object.target );
		console.log("The response: (next line).");
		console.log(JSON.stringify(the_response, null, 4)); //it is getting the correct thing
		res.json( the_response );
		console.log("sent the response.");
		//res.send("Hello World!");
});

//goal call to prime check, get value and pass back to client