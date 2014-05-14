
var express = require("express"),
    http = require("http"),
    connect = require("connect"),  //npm install connect
    model = require("./model.js"),
    app = express();

app.use(connect.urlencoded());  //this allows req.body

// set up a static file directory to use for default routing
app.use(express.static(__dirname + "/client"));

// Create our Express-powered HTTP server // and have it listen on port 3000
http.createServer(app).listen(3000);

app.get("/mongo.json", function (req, res){
    console.log("************************");
    var the_body = req.query; // {target: Rover}
    console.log ( "mongo get body: " + JSON.stringify( the_body ) );
    model.mongoGet( the_body, function( janswer ){ res.json ( janswer )} );

});

app.get("/getFinal.json", function (req, res){
    console.log("^^^^^^^^^^^^^^");
    var the_body = req.query; // {finalist: true}
    console.log(the_body);
    model.getFinalist( the_body, function ( janswer ){ res.json ( janswer )} );
});

app.get("/getFilter.json", function( req, res){
    console.log(".............");
    var the_body = req.query; // {length = 4}
    console.log(the_body);
    model.getFiltered( the_body, function( janswer ) { res.json( janswer )} );
});
