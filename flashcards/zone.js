"use strict";

function Zone(x, y, width, height, type, content, textstyle, textcolor, textlinespacing) {
    var i, tmpVideo;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    if(this.type === "video") {
      //content is an array of mimetypes and srcs
      tmpVideo = document.createElement('video');
      for(i=0; i< content.length;i++) {
        if(tmpVideo.canPlayType(content[i].mimetype)){
            this.content = content[i].src;
            break;
        }
      }
    }
    else{  //image or text
      this.content = content;
    }
    this.textstyle = textstyle;
    this.textcolor = textcolor;
    this.textlinespacing = textlinespacing;
};

Zone.prototype.update = function(mx, my) {
  var isInsideBorders, tmpVideo;
  
  if(this.type === "video") {
    //toggle between play and pause if click is inside this zone
    isInsideBorders = (this.x <= mx) && (this.x + this.width >= mx) && (this.y <= my) && (this.y + this.height >= my);
    if(isInsideBorders){
      tmpVideo = canvasState.libVideos[this.content];
      if(tmpVideo.paused) {
        tmpVideo.play();
        canvasState.valid = false;  //video starts to play, so draw again
      }
      else {
        tmpVideo.pause();
      }
    }
  }
};

Zone.prototype.draw = function (ctx) {
  var tmpImg, tmpWidth, tmpHeight, tmpVideo, lines, line;
  switch(this.type){
    case "text":
      ctx.fillStyle = 'rgba(122, 151, 438, .9)';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      
      ctx.font = this.textstyle;
      ctx.fillStyle = this.textcolor;
      ctx.textBaseline = 'alphabetic';
      
      lines = this.getLines(ctx, this.content, this.width - 20, ctx.font);
      for(line = 0; line < lines.length; line++) {
        ctx.fillText(lines[line], this.x + 10, this.y + 25 + line*this.textlinespacing);
      }        
      canvasState.drawRoundedCorners(this.x, this.y, this.width, this.height, "text");
      break;
    case "image":
      tmpImg = canvasState.libImages[this.content];
      //lower aspect ratio, we use zone height to draw the image        
      canvasState.drawImageWithAspectRatioAndRoundedCorners(tmpImg, this.x, this.y, this.width, this.height);  
      break;
    case "video":
      tmpVideo = canvasState.libVideos[this.content];
      canvasState.drawImageWithAspectRatioAndRoundedCorners(tmpVideo, this.x, this.y, this.width, this.height);
      
      if(tmpVideo.paused && !tmpVideo.ended){
        ctx.drawImage(canvasState.libImages['libimages/play.png'], (this.x + this.width/2) - 128/2, (this.y + this.height/2) - 128/2, 128, 128 );
      }
      else if(tmpVideo.ended) {
        ctx.drawImage(canvasState.libImages['libimages/play.png'], (this.x + this.width/2) - 128/2, (this.y + this.height/2) - 128/2, 128, 128 );
        console.log("draw end");
      }
      else{
        canvasState.valid = false; //playing video, so draw again in next interval
      }
      break;
  }  
};

Zone.prototype.stopVideo = function() {
    var tmpVideo;
    if(this.type === "video") {
        tmpVideo = canvasState.libVideos[this.content];
        tmpVideo.pause();
    }
};

/**
* Divide an entire phrase in an array of phrases, all with the max pixel length given.
* The words are initially separated by the space char.
* @param phrase
* @param length
* @return
*/
Zone.prototype.getLines = function (ctx, phrase, maxPxLength, textStyle) {
    var wa = phrase.split(" "),
        phraseArray = [],
        lastPhrase = "",
        l = maxPxLength,
        measure = 0,
        i = 0,
        w = 0;
        
    ctx.font = textStyle;
    
    for (i=0; i < wa.length; i++) {
        w = wa[i];
        measure = ctx.measureText(lastPhrase+w).width;
        if (measure < l) {
            lastPhrase += (" "+w);
        }else {
            phraseArray.push(lastPhrase);
            lastPhrase = w;
        }
        if (i === wa.length-1) {
            phraseArray.push(lastPhrase);
            break;
        }
    }
    return phraseArray;
}

