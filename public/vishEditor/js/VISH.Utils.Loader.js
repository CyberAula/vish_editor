VISH.Utils.Loader = (function(V,undefined){
    
    var _loadGoogleLibraryCallback = undefined;
    var libVideos = {};
    var libImages = {};
    
    var getImage = function(imagePath){
        if(libImages[imagePath]){
            return libImages[imagePath];
        }
        else{
            V.Debugging.log("Error, Image with path " + imagePath +" was not preloaded");
            return null;
        }
    };
    
    var getVideo = function(videoPath){
        if(libVideos[videoPath]){
            return libVideos[videoPath];
        }
        else{
            V.Debugging.log("Error, Video with path " + videoPath +" was not preloaded");
            return null;
        }
    };
    
    //function to load an image and add it to deferred
    var loadImage = function(src) {
        var deferred, img;
          
        deferred = $.Deferred();
        img = new Image();
        img.onload = function() {
            deferred.resolve();
        };
        img.src = src;
        
        libImages[src] = img;
        return deferred.promise();
    };
    
    
    //function to create a video tag and add it to document body
    var loadVideo = function(videoSrc, videoId) {
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
      
      libVideos[videoSrc] = v;
      return deferred.promise();
    };
    
		
		var loadImagesOnCarrousel = function(imagesArray,callback,carrouselDivId,titleArray){
			var imagesLength = imagesArray.length;
      var imagesLoaded = 0;
			
      $.each(imagesArray, function(i, image) {
        $(image).load(function(response) {
					 if((titleArray)&&(titleArray[imagesArray.indexOf(image)])){
						$("#" + carrouselDivId).append("<div><p>"+titleArray[imagesArray.indexOf(image)]+"</p>" + V.Utils.getOuterHTML(image) + "</div>");
					} else {
						$("#" + carrouselDivId).append('<div>' + V.Utils.getOuterHTML(image) + '</div>');
					}
          imagesLoaded = imagesLoaded + 1;
          if(imagesLoaded == imagesLength){
            callback();
          }
        })
        $(image).error(function(response) {
          imagesLoaded = imagesLoaded + 1;
          if(imagesLoaded == imagesLength){
            callback();
          }
        })
      });
		}
		
		
    var loadImagesOnCarrouselOrder = function(imagesArray,callback,carrouselDivId,titleArray){
			var validImagesArray = imagesArray;
      var imagesLength = imagesArray.length;
      var imagesLoaded = 0;
      
      $.each(imagesArray, function(i, image) {
        $(image).load(function(response) {
          imagesLoaded = imagesLoaded + 1;
          if(imagesLoaded == imagesLength){
						_insertElementsWithOrder(validImagesArray,carrouselDivId,titleArray);
            callback();
          }
        })
        $(image).error(function(response) {
          imagesLoaded = imagesLoaded + 1;
					validImagesArray.splice(validImagesArray.indexOf(image),1)
          if(imagesLoaded == imagesLength){
						_insertElementsWithOrder(validImagesArray,carrouselDivId,titleArray);
            callback();
          }
        })
      });
    }
		
	 var _insertElementsWithOrder = function(imagesArray,carrouselDivId,titleArray){
	 	 $.each(imagesArray, function(i, image) {
	     if((titleArray)&&(titleArray[imagesArray.indexOf(image)])){
          var slideNumber = titleArray[imagesArray.indexOf(image)];
          var slideId = V.Slides.getSlideWithNumber(slideNumber).id;
          var poiId = "poi" + slideNumber;
				  $("#" + carrouselDivId).append("<div><div class='draggable_arrow_div' slide_id='"+slideId+"' id='"+poiId+"'><img src='" + V.ImagesPath + "flashcard/flashcard_button.png'  class='fc_draggable_arrow'/><p class='draggable_number'>"+slideNumber+"</p></div><p slidenumber='"+slideNumber+"' action='goToSlide'>"+slideNumber+"</p>" + V.Utils.getOuterHTML(image) + "</div>");
	     } else {
	       $("#" + carrouselDivId).append('<div>' + V.Utils.getOuterHTML(image) + '</div>');
	     }
     });
	 }

    /*
     * Load a script asynchronously
     */
    var loadScript = function(scriptSrc,callback){
      if((typeof scriptSrc !== "string")||(typeof callback !== "function")){
        return;
      }
     
      var head = document.getElementsByTagName('head')[0];
      if(head) {
        var script = document.createElement('script');
        script.setAttribute('src',scriptSrc);
        script.setAttribute('type','text/javascript');

        var loadFunction = function(){
          if((this.readyState == 'complete')||(this.readyState == 'loaded')){
            callback();
          }
        };

        //calling a function after the js is loaded (IE)
        script.onreadystatechange = loadFunction;

        //calling a function after the js is loaded (Firefox)
        script.onload = callback;

        head.appendChild(script);
      }
    }

    var loadGoogleLibrary = function(scriptSrc,callback){
      if(typeof callback === "function"){
        _loadGoogleLibraryCallback = callback;
      } else {
        return;
      }
      var fullScriptSrc = scriptSrc + "&callback=VISH.Utils.Loader.onGoogleLibraryLoaded";
      loadScript(fullScriptSrc,function(){
        // We should wait for onGoogleLibraryLoaded callback.
        // We can not use this callback, because the loaded script would load more scripts internally
        // So, despite the script is loaded, the full library may be not
      });
    }

    var onGoogleLibraryLoaded = function(){
      if(typeof _loadGoogleLibraryCallback === "function"){
        _loadGoogleLibraryCallback();
      }
      _loadGoogleLibraryCallback = undefined;
    }

    return {
            getImage              : getImage,
            getVideo              : getVideo,
            loadImage             : loadImage,
            loadVideo             : loadVideo,
  					loadImagesOnCarrousel : loadImagesOnCarrousel,
  					loadImagesOnCarrouselOrder : loadImagesOnCarrouselOrder,
            loadScript            : loadScript,
            loadGoogleLibrary     : loadGoogleLibrary,
            onGoogleLibraryLoaded : onGoogleLibraryLoaded
    };

}) (VISH);