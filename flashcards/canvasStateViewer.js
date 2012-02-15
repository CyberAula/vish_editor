"use strict";

//function to create a canvas state with an img background
function CanvasStateViewer(canvas, img) {
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop, html;
  
  // **** First some setup! ****  
  this.canvas = canvas;
  this.backgroundImg = img; //background image to draw
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  
  this.libImages = new Object();
  this.libVideos = new Object();

  // **** Keep track of state! ****  
  this.valid = false; // when set to false, the canvas will redraw everything
  this.pois = [];  // the collection of things to be drawn
  this.drawingPoi = null;  //the specific Poi we are drawing big
  
  //***** finally some tricks to get mouse coordinates ****
  // This complicates things a little but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail  
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;
  
};

CanvasStateViewer.prototype.init = function(){
  var myState = this;

  //fixes a problem where double clicking causes text to get selected on the canvas
  this.canvas.addEventListener('selectstart', function (e) { e.preventDefault(); return false; }, false);

  this.canvas.addEventListener('click', function (e) {
    var mouse, mx, my, pois, len, i;

    mouse = myState.getMouse(e);
    mx = mouse.x;
    my = mouse.y;
    //first check if we are drawing a template
    if (myState.drawingPoi) {
      myState.drawingPoi.update(mx, my);
    }
    else {
      //if not drawing a template, check if click on any poi
      pois = myState.pois;
      len = pois.length;
      for (i = len - 1; i >= 0; i--) {
        if (pois[i].contains(mx, my)) {        
          myState.drawingPoi = pois[i];  
          myState.valid = false;
          return;  //finish this loop, it can´t be another poi
        }
      }
    }
  });

  setInterval(function () { myState.draw(); }, 1000/CanvasStateViewer.INTERVAL);
};

CanvasStateViewer.prototype.addPoi = function (poi) {
  this.pois.push(poi);
  this.valid = false;
};

CanvasStateViewer.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.width, this.height);
};

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasStateViewer.prototype.draw = function () {
  var ctx, pois, len, i, poi, mySel, roundedCorners;

  // if our state is invalid, redraw and validate!
  //if (!this.valid) {
    this.valid = true;
    
    ctx = this.ctx;
    pois = this.pois;
    this.clear();
    
    // draw background
    ctx.drawImage(this.libImages[this.backgroundImg], 0, 0);
    
    if(this.drawingPoi) {
      //draw rectangle in the background with some opacity      
      ctx.drawImage(this.libImages["libimages/filled.png"], 0, 0, CanvasStateViewer.WIDTH, CanvasStateViewer.HEIGHT);
    }
    
    //rounded corners
    ctx.drawImage(this.libImages["libimages/rounded_corners.png"], 0, 0);

    // draw all pois
    len = pois.length;
    for (i = 0; i < len; i++) {
      poi = pois[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (poi.x > this.width || poi.y > this.height ||
          poi.x + poi.width < 0 || poi.y + poi.height < 0) continue;
      pois[i].draw(ctx);
    }

    // draw an specific Poi
    if(this.drawingPoi){
      this.drawingPoi.drawInTemplate(ctx); 
    }
  //}
};

// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasStateViewer.prototype.getMouse = function (e) {
  var element, offsetX, offsetY, mx, my;
  element = this.canvas;
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
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  
  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
};

//draw an image keeping the aspect ratio centered inside the given rectangle
CanvasStateViewer.prototype.drawImageWithAspectRatio = function (content, dx, dy, dw, dh) {
  var ratio, tmpHeight, tmpWidth, finalx, finaly, finalw, finalh;
  
  if(content.constructor === Image || content.constructor == HTMLImageElement){  //Image in Chrome and HTMLImageElement in Firefox
    ratio = content.width / content.height;
    tmpHeight = dw * content.height / content.width;
    tmpWidth =  dh * content.width / content.height;
  }
  else{
    ratio = content.videoWidth / content.videoHeight;
    tmpHeight = dw * content.videoHeight / content.videoWidth;
    tmpWidth =  dh * content.videoWidth / content.videoHeight;
  }
  if(ratio > dw/dh){
    finalx = dx;
    finaly = dy + dh/2 - tmpHeight/2;
    finalw = dw;
    finalh = tmpHeight;    
  }
  else{
    finalx = dx + dw/2 - tmpWidth/2;
    finaly = dy;
    finalw = tmpWidth;
    finalh = dh; 
  }
  
  this.ctx.drawImage(content, finalx, finaly, finalw, finalh);  
};

//draw an image keeping the aspect ratio centered inside the given rectangle
CanvasStateViewer.prototype.drawImageWithAspectRatioAndRoundedCorners = function (content, dx, dy, dw, dh) {
  var ratio, tmpHeight, tmpWidth, finalx, finaly, finalw, finalh;
  
  //for development, draw rectangle in this zone to determine the size
  //this.ctx.fillStyle = 'rgba(255, 0, 93, .5)';
  //this.ctx.fillRect(dx, dy, dw, dh);
  
  if(content.constructor === Image || content.constructor == HTMLImageElement){  //Image in Chrome and HTMLImageElement in Firefox
    ratio = content.width / content.height;
    tmpHeight = dw * content.height / content.width;
    tmpWidth =  dh * content.width / content.height;
  }
  else{
    ratio = content.videoWidth / content.videoHeight;
    tmpHeight = dw * content.videoHeight / content.videoWidth;
    tmpWidth =  dh * content.videoWidth / content.videoHeight;
  }
  if(ratio > dw/dh){
    finalx = dx;
    finaly = dy + dh/2 - tmpHeight/2;
    finalw = dw;
    finalh = tmpHeight;    
  }
  else{
    finalx = dx + dw/2 - tmpWidth/2;
    finaly = dy;
    finalw = tmpWidth;
    finalh = dh; 
  }
  
  this.ctx.drawImage(content, finalx, finaly, finalw, finalh);
  
  this.drawRoundedCorners(finalx, finaly, finalw, finalh);
  
};

//draw rounded corners to a rectangle
CanvasStateViewer.prototype.drawRoundedCorners = function (dx, dy, dw, dh, type) {
  var cornerFile, finalx, finaly, finalw, finalh;
  //fix for firefox and explorer, draw the corners in a 2px bigger rectangle
  finalx = dx -1;
  finaly = dy -1;
  finalw = dw +2; //2px because the rectangle is 1 px bigger in each side
  finalh = dh +2;

  //select corner file to use
  if(type==="text") {
    cornerFile = canvasState.libImages['libimages/corner_small_text.png']
  }
  else if(finalw > 300 && finalh > 300){
    cornerFile = canvasState.libImages['libimages/corner.png'];
  }
  else {
    cornerFile = canvasState.libImages['libimages/corner_small.png']
  }
  
  //draw corners
  this.ctx.save();
  this.ctx.drawImage(cornerFile, finalx, finaly);
  this.ctx.translate(finalx + finalw, finaly);
  this.ctx.rotate(Math.PI/2);  
  this.ctx.drawImage(cornerFile, 0, 0);
  this.ctx.restore();
  this.ctx.save();
  this.ctx.translate(finalx + finalw, finaly + finalh);
  this.ctx.rotate(Math.PI); 
  this.ctx.drawImage(cornerFile, 0, 0);
  this.ctx.restore();
  this.ctx.save();
  this.ctx.translate(finalx, finaly + finalh);
  this.ctx.rotate(3*Math.PI/2);
  this.ctx.drawImage(cornerFile, 0, 0);
  this.ctx.restore(); 
}


//constants
CanvasStateViewer.WIDTH = 800;
CanvasStateViewer.HEIGHT = 600;
CanvasStateViewer.MIN_SIZE = 20;  //minimum number of pixels to consider that the user wants to create a poi
CanvasStateViewer.INTERVAL = 10;  //frames per second