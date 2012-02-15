"use strict";

//definition of the template sizes and the zones positions and sizes
Template.types = [
    {
        "x": 80,
        "y": 60,
        "width": 642,
        "height": 482,
        "closingButtonX": 672,
        "closingButtonY": 60,
        "closingButtonWidth": 50,
        "closingButtonHeight": 50,
        "image": "libimages/template1.png",
        "noz": 1,
        "x0": 130,
        "y0": 99,
        "width0": 536,
        "height0": 402,
        "textstyle0": "italic 16px helvetica, arial, sans-serif",
        "textcolor0": "blue",
        "textlinespacing0": 40
    },
    {
        "x": 80,
        "y": 60,
        "width": 642,
        "height": 482,
        "closingButtonX": 672,
        "closingButtonY": 60,
        "closingButtonWidth": 30,
        "closingButtonHeight": 50,
        "image": "libimages/template1.png",
        "noz": 2,
        "x0": 142,
        "y0": 99,
        "width0": 536,
        "height0": 33,
        "textstyle0": "bold 26px Arial",
        "textcolor0": "black",
        "textlinespacing0": 20,
        "x1": 132,
        "y1": 175,
        "width1": 536,
        "height1": 331,
        "textstyle1": "16px Arial",
        "textcolor1": "black",
        "textlinespacing1": 20
    },
    {
        "x": 80,
        "y": 60,
        "width": 642,
        "height": 482,
        "closingButtonX": 672,
        "closingButtonY": 60,
        "closingButtonWidth": 50,
        "closingButtonHeight": 50,
        "image": "libimages/template1.png",
        "noz": 3,
        "x0": 142,
        "y0": 99,
        "width0": 536,
        "height0": 33,
        "textstyle0": "bold 26px arial",
        "textcolor0": "black",
        "textlinespacing0": 20,
        "x1": 122,
        "y1": 175,
        "width1": 260,
        "height1": 331,
        "textstyle1": "italic 9px arial",
        "textcolor1": "black",
        "textlinespacing1": 20,
        "x2": 418,
        "y2": 175,
        "width2": 260,
        "height2": 331,
        "textstyle2": "12px aria",
        "textcolor2": "black",
        "textlinespacing2": 20
    }
    ];


//in the constructor we select the template number from the above array and
//add the content to the zones
function Template(number, zonesContent){    
    var aspectRatio, i, tmpZone, tmpImg, tmpVideo, tmpHeight, tmpWidth, reductionRatio;
    
    this.zones = new Array();
    this.image = Template.types[number].image;
    this.hasVideo = this.checkIfVideoInZones(zonesContent);
    
    if(number === 0 && zonesContent[0] && (zonesContent[0].type === "image" || zonesContent[0].type === "video")){
        //special template that only have content, we scale it to fit the content        
        //check the content size
        if(zonesContent[0].type === "image"){
            tmpImg = canvasState.libImages[zonesContent[0].content];
            aspectRatio = tmpImg.width / tmpImg.height;
            tmpHeight = Template.types[0].width0 * tmpImg.height / tmpImg.width;
            tmpWidth = Template.types[0].height0 * tmpImg.width / tmpImg.height;
        }
        else{
            //content is an array of mimetypes and srcs
            tmpVideo = document.createElement('video');
            for(i=0; i< zonesContent[0].content.length;i++) {
              if(tmpVideo.canPlayType(zonesContent[0].content[i].mimetype)){
                  tmpVideo = canvasState.libVideos[zonesContent[0].content[i].src];
                  break;
              }
            }                
            aspectRatio = tmpVideo.videoWidth / tmpVideo.videoHeight;
            tmpHeight = Template.types[0].width0 * tmpVideo.videoHeight / tmpVideo.videoWidth;
            tmpWidth = Template.types[0].height0 * tmpVideo.videoWidth / tmpVideo.videoHeight;
        }
        
        if (aspectRatio >  Template.types[0].width0/Template.types[0].height0 ) {
          //bigger aspect ratio, we use zone width to draw the image              
          reductionRatio = tmpHeight / Template.types[0].height0;
          
          this.x = Template.types[number].x;
          this.y = 300 - tmpHeight/2 - 39; //middle of flashcard - half image - 39px margin
          this.width = Template.types[number].width;   
          this.height = tmpHeight + 78 + 20*reductionRatio; //50px margin on each side + 20px shadow
          this.closingButtonX = Template.types[number].closingButtonX; 
          this.closingButtonY = 300 - tmpHeight/2 - 39; //right upper corner = center of flashcard - half image - 50px margin
          this.closingButtonWidth = Template.types[number].closingButtonWidth;
          this.closingButtonHeight = Template.types[number].closingButtonHeight;
          
          tmpZone = new Zone(Template.types[0].x0, 300 - tmpHeight/2, Template.types[0].width0, tmpHeight, zonesContent[0].type, zonesContent[0].content);
          this.zones.push(tmpZone);
        }
        else {
          //lower aspect ratio, we use zone height to draw the image and scale image width (keeping aspect ratio)              
          reductionRatio = tmpWidth / Template.types[0].width0;
          
          this.x = 400 - tmpWidth/2 - 52; //middle of flashcard - half image - 52px margin
          this.y = Template.types[number].y;
          this.width = tmpWidth + 104;   //50px margin on each side + 20px shadow
          this.height = Template.types[number].height;
          this.closingButtonX = 400 + tmpWidth/2;  //right upper corner = center of flashcard + half image
          this.closingButtonY = Template.types[number].closingButtonY;
          this.closingButtonWidth = Template.types[number].closingButtonWidth;
          this.closingButtonHeight = Template.types[number].closingButtonHeight;
          
          tmpZone = new Zone(400 - tmpWidth/2, Template.types[0].y0, tmpWidth, Template.types[0].height0, zonesContent[0].type, zonesContent[0].content);
          this.zones.push(tmpZone);
        }        
    }
    else {
        this.x = Template.types[number].x;
        this.y = Template.types[number].y;
        this.width = Template.types[number].width;
        this.height = Template.types[number].height;
        this.closingButtonX = Template.types[number].closingButtonX;
        this.closingButtonY = Template.types[number].closingButtonY;
        this.closingButtonWidth = Template.types[number].closingButtonWidth;
        this.closingButtonHeight = Template.types[number].closingButtonHeight;
        
        //XXX TODO check limits
        //define the zones
        for (i = 0; i < Template.types[number].noz; i++) {
            if(zonesContent[i]){
                tmpZone = new Zone(eval("Template.types[number].x"+i), eval("Template.types[number].y"+i), eval("Template.types[number].width"+i), eval("Template.types[number].height"+i), zonesContent[i].type, zonesContent[i].content, eval("Template.types[number].textstyle"+i), eval("Template.types[number].textcolor"+i), eval("Template.types[number].textlinespacing"+i));
                this.zones.push(tmpZone);
            }
        }
    }
};

Template.prototype.update = function(mx, my) {
  var isInsideClosingButton, i;
  isInsideClosingButton = (this.closingButtonX <= mx) && (this.closingButtonX + this.closingButtonWidth >= mx) &&
          (this.closingButtonY <= my) && (this.closingButtonY + this.closingButtonHeight >= my);
  if(isInsideClosingButton) {
    canvasState.drawingPoi = null;
    canvasState.valid = false;  //redraw it
    if(this.hasVideo) {
      //stop the video
      for(i = 0; i < this.zones.length; i++) {
        this.zones[i].stopVideo();
      }
    }
  }
  
  for (i = 0; i < this.zones.length; i++) {
    this.zones[i].update(mx, my);
  }  
}

Template.prototype.draw = function(ctx) {
  var i;
  
  //first we draw the template image
  ctx.drawImage(canvasState.libImages[this.image], this.x, this.y, this.width, this.height);
  //now the closing icon
  ctx.drawImage(canvasState.libImages['libimages/closeicon.png'], this.closingButtonX, this.closingButtonY, 50, 50);

  //now the zones
  for(i = 0; i < this.zones.length; i++) {
    this.zones[i].draw(ctx);
  }
  
  // uncomment for development purposes
  // draw the closing button rectangle area 
  //ctx.fillStyle = 'rgba(127, 255, 212, .5)';
  //ctx.fillRect(this.closingButtonX, this.closingButtonY, this.closingButtonWidth, this.closingButtonHeight);    
}


Template.prototype.checkIfVideoInZones = function(zonesContent) {
  var i;
  for (i = 0; i < zonesContent.length; i++) {
        if(zonesContent[i].type === "video") {
          return true;
        }        
  }
  return false;
};
