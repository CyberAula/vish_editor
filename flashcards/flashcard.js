"use strict";

//GLOBAL OBJECT TO SAVE THE CANVAS STATE AND MODIFY IT FROM OTHER OBJECTS
//TO SET VALID TO FALSE AND GET REDRAWING, AND ACCESS LIBIMAGES AND LIBVIDEOS
var canvasState = null;

// param "withEditor" indicates if we are editing (true) or viewing (false)
function init(withEditor) {
  var poi, canvas, backgroundImg, i, p, j, tmpVideo, loadingImg, ctx;
  // Get the canvas element.
  canvas = document.getElementById("myCanvas");
  // Resize canvas to fit image    
  canvas.width = CanvasStateViewer.WIDTH;
  canvas.height = CanvasStateViewer.HEIGHT;

  loadingImg = new Image();
  loadingImg.src = "libimages/loading.png";
  
  loadingImg.onload = function () {
    //first draw the loading image
    ctx = canvas.getContext('2d');
    ctx.drawImage(loadingImg, 0, 0);
    
    //create the canvasState object
    if (withEditor) {
      canvasState = new CanvasStateEditor(canvas, fc.backgroundSrc);
    } else {
      canvasState = new CanvasStateViewer(canvas, fc.backgroundSrc);
    }
    
    //now load everything
    var loaders = [];
    //load all the helper images
    //XXX TODO check what of these templates are used in the flashcard and load only the needed ones
    loaders.push(loadImage('libimages/rounded_corners.png'));
    loaders.push(loadImage('libimages/template1.png'));
    loaders.push(loadImage('libimages/template2.png'));
    loaders.push(loadImage('libimages/mask.png'));
    loaders.push(loadImage('libimages/mask_length.png'));
    loaders.push(loadImage('libimages/play.png'));
    loaders.push(loadImage('libimages/corner.png'));
    loaders.push(loadImage('libimages/corner_small.png'));
    loaders.push(loadImage('libimages/corner_small_text.png'));
    loaders.push(loadImage('libimages/filled.png'));
    loaders.push(loadImage('libimages/closeicon.png'));
    loaders.push(loadImage(Poi.ANIMATION_PATH));
    
    //now load the images that the flashcard uses
    loaders.push(loadImage(fc.backgroundSrc));
    //cover all pois
    for (i = 0; i < fc.pois.length; i++) {
      //cover every zone in each poi
      for(p=0; p < fc.pois[i].zonesContent.length; p++){
        if (fc.pois[i].zonesContent[p].type === "image"){
          loaders.push(loadImage(fc.pois[i].zonesContent[p].content));
        }
        else if(fc.pois[i].zonesContent[p].type === "video"){          
          // Test for support between array of mimetypes
          tmpVideo = document.createElement('video');
          for(j=0; j < fc.pois[i].zonesContent[p].content.length; j++){
            if (tmpVideo.canPlayType(fc.pois[i].zonesContent[p].content[j].mimetype)) {
              //wait for video metadata to load
              loaders.push(loadVideo(fc.pois[i].zonesContent[p].content[j].src, i));  //id, the same as the poi position, i.e. "i"
              break;
            }
          }
        }
      }
    }
    
    $.when.apply(null, loaders).done(function() {
        // callback when everything was loaded
        //finally init canvasState and create the pois
        canvasState.init();
        for (i = 0; i < fc.pois.length; i++) {
          poi = new Poi(fc.pois[i].id, fc.pois[i].x, fc.pois[i].y, fc.pois[i].width, fc.pois[i].height, fc.pois[i].fill, fc.pois[i].templateNumber, fc.pois[i].zonesContent);
          canvasState.addPoi(poi);
        }
      });
  };
}


//function to load an image and add it to deferred
function loadImage(src) {
    var deferred, img;
      
    deferred = $.Deferred();
    img = new Image();
    img.onload = function() {
        deferred.resolve();
    };
    img.src = src;
    
    // Introduce the img in the GLOBAL OBJECT
    canvasState.libImages[src] = img;
    return deferred.promise();
}


//function to create a video tag and add it to document body
function loadVideo(videoSrc, videoId) {
  var deferred, v;
  
  deferred = $.Deferred();
  v = document.createElement('video');
  v.setAttribute('id','video'+videoId);
  v.setAttribute('style','display:none');
  v.setAttribute('preload', 'auto');
  v.setAttribute('src',videoSrc);            
  document.body.appendChild(v);
  
  v.addEventListener('loadedmetadata', function() {
    deferred.resolve();
  }, false);
  
  canvasState.libVideos[videoSrc] = v;
  return deferred.promise();
}

function initEditor() {
  init(true);
}

function initViewer() {
  init(false);
}


