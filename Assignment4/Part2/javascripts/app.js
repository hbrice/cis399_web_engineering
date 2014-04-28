
var main = function () {

    $(".tabs a span").toArray().forEach(function (element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function () {
            
            //Clear content in result when switching tabs
            $(".result").empty(); 

            //tabs switching stuff
            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
               renderDogTab();
            } else if ($element.parent().is(":nth-child(2)")) {
               renderPrimeTab();
            } else if ($element.parent().is(":nth-child(3)")) {
                //CANVAS DEMO
               $(".content").append(canvas);
            } else if ($element.parent().is(":nth-child(4)")) {
                //About me
                renderAboutMeTab();
                $(".content").append();
            }

            $(".content").append($content);
            return false;

        });
    });
    $(".tabs a:first-child span").trigger("click");
};

$(document).ready(main);
