VISH.Mods.fc.player = (function(V, $, undefined){
    //constants
    var INTERVAL = 12;  //frames per second
    var WIDTH = 800;
    var HEIGHT = 600;
    var NUMBER_OF_FRAMES = 10; //number of frames that the animation representing the poi have
    var FRAME_WIDTH = 40; //width of each poi frame
    var FRAME_HEIGHT = 40; //height of each poi frame
    
    var canvas = null;
    var ctx = null;
    var flashcard = null;
    var status = null;
    
    //Initialize the player for this flashcard
    var init = function(fcElem, slideState) {
        var loadingImg;
        //parse the flashcard json
        flashcard = JSON.parse(fcElem.jsoncontent);
        status = slideState;
        
        // Get the canvas element.
        canvas = document.getElementById(fcElem.canvasid);
        // Resize canvas to fit image    
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        
        loadingImg = V.Utils.loader.getImage("libimages/loading.png");
        
        //first draw the loading image
        ctx = canvas.getContext('2d');
        ctx.drawImage(loadingImg, 0, 0);
        
        V.Mods.fc.template.init(ctx);
        
        //call update and draw in each interval
        setInterval(function () {
            update();
            draw();
        }, 1000/INTERVAL);
    };
    
    var update = function(){        
        status.poiFrameNumber = (status.poiFrameNumber + 1) % NUMBER_OF_FRAMES;  //10 is the number of sprites that the animation have    
    };
    
    var draw = function(){
        var poi, animX;
        
        // draw background
        ctx.drawImage(V.Utils.loader.getImage(flashcard.backgroundSrc), 0, 0);
        //rounded corners
        ctx.drawImage(V.Utils.loader.getImage("libimages/rounded_corners.png"), 0, 0);
        
        // draw all pois
        for (var i = 0; i < flashcard.pois.length; i++) {
            poi = flashcard.pois[i];
            
            //the animation has frames in the same line and all 40x40px
            animX = status.poiFrameNumber * FRAME_WIDTH;
            ctx.drawImage(V.Utils.loader.getImage('libimages/anim.png'), animX, 0, FRAME_WIDTH, FRAME_HEIGHT, poi.x, poi.y, FRAME_WIDTH, FRAME_HEIGHT);
        }
        
        if(status.drawingPoi > 0){
            V.Mods.fc.template.draw(flashcard.pois[status.drawingPoi-1]);
        }
        
        
        
    };
    
    return {        
        init       : init
    };

})(VISH, jQuery);

