VISH.Utils.Loader = (function(V,undefined){
    
    var _loadGoogleLibraryCallback = undefined;
    
    var loadImagesOnCarrousel = function(imagesArray,callback,carrouselDivId,titleArray){
      var imagesLength = imagesArray.length;
      var imagesLoaded = 0;
      
      $.each(imagesArray, function(i, image) {
        $(image).load(function(response) {
          _insertElementOnCarrousel(image,imagesArray,carrouselDivId,titleArray);
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
          validImagesArray.splice(validImagesArray.indexOf(image),1);
          if(imagesLoaded == imagesLength){
            _insertElementsWithOrder(validImagesArray,carrouselDivId,titleArray);
            callback();
          }
        })
      });
    }
    
    var _insertElementsWithOrder = function(imagesArray,carrouselDivId,titleArray){
        $.each(imagesArray, function(i, image) {
            _insertElementOnCarrousel(image,imagesArray,carrouselDivId,titleArray);
        });
    }

    var _insertElementOnCarrousel = function(image,imagesArray,carrouselDivId,titleArray){
        if((titleArray)&&(titleArray[imagesArray.indexOf(image)])){
            $("#" + carrouselDivId).append("<div><p>"+titleArray[imagesArray.indexOf(image)]+"</p>" + V.Utils.getOuterHTML(image) + "</div>");
        } else {
            $("#" + carrouselDivId).append('<div>' + V.Utils.getOuterHTML(image) + '</div>');
        }
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

    /*
     * Loading dialogs
     */

    var t1Loading;

    var startLoading = function(){
        if(!_isFullLoadingActive()){
            t1Loading = Date.now();
            $("#fancyLoad").trigger('click');
        }
    }

    var stopLoading = function(callback){
        var diff = Date.now()-t1Loading;
        if(diff < 800){
            setTimeout(function(){
                stopLoading(callback);
            },800);
        } else {
            var closed = false;
            if(_isFullLoadingActive()){
                $.fancybox.close();
                closed = true;
            }
            if(typeof callback == "function"){
                callback(closed);
            }
        }
    }

    /*
     * Called when loading panel is going to be closed by another fancybox
     * Keep original fancybox CSS
     */
    var onCloseLoading = function(){
        $("#fancybox-outer").css("background", "white");
    }

    var _isFullLoadingActive = function(){
        return $("#loading_fancy").is(":visible");
    }

    var startLoadingInContainer = function(container,options){
        $(container).html($("#loading_fancy_wrapper").html());
        $(container).addClass("loadingtmpShown");

        if((options)&&(options.style)){
            $(container).find(".loading_fancy_img").addClass(options.style);
        }
    }

    var stopLoadingInContainer = function(container){
        $(container).find(".loading_fancy_img").parent().remove();
        $(container).removeClass("loadingtmpShown");
    }

    return {
      loadImagesOnCarrousel      : loadImagesOnCarrousel,
      loadImagesOnCarrouselOrder : loadImagesOnCarrouselOrder,
      loadScript                 : loadScript,
      loadGoogleLibrary          : loadGoogleLibrary,
      onGoogleLibraryLoaded      : onGoogleLibraryLoaded,
      startLoading               : startLoading,
      stopLoading                : stopLoading,
      onCloseLoading             : onCloseLoading,
      startLoadingInContainer    : startLoadingInContainer,
      stopLoadingInContainer     : stopLoadingInContainer
    };

}) (VISH);