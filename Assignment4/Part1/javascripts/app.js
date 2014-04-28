
var main = function () {

    $input = $("<input>"),
    $(".content").append("Type in a city,country: ");
    $button = $("<button>").text("Submit");

    //mouse click
    $button.on("click", function (event) {
        renderWeather();
    });
   
    /* for enter */
    $($input).on("keypress", function(event) {
        if(event.keyCode == 13) {
           renderWeather();
        }
    });

    $content = $(".content").append($input).append($button);
};

$(document).ready(main);
