var mongoose = require("mongoose"),
	mongoUrl;

//NEW STUFF ADDED
if(process.env.VCAP_SERVICES){
    services = JSON.parse(process.env.VCAP_SERVICES);
    console.log( JSON.stringify( services ));
    mongoUrl = services["mongolab"][0].credentials.uri;
} else {
    //we use this for cloud foundry
    mongoUrl = "mongodb://localhost/targets";
}

//test out mongoose
mongoose.connect(mongoUrl); //targets = name of db

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log( "moongoose connection!");
});


//schema is a layout, model is the actual table and their types
var simple_schema = mongoose.Schema( {"target": String, "count": Number, "finalist": Boolean, "voters": String }); //Number is a class

//naming the table "dog"
var simple_model = mongoose.model( "dog", simple_schema);

var cnt;
var fin;
var voters;
var newVoters;
function mongoGet( body, callBack ) { 
	console.log("inside mongoGet.");
	console.log(JSON.stringify( body )); //{target: steve, voter: andy}

	simple_model.find({"voters": {$regex: body.voter, $options: 'i' } }, function( err, result ){
		console.log("** body.voter = " + body.voter);
		console.log("result.length = " + result.length);
		if(result.length === 0 ){
			//vote
			console.log(body.voter + " has not voted.");
			simple_model.find({"target": body.target}, function( err2, result2 ){
				console.log("result2.length = " + result2.length);
				if(result2.length === 0 ){
					simple_model.findOneAndUpdate( {"target": body.target}, {"count": 1, "finalist":false, "voters": body.voter}, {"new":true, "upsert": true}, function( err, doc ){/*initally empty*/} );
					callBack({"message": "not found", "target": body.target, "count":1, "finalist":false, "voters": body.voter} );
				} else {
					console.log(JSON.stringify( result ));
					voters = (result2[0].voters);
					console.log("voters: " + voters);
					newVoters = voters + ',' + body.voter;
					cnt = (result2[0].count);
					cnt++;
					console.log("bob "+ cnt);
					if(cnt >= 5){
						fin = true;
					} else {
						fin = false;
					}
					console.log("****" + cnt, fin);
					simple_model.findOneAndUpdate( {"target": body.target}, {"count": cnt, "finalist":fin, "voters": newVoters }, {"new":true, "upsert": true}, function( err, doc ){/*initally empty*/} );
					callBack({"message": "found", "target": body.target, "count": cnt, "finalist": fin, "voters": newVoters});
				}
			});
		} else{
			//don't vote
			console.log(body.voter + " has voted.");
		//	alert("You can only vote once you Silly Nanny!");
			callBack({"message": "already voted", "voter": body.voter});

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