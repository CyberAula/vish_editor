"use strict";

// Constructor for Poi (points of interest) objects
// For now they will just be defined as rectangles.
function Poi(id, x, y, width, height, fill, templateNumber, zonesContent) {
  // This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  // "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  // But we aren't checking anything else! We could put "Lalala" for the value of x 
  this.id = id || 0;
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 1;
  this.height = height || 1;
  this.fill = fill || 'rgba(255, 0, 93, .5)';
  this.drawingFrame = 0;  //first frame
  
  this.template = new Template(templateNumber, zonesContent);  
};

// Determine if a point is inside the poi's bounds
Poi.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the poi's X and (X + Height) and its Y and (Y + Height)
  return  (this.x <= mx) && (this.x + this.width >= mx) &&
          (this.y <= my) && (this.y + this.height >= my);
};

//click event when drawing this poi template
Poi.prototype.update = function (mx, my) {
  this.template.update(mx, my);  
}

// Draws this poi (only the rectangle) to a given context
Poi.prototype.draw = function(ctx) {
  //ctx.fillStyle = this.fill;
  //ctx.fillRect(this.x, this.y, this.width, this.height);
  
  //the animation has frames in the same line and all 40x40px
  var animX = this.drawingFrame * Poi.FRAME_WIDTH;
  
  ctx.drawImage(canvasState.libImages[Poi.ANIMATION_PATH], animX, 0, Poi.FRAME_WIDTH, Poi.FRAME_HEIGHT, this.x, this.y, Poi.FRAME_WIDTH, Poi.FRAME_HEIGHT);
  this.drawingFrame = (this.drawingFrame + 1) % Poi.NUMBER_OF_FRAMES;  //10 is the number of sprites that the animation have
  
  ctx.font = 'italic 14px sans-serif';
  ctx.fillStyle = 'black';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(this.id, this.x, this.y + this.height);
};

// Draws this poi with its template to a given context
Poi.prototype.drawInTemplate = function(ctx) {
  this.template.draw(ctx);
}

//constants
Poi.NUMBER_OF_FRAMES = 10; //number of frames that the animation representing the poi have
Poi.FRAME_WIDTH = 40; //width of each frame
Poi.FRAME_HEIGHT = 40; //height of each frame
Poi.ANIMATION_PATH = 'libimages/anim.png';

