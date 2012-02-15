"use strict";

//function to create a canvas state with an img background
function CanvasState(canvas, img) {
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop, html;
  
  // **** First some setup! ****  
  this.canvas = canvas;
  this.backgroundImg = img; //background image to draw
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');  
  
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

  // **** Keep track of state! ****  
  this.valid = false; // when set to false, the canvas will redraw everything
  this.pois = [];  // the collection of things to be drawn
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function (e) { e.preventDefault(); return false; }, false);
  
  setInterval(function () { myState.draw(); }, CanvasState.INTERVAL);
}

CanvasState.prototype.addPoi = function (poi) {
  this.pois.push(poi);
  this.valid = false;
}

CanvasState.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function () {
  var ctx, pois, len, i, poi, mySel;
  
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    ctx = this.ctx;
    pois = this.pois;
    this.clear();
    
    // ** Add stuff you want drawn in the background all the time here **
    // Load the image into the context.
    ctx.drawImage(this.backgroundImg, 0, 0);
    
    // draw all pois
    len = pois.length;
    for (i = 0; i < len; i++) {
      poi = pois[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (poi.x > this.width || poi.y > this.height ||
          poi.x + poi.width < 0 || poi.y + poi.height < 0) continue;
      pois[i].draw(ctx);
    }
            
    // draw selection
    // right now this is just a stroke along the edge of the selected poi
    if (this.selection != null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      mySel = this.selection;
      ctx.strokeRect(mySel.x,mySel.y,mySel.width,mySel.height);
    }
    
    // ** Add stuff you want drawn on top all the time here **
    
    this.valid = true;
  }
}

// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function (e) {
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
}


//constants
CanvasState.MIN_SIZE = 20;  //minimum number of pixels to consider that the user wants to create a poi
CanvasState.INTERVAL = 30;  //number of times per second that we refresh the image