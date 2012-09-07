VISH.Utils.loader = (function(V,undefined){
    
    var libVideos = {};
    var libImages = {};
    
    var getImage = function(imagePath){
        if(libImages[imagePath]){
            return libImages[imagePath];
        }
        else{
            VISH.Debugging.log("Error, Image with path " + imagePath +" was not preloaded");
            return null;
        }
    };
    
    var getVideo = function(videoPath){
        if(libVideos[videoPath]){
            return libVideos[videoPath];
        }
        else{
            VISH.Debugging.log("Error, Video with path " + videoPath +" was not preloaded");
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
						$("#" + carrouselDivId).append("<div><p>"+titleArray[imagesArray.indexOf(image)]+"</p>" + VISH.Utils.getOuterHTML(image) + "</div>");
					} else {
						$("#" + carrouselDivId).append('<div>' + VISH.Utils.getOuterHTML(image) + '</div>');
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
		
		
    var loadImagesOnCarrouselOrder = function(imagesArray,callback, carrouselDivId,titleArray){
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
				  $("#" + carrouselDivId).append("<div><div class='draggable_arrow_div' slide_id='"+titleArray[imagesArray.indexOf(image)]+"' id='poi"+titleArray[imagesArray.indexOf(image)]+"'><img src='" + VISH.ImagesPath + "flashcard_button.png'  class='fc_draggable_arrow'/><p class='draggable_number'>"+titleArray[imagesArray.indexOf(image)]+"</p></div><p slidenumber='"+titleArray[imagesArray.indexOf(image)]+"' action='goToSlide'>"+titleArray[imagesArray.indexOf(image)]+"</p>" + VISH.Utils.getOuterHTML(image) + "</div>");
	     } else {
	       $("#" + carrouselDivId).append('<div>' + VISH.Utils.getOuterHTML(image) + '</div>');
	     }
     });
	 }

    return {
            getImage        : getImage,
            getVideo        : getVideo,
            loadImage       : loadImage,
            loadVideo       : loadVideo,
						loadImagesOnCarrousel : loadImagesOnCarrousel,
						loadImagesOnCarrouselOrder : loadImagesOnCarrouselOrder
    };

}) (VISH);