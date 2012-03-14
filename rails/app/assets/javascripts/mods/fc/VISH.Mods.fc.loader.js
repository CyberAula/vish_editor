VISH.Mods.fc.loader = (function(V, undefined){
    
    
    /**
     * Function to initialize the loader for the flashcard, loads all the common images and
     * covers the flashcard element to preload its contents
     */
    var init = function(fc){
        var tmpVideo;        
        
        //now load everything
        var loaders = [];
        //load all the helper images        
        loaders.push(V.Utils.loader.loadImage('/assets/loading.png'));
        loaders.push(V.Utils.loader.loadImage('/assets/rounded_corners.png'));
        loaders.push(V.Utils.loader.loadImage('/assets/template1.png'));
        loaders.push(V.Utils.loader.loadImage('/assets/play.png'));
        loaders.push(V.Utils.loader.loadImage('/assets/corner.png'));
        loaders.push(V.Utils.loader.loadImage('/assets/corner_small.png'));
        loaders.push(V.Utils.loader.loadImage('/assets/corner_small_text.png'));
        loaders.push(V.Utils.loader.loadImage('/assets/filled.png'));
        loaders.push(V.Utils.loader.loadImage('/assets/closeicon.png'));
        loaders.push(V.Utils.loader.loadImage('/assets/anim.png'));
        
        //now load the images that the flashcard uses
        //we use several for loops to cover all the flashcard json and find the contents to load
        loaders.push(V.Utils.loader.loadImage(fc.backgroundSrc));        
        //cover all pois
        for (var i = 0; i < fc.pois.length; i++) {
          //cover every zone in each poi
          for(var p=0; p < fc.pois[i].zonesContent.length; p++){
            if (fc.pois[i].zonesContent[p].type === "image"){
              loaders.push(V.Utils.loader.loadImage(fc.pois[i].zonesContent[p].content));
            }
            else if(fc.pois[i].zonesContent[p].type === "video"){          
              // Test for support between array of mimetypes
              tmpVideo = document.createElement('video');
              for(var j=0; j < fc.pois[i].zonesContent[p].content.length; j++){
                if (tmpVideo.canPlayType(fc.pois[i].zonesContent[p].content[j].mimetype)) {
                  //wait for video metadata to load
                  loaders.push(V.Utils.loader.loadVideo(fc.pois[i].zonesContent[p].content[j].src, i));  //id, the same as the poi position, i.e. "i"
                  break;
                }
              }
            }
          }
        }
        
        //after everything have been loaded continue
        $.when.apply(null, loaders).done(function() {
              console.log("Flashcard preloaded!");
              // callback when everything was loaded
              //finally init canvasState and create the pois
              //canvasState.init();
              //for (i = 0; i < fc.pois.length; i++) {
              //  poi = V.Mods.fc.poiList.add(fc.pois[i].id, fc.pois[i].x, fc.pois[i].y, fc.pois[i].width, fc.pois[i].height, fc.pois[i].fill, fc.pois[i].templateNumber, fc.pois[i].zonesContent);
              //  canvasState.addPoi(poi);
              //}
        });
        
    };
    
    return {
        init      : init
    };
    
})(VISH);
