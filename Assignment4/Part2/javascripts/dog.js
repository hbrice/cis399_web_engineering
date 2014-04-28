 //DOG VOTE
var map = {}; //create empty hash map

function renderDogTab() {

    $input = $("<input>"),
    $(".content").append("Write a name for my dog: ");
    $button = $("<button>").text("Submit");

    $button.on("click", function (event) {
        $(".result").empty();
        var intext = $input.val();

        if ($input.val() !== "") {
            
            /* checks to see if dog name is in the map */
            if(intext in map){
                map[intext]++;
            } else{
                map[intext] = 1;
            }
            console.log(map);
             // printing the string
            $(".result").append(intext + " now has " + map[intext] + " votes!");

            $input.val("");
        }
    });
    $content = $(".content").append($input).append($button);
}