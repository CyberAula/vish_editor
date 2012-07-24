VISH.Mods.fc.player = (function(V, $, undefined){
    //constants
    var INTERVAL = 10;  //frames per second
    var WIDTH = 800;    //width of the canvas
    var HEIGHT = 600;   //height of the canvas
    
    var NUMBER_OF_FRAMES = 10; //number of frames that the animation representing the poi have
    var FRAME_WIDTH = 40; //width of each poi frame
    var FRAME_HEIGHT = 40; //height of each poi frame
    
    var canvas = null;
    var ctx = null;
    var flashcard = null;
    var slideId = null;
    
    //object used to capture setInterval and after that clear interval when needed (after passing to the next slide in the presentation)
    var intervalReturn = null;
    
    //***** finally some tricks to get mouse coordinates ****
    // This complicates things a little but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail  
    var stylePaddingLeft = null;
    var stylePaddingTop  = null;
    var styleBorderLeft  = null;
    var styleBorderTop   = null;  
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var htmlTop = null;
    var htmlLeft = null;
    
    
    /**
     * Initialize the player for this flashcard
     */
    var init = function(fcElem, mySlideId) {
        var loadingImg;
        //parse the flashcard json
        var tmpFlashcard = JSON.parse(fcElem.jsoncontent);
        flashcard = _removeNotPlayableVideos(tmpFlashcard);
        slideId = mySlideId;
        
        // Get the canvas element.
        canvas = document.getElementById(fcElem.canvasid);
        // Resize canvas to fit image    
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        
        loadingImg = V.Utils.loader.getImage(VISH.ImagesPath + "loading.png");
        
        //first draw the loading image
        ctx = canvas.getContext('2d');
        ctx.drawImage(loadingImg, 0, 0);
        
        V.Mods.fc.template.init(ctx, slideId);
        
        _initGetMouseVariables();
        _initListeners();
        
        //call update and draw in each interval
        intervalReturn = setInterval(function () {
            update();
            draw();
        }, 1000/INTERVAL);
    };
    
    /**
     * update the status of this flashcard
     */
    var update = function(){
        var myState;
        myState = V.SlideManager.getStatus(slideId);
        myState.poiFrameNumber = (myState.poiFrameNumber + 1) % NUMBER_OF_FRAMES;  //10 is the number of sprites that the animation have
        
        V.SlideManager.updateStatus(myState.id, myState);
    };
    
    /**
     * draw this flashcard depending on its status
     */
    var draw = function(){
        var poi, animX;
        
        var myState;
        myState = V.SlideManager.getStatus(slideId);
        
        // draw background
        ctx.drawImage(V.Utils.loader.getImage(flashcard.backgroundSrc), 0, 0, WIDTH, HEIGHT);
        //rounded corners
        ctx.drawImage(V.Utils.loader.getImage(VISH.ImagesPath + "rounded_corners.png"), 0, 0);
        
        // draw all pois
        for (var i = 0; i < flashcard.pois.length; i++) {
            poi = flashcard.pois[i];
            
            //the animation has frames in the same line and all 40x40px
            animX = myState.poiFrameNumber * FRAME_WIDTH;
            ctx.drawImage(V.Utils.loader.getImage(VISH.ImagesPath + 'anim.png'), animX, 0, FRAME_WIDTH, FRAME_HEIGHT, poi.x, poi.y, FRAME_WIDTH, FRAME_HEIGHT);
        }
        
        if(myState.drawingPoi > 0){
            V.Mods.fc.template.draw(flashcard.pois[myState.drawingPoi-1]);
        }
    };
    
    /**
     * function to clear params and stop animations
     * used when passing to the next slide to "stop" this flashcard
     */
    var clear = function(){
        clearInterval(intervalReturn);
    };
    
    /**
     * function to remove from the flashcard object the video types that are not playable
     * TODO, if not any playable video substitute the zone by an image with "video type incorrect"
     */
    var _removeNotPlayableVideos = function(fc){
        var poi, zone;
        var tmpVideo = document.createElement('video');
        for (var i = 0; i < fc.pois.length; i++) {
            poi = fc.pois[i];
            for(var a = 0; a < poi.zonesContent.length;a++){
                zone = poi.zonesContent[a];
                if(zone.type==="video"){
                    for(var t = 0; t < zone.content.length; t++){                        
                        if(tmpVideo.canPlayType(zone.content[t].mimetype)){
                            //substitute content for the playable content
                            zone.content = zone.content[t].src;
                        }
                    }
                }
            }            
        }
        return fc;        
    };
    
    /**
     * private function to initialize the mouse variables to get the position of the click
     */
    var _initGetMouseVariables = function(){
        var html;
        if (document.defaultView && document.defaultView.getComputedStyle) {
          stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
          stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
          styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
          styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
        }
        // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
        // They will mess up mouse coordinates and this fixes that
        html = document.body.parentNode;
        htmlTop = html.offsetTop;
        htmlLeft = html.offsetLeft;  
    };
    
    /**
     * function to add click listeners to canvas and check where the user have clicked
     */
    var _initListeners = function(){
        var myState;
        myState = V.SlideManager.getStatus(slideId);
        
        //fixes a problem where double clicking causes text to get selected on the canvas
        canvas.addEventListener('selectstart', function (e) { e.preventDefault(); return false; }, false);
      
        canvas.addEventListener('click', function (e) {
          var mouse, mx, my, poi;
      
          mouse = _getMouse(e);
          mx = mouse.x;
          my = mouse.y;
          //first check if we are drawing a template
          if(myState.drawingPoi > 0){
            V.Mods.fc.template.update(flashcard.pois[myState.drawingPoi-1], mx, my);
          }
          else {
            //if not drawing a template, check if click on any poi           
            for (var i = 0; i < flashcard.pois.length; i++) {
                poi = flashcard.pois[i];
                if((poi.x <= mx) && (poi.x + FRAME_WIDTH >= mx) && (poi.y <= my) && (poi.y + FRAME_HEIGHT >= my)){
                    myState.drawingPoi = poi.id;
                    V.SlideManager.updateStatus(myState.id, myState);
                }
            }            
          }
        });
    };    
    
    /**
     * private function to get mouse coordinates
     */
    var _getMouse = function (e) {
        var element, offsetX, offsetY, mx, my;
        element = canvas;
        offsetX = 0;
        offsetY = 0;
        
        // Compute the total offset
        if (element.offsetParent !== undefined) {
          do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
          } while ((element = element.offsetParent));
        }
      
        // Add padding and border style widths to offset
        // Also add the <html> offsets in case there's a position:fixed bar
        offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
        offsetY += stylePaddingTop + styleBorderTop + htmlTop;
      
        mx = e.pageX - offsetX;
        my = e.pageY - offsetY;
        
        // We return a simple javascript object (a hash) with x and y defined
        return {x: mx, y: my};
    };
    
    return {        
        init       : init,
        clear      : clear
    };

})(VISH, jQuery);

