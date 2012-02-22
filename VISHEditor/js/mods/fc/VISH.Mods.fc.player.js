VISH.Mods.fc.player = (function(V, $, undefined){
    //constants
    var INTERVAL = 10;  //frames per second
    var WIDTH = 800;
    var HEIGHT = 600;
    var NUMBER_OF_FRAMES = 10; //number of frames that the animation representing the poi have
    var FRAME_WIDTH = 40; //width of each poi frame
    var FRAME_HEIGHT = 40; //height of each poi frame
    
    var canvas = null;
    var ctx = null;
    var flashcard = null;
    var slideId = null;
    
    var intervalReturn = null; //to clear interval
    
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
    
    //Initialize the player for this flashcard
    var init = function(fcElem, mySlideId) {
        var loadingImg;
        //parse the flashcard json
        flashcard = JSON.parse(fcElem.jsoncontent);
        slideId = mySlideId;
        
        // Get the canvas element.
        canvas = document.getElementById(fcElem.canvasid);
        // Resize canvas to fit image    
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        
        loadingImg = V.Utils.loader.getImage("libimages/loading.png");
        
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
    
    var update = function(){
        var myState;
        myState = V.SlideManager.getStatus(slideId);
        myState.poiFrameNumber = (myState.poiFrameNumber + 1) % NUMBER_OF_FRAMES;  //10 is the number of sprites that the animation have
        
        V.SlideManager.updateStatus(myState.id, myState);
    };
    
    var draw = function(){
        var poi, animX;
        
        var myState;
        myState = V.SlideManager.getStatus(slideId);
        
        // draw background
        ctx.drawImage(V.Utils.loader.getImage(flashcard.backgroundSrc), 0, 0, WIDTH, HEIGHT);
        //rounded corners
        ctx.drawImage(V.Utils.loader.getImage("libimages/rounded_corners.png"), 0, 0);
        
        // draw all pois
        for (var i = 0; i < flashcard.pois.length; i++) {
            poi = flashcard.pois[i];
            
            //the animation has frames in the same line and all 40x40px
            animX = myState.poiFrameNumber * FRAME_WIDTH;
            ctx.drawImage(V.Utils.loader.getImage('libimages/anim.png'), animX, 0, FRAME_WIDTH, FRAME_HEIGHT, poi.x, poi.y, FRAME_WIDTH, FRAME_HEIGHT);
        }
        
        if(myState.drawingPoi > 0){
            V.Mods.fc.template.draw(flashcard.pois[myState.drawingPoi-1]);
        }
    };
    
    //function to clear params and stop animations
    var clear = function(){
        clearInterval(intervalReturn);
    };
    
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

