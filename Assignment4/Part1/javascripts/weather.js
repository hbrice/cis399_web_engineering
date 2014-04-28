function getWindDirection ( degrees ){
    var winddirection;
    if(degrees == 0){
        return winddirection = "N";
    } else if( 90 > degrees && degrees > 0){
        console.log("acceptable");
        return winddirection = "NE";
    } else if(degrees == 90){
        return winddirection = "E";
    } else if(180 > degrees && degrees > 90){
        return winddirection = "SE";
    } else if(degrees == 180){
        return winddirection = "S";
    } else if( 270 > degrees && degrees > 180){
        return winddirection = "SW";
    } else if(degrees == 270){
        return winddirection = "W";
    } else if( 360 > degrees && degrees > 270) {
        return winddirection = "NW";
    } else {
        console.log("couldn't find the direction of the wind");
        return "ERROR: Couldn't find wind direction!";
    }
};


function getCloudType ( clouds ){
    var cloudType;
    if( clouds == 0 ){
        return "Clear Skies";
    } else if( clouds > 0 && clouds <= 25 ) {
        return "Chance of Clouds";
    } else if( clouds > 25 && clouds <= 50 ) {
        return "Broken Clouds";
    } else if( clouds == 50 ){
        return "Partially Cloudy";
    } else if ( clouds > 50 && clouds <= 75){
        return "Mostly Cloudy";
    } else if (clouds > 75 && clouds < 100){
        return "Cloudy";
    } else if (clouds == 100) {
        return "No blue sky in sight";
    } else {
        return "ERROR: Couldn't return cloud type";
    }
};


function renderWeather() {
    $(".result").empty();
        var intext = $input.val();

        var url = "http://api.openweathermap.org/data/2.5/weather?q=";
        var addToUrl = "";
        url = url + intext;

        //bring me something from this url without reloading page.
        $.ajax({
            type: "GET",
            url: url
        }).done(function( response ) {

            var location = response.name;
            console.log("name: " + location);
            var humidity = response.main.humidity;
            console.log("humidity: " + humidity);
            var windspeed = response.wind.speed;
            console.log("windspeed: " + windspeed);
            var winddeg = Math.round( response.wind.deg );
            console.log("winddeg: " + winddeg);
            var clouds = response.clouds.all;
            console.log("clouds: " + clouds);

            if( intext !== ""){
                var winddirection;
                winddirection = getWindDirection(winddeg);
                var cloudType;
                cloudType = getCloudType( clouds );
               // console.log("Intext: " + intext);
                $(".result").append("City: " + location);
                $(".result").append("<br>");
                $(".result").append("Humidity: " + humidity + "%");
                $(".result").append("<br>");
                $(".result").append("Windspeed: " + windspeed);
                $(".result").append("<br>");
                $(".result").append("The wind is coming from the " + winddirection);
                $(".result").append("<br>");
                $(".result").append("Clouds: " + cloudType);

                //clear input box
                $input.val("");
            }
        });
};