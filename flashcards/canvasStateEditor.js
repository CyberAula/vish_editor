"use strict";

//function to create a canvas state with an img background
function CanvasStateEditor(canvas, img) {
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop, html, myState;

  // **** First some setup! ****  
  this.canvas = canvas;
  this.backgroundImg = img; //background image to draw
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');

  //This complicates things a little but fixes mouse co-ordinate problems
  //when there's a border or padding. See getMouse for more detail  
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null).paddingLeft, 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null).paddingTop, 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null).borderLeftWidth, 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null).borderTopWidth, 10)   || 0;
  }

  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // **** Keep track of state! ****  
  this.valid = false; // when set to false, the canvas will redraw everything
  this.pois = [];  // the collection of things to be drawn
  this.dragging = false; // Keep track of when we are dragging
  this.creating = false; // Keep track when we are creating a new poi
  this.startx = 0; // start point x when creating
  this.starty = 0;  // start point y when creating
  this.endx = 0;  //end point x when moving the mouse to create a new poi
  this.endy = 0;  // end point y when moving the mouse to create a new poi
  this.selection = null; // the current selected object
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;

  // **** Then events! ****  
  // This is an example of a closure!
  // Right here "this" means the CanvasStateEditor. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasStateEditor in the events we have to save a reference to it.
  // This is our reference!
  myState = this;

  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function (e) { e.preventDefault(); return false; }, false);

  // Up, down, and move are for dragging
  canvas.addEventListener('mousedown', function (e) {
    var mouse, mx, my, pois, len, i, mySel;

    mouse = myState.getMouse(e);
    mx = mouse.x;
    my = mouse.y;
    pois = myState.pois;
    len = pois.length;
    for (i = len - 1; i >= 0; i--) {
      if (pois[i].contains(mx, my)) {
        mySel = pois[i];
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.dragging = true;
        myState.selection = mySel;
        myState.valid = false;
        return;
      }
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (myState.selection) {
      myState.selection = null;
      myState.valid = false; // Need to clear the old selection border
    }
    //the user has clicked outside any poi, start drawing a new poi
    myState.creating = true;
    myState.startx = mx;
    myState.starty = my;
    myState.endx = mx;  // set also end because it starts to be drawn inmediately
    myState.endy = my;
  }, true);

  canvas.addEventListener('mousemove', function (e) {
    var mouse;
    if (myState.dragging) {
      mouse = myState.getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy;
      myState.valid = false; // Something's dragging so we must redraw
    } else if (myState.creating) {
      mouse = myState.getMouse(e);
      myState.endx = mouse.x;
      myState.endy = mouse.y;
      myState.valid = false; // Redraw the new half created poi
    }
  }, true);

  canvas.addEventListener('mouseup', function (e) {
    var mouse, tmp, width, height;
    myState.dragging = false;
    if (myState.creating) {
      mouse = myState.getMouse(e);
      myState.endx = mouse.x;
      myState.endy = mouse.y;
      if (myState.startx > myState.endx) {  //switch between start and end
        tmp = myState.endx;
        myState.endx = myState.startx;
        myState.startx = tmp;
      }
      if (myState.starty > myState.endy) {  //switch between start and end
        tmp = myState.endy;
        myState.endy = myState.starty;
        myState.starty = tmp;
      }
      width = myState.endx - myState.startx;
      height = myState.endy - myState.starty;
      //if width or heigh is bigger than MIN_SIZE create the poi
      if (width > CanvasStateEditor.MIN_SIZE || height > CanvasStateEditor.MIN_SIZE) {
        myState.addPoiFromParams(myState.startx, myState.starty, myState.endx - myState.startx, myState.endy - myState.starty);
      }
      myState.creating = false;
      myState.startx = 0;
      myState.starty = 0;
      myState.endx = 0;
      myState.endy = 0;
      myState.valid = false; // Redraw everything, we have created a new poi
    }
  }, true);

  // double click for making new pois
  canvas.addEventListener('dblclick', function (e) {
    var mouse;
    mouse = myState.getMouse(e);
    myState.addPoiFromParams(mouse.x - 10, mouse.y - 10, 20, 20);
  }, true);

  // **** Options! ****  
  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;
  setInterval(function () { myState.draw(); }, CanvasStateEditor.INTERVAL);
}

CanvasStateEditor.prototype.addPoi = function (poi) {
  this.pois.push(poi);
  this.valid = false;
};

//method to get the Maximun id of the Pois, used to choose the id to add a new one
CanvasStateEditor.prototype.getMaxPoiId = function () {
  var len, maxId, poi, i;

  len = this.pois.length;
  maxId = 0;
  for (i = 0; i < len; i++) {
    poi = this.pois[i];
    if (poi.id > maxId) {
      maxId = poi.id;
    }
  }
  return maxId;
};

CanvasStateEditor.prototype.addPoiFromParams = function (x, y, width, height) {
  var id, poi;
  id = this.getMaxPoiId() + 1;
  poi = new Poi(id, x, y, width, height);
  this.addPoi(poi);
};

CanvasStateEditor.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.width, this.height);
};

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasStateEditor.prototype.draw = function () {
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

    //if creating draw a special rectangle from start point to end point
    if (this.creating) {
      ctx.fillStyle = 'rgba(245, 222, 179, .4)';
      ctx.fillRect(this.startx, this.starty, this.endx - this.startx, this.endy - this.starty);
    }

    // draw selection
    // right now this is just a stroke along the edge of the selected poi
    if (this.selection !== null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      mySel = this.selection;
      ctx.strokeRect(mySel.x, mySel.y, mySel.width, mySel.height);
    }

    // ** Add stuff you want drawn on top all the time here **    
    this.valid = true;
  }
};

// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasStateEditor.prototype.getMouse = function (e) {
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


//constants
CanvasStateEditor.MIN_SIZE = 20;  //minimum number of pixels to consider that the user wants to create a poi
CanvasStateEditor.INTERVAL = 30;  //number of times per second that we refresh the image