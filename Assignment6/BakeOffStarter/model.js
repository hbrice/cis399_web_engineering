var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/targets'); //targets = name of db

//schema is a layout, model is the actual table and their types
var simple_schema = mongoose.Schema( {"target": String, "count": Number, "finalist": Boolean }); //Number is a class

//naming the table "dog"
var simple_model = mongoose.model( "dog", simple_schema);

var cnt;
var fin;

function mongoGet( body, callBack ) { 
	console.log("inside mongoGet.");
	console.log(JSON.stringify( body ));

	simple_model.find({"target": body.target}, function( err, result ){
		if(result.length === 0 ){
			simple_model.findOneAndUpdate( {"target": body.target}, {"count": 1, "finalist":false }, {"new":true, "upsert": true}, function( err, doc ){/*initally empty*/} );
			callBack({"message": "not found", "target": body.target, "count":1, "finalist":false});
		} else {
			cnt = (result[0].count);
			cnt++;
			console.log("bob "+ cnt);
			if(cnt >= 5){
				fin = true;
			} else {
				fin = false;
			}
			console.log("****" + cnt, fin);
		simple_model.findOneAndUpdate( {"target": body.target}, {"count": cnt, "finalist":fin }, {"new":true, "upsert": true}, function( err, doc ){/*initally empty*/} );
		callBack({"message": "found", "target": body.target, "count": cnt, "finalist": fin});

		}
	});

} //end of function

function getFinalist( body, callBack ){
	console.log("inside get Finalst");
	simple_model.find( body, function( err, doc) {
		if(doc.length === 0){
			callBack({"message": "not found"});
		} else{
			callBack({"message": "found", "list": doc});
		}
	});
} //end of function

function getFiltered( body, callBack ){
	console.log("inside getFiltered");
	simple_model.find({$where: 'this.target.length < ' + body.len+1} , function (err, doc){
		if(doc.length === 0){
			callBack({"message": "not found"});
		} else{
			console.log( "%%" + JSON.stringify( doc ) );
			callBack({"message": "found", "list": doc, "len":body.len});
		}
	});
} //end of function

module.exports = {
      "mongoGet": mongoGet,
      "getFinalist": getFinalist,
      "getFiltered": getFiltered
};