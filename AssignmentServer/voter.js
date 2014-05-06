// Holly Brice Dog Code
 //DOG VOTE
var map = {}; //create empty hash map

function dogChecker( x, callBack ) { //callBack
    console.log("**Inside dogChecker function.");
    var input = x;
    if (input !== "") {
        /* checks to see if dog name is in the map */
        if(input in map){
            map[input]++;
        } else{
            map[input] = 1;
        }
        console.log(map);
    return {"result": true, "Message": input + " now has " + map[input] + " votes"};
    }
};

//this says i'm exporting this function. whoever wants to use it can have access to this
module.exports = {
	"dogChecker": dogChecker
};

//to run code, run in vagrant