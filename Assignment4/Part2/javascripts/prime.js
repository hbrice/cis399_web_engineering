/* Checks to see if number passed in is prime */
function isPrime(number){
    if(number == 0){
        return false; //not prime
    } else if(number == 1){ //prime
        return true;
    } else{ // for every other case
        for(var i = 2; i*i <=number; i++){
            if(number %i == 0) return i;
        }
        return true;
    }
};

function renderPrimeTab(){
    var $content,
                $input,
                $button,
                i;
     //PRIME CHECKER
    $input = $("<input>"),
    $(".content").append("Type in a number and I'll check if it is prime: ");
    $button = $("<button>").text("Submit");
    var line = "Type in a number and I'll check if it is prime: ";

    $button.on("click", function (event) {
        $(".result").empty();

        var intext = $input.val();
        if (intext !== "") {
            var result = isPrime($input.val()); //call function

            if(result == true){
            $(".result").append($input.val() + " is prime.");
            } else if(result == 0){
            $(".result").append($input.val() + " is not Prime!");
            } else { //result is a number
            $(".result").append($input.val() + " is not Prime, it is divisible by " + result + "!");
            }
            $input.val(""); 
        }
    });
    $content = $(".content").append($input).append($button);
}