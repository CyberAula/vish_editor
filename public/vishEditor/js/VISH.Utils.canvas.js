VISH.Utils.canvas = (function(V,undefined){
	
        
    /**
     * draw an image keeping the aspect ratio centered inside the given rectangle
     */
    var drawImageWithAspectRatio = function (ctx, content, dx, dy, dw, dh) {
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
      
      ctx.drawImage(content, finalx, finaly, finalw, finalh);  
    };
    
    /**
     * draw an image keeping the aspect ratio centered inside the given rectangle
     */
    var drawImageWithAspectRatioAndRoundedCorners = function (ctx, content, dx, dy, dw, dh) {
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
      
      ctx.drawImage(content, finalx, finaly, finalw, finalh);
      
      drawRoundedCorners(ctx, finalx, finaly, finalw, finalh);
      
    };
    
    /**
     * draw rounded corners to a rectangle
     */
    var drawRoundedCorners = function (ctx, dx, dy, dw, dh, type) {
      var cornerFile, finalx, finaly, finalw, finalh;
      //fix for firefox and explorer, draw the corners in a 2px bigger rectangle
      finalx = dx -1;
      finaly = dy -1;
      finalw = dw +2; //2px because the rectangle is 1 px bigger in each side
      finalh = dh +2;
    
      //select corner file to use
      if(type==="text") {
        cornerFile = V.Utils.loader.getImage(VISH.ImagesPath + 'corner_small_text.png');
      }
      else if(finalw > 300 && finalh > 300){
        cornerFile = V.Utils.loader.getImage(VISH.ImagesPath + 'corner.png');
      }
      else {
        cornerFile = V.Utils.loader.getImage(VISH.ImagesPath + 'corner_small.png');
      }
      
      //draw corners
      ctx.save();
      ctx.drawImage(cornerFile, finalx, finaly);
      ctx.translate(finalx + finalw, finaly);
      ctx.rotate(Math.PI/2);  
      ctx.drawImage(cornerFile, 0, 0);
      ctx.restore();
      ctx.save();
      ctx.translate(finalx + finalw, finaly + finalh);
      ctx.rotate(Math.PI); 
      ctx.drawImage(cornerFile, 0, 0);
      ctx.restore();
      ctx.save();
      ctx.translate(finalx, finaly + finalh);
      ctx.rotate(3*Math.PI/2);
      ctx.drawImage(cornerFile, 0, 0);
      ctx.restore(); 
    }

    return {
	    drawImageWithAspectRatioAndRoundedCorners        : drawImageWithAspectRatioAndRoundedCorners,
	    drawImageWithAspectRatio                         : drawImageWithAspectRatio,
	    drawRoundedCorners                               : drawRoundedCorners                
    };

}) (VISH);