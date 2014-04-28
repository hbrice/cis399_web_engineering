function renderAboutMeTab(){

    var $content;
    
    //ABOUT ME:
    $img = $("<img src='images/holly.jpg' id='holly' width='500' height='480'>");
    var line = "<br> I like running, playing video games, eating and playing Harry Potter Trivia.";
    console.log($img.src);
    $content = $(".content").append($img).append(line);
}


