VISH.Utils.Loader = (function(V,undefined){

	var _loadGoogleLibraryCallback = undefined;


	var loadImagesOnContainer = function(imagesArray,containerId,options){
		if(options.order===true){
			_loadImagesOnContainerWithOrder(imagesArray,containerId,options);
		} else {
			_loadImagesOnContainer(imagesArray,containerId,options);
		}
	};

	var _loadImagesOnContainer = function(imagesArray,containerId,options){
		var imagesLength = imagesArray.length;
		var imagesLoaded = 0;

		$.each(imagesArray, function(i, image) {
			$(image).load(function(response) {
				_insertElementOnContainer(image,imagesArray,containerId,options);
				imagesLoaded = imagesLoaded + 1;
				if((imagesLoaded == imagesLength)&&(typeof options.callback == "function")){
					options.callback();
				}
			})
			$(image).error(function(response) {
				imagesLoaded = imagesLoaded + 1;
				if((imagesLoaded == imagesLength)&&(typeof options.callback == "function")){
					options.callback();
				}
			})
		});
	};

	var _loadImagesOnContainerWithOrder = function(imagesArray,containerId,options){
		var validImagesArray = imagesArray;
		var imagesLength = imagesArray.length;
		var imagesLoaded = 0;

		$.each(imagesArray, function(i, image){
			$(image).load(function(response) {
				imagesLoaded = imagesLoaded + 1;
				if(imagesLoaded == imagesLength){
					_insertElementsWithOrder(validImagesArray,containerId,options);
					if(typeof options.callback == "function"){
						options.callback();
					}
				}
			});
			$(image).error(function(response){
				if((options)&&(options.defaultOnError)){
					//Try to load the default image
					var defaultSrc = $(image).attr("defaultsrc");
					if(typeof defaultSrc == "string"){
						$(image).removeAttr("defaultsrc");
						$(image).attr("src",defaultSrc);

						if(typeof options.onImageErrorCallback == "function"){
							options.onImageErrorCallback(image);
						}

						//Only return when the first time we load a default source
						//The same image will call load or error callback again.
						return;
					}
				}

				imagesLoaded = imagesLoaded + 1;
				validImagesArray.splice(validImagesArray.indexOf(image),1);
				if(imagesLoaded == imagesLength){
					_insertElementsWithOrder(validImagesArray,containerId,options);
					if(typeof options.callback == "function"){
						options.callback();
					}
				}
				
			});
		});
	};

	var _insertElementsWithOrder = function(imagesArray,containerId,options){
		$.each(imagesArray, function(i, image) {
			_insertElementOnContainer(image,imagesArray,containerId,options);
		});
	};

	var _insertElementOnContainer = function(image,imagesArray,containerId,options){
		var titleArray = options.titleArray;
		if((titleArray)&&(titleArray[imagesArray.indexOf(image)])){
			$("#" + containerId).append("<div><p>"+titleArray[imagesArray.indexOf(image)]+"</p>" + V.Utils.getOuterHTML(image) + "</div>");
		} else {
			$("#" + containerId).append('<div>' + V.Utils.getOuterHTML(image) + '</div>');
		}
	};

	/*
	* Load a script asynchronously
	*/
	var loadScript = function(scriptSrc,callback){
		if((typeof scriptSrc !== "string")||(typeof callback !== "function")){
			return;
		}

		var head = document.getElementsByTagName('head')[0];
		if(head){
			var script = document.createElement('script');
			script.setAttribute('src',scriptSrc);
			script.setAttribute('type','text/javascript');

			//Only call callback once
			var callbackCalled = false;

			var callCallback = function(){
				if(!callbackCalled){
					if(typeof callback == "function"){
						callbackCalled = true;
						callback();
					}
				}
			};

			var loadFunction = function(){
				if((this.readyState == 'complete')||(this.readyState == 'loaded')){
					callCallback();
				}
			};
			//calling a function after the js is loaded (IE)
			script.onreadystatechange = loadFunction;

			//calling a function after the js is loaded (Firefox & GChrome)
			script.onload = callCallback;

			head.appendChild(script);
		}
	};

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
	};

	var onGoogleLibraryLoaded = function(){
		if(typeof _loadGoogleLibraryCallback === "function"){
			_loadGoogleLibraryCallback();
		}
		_loadGoogleLibraryCallback = undefined;
	};

	/**
	* Function to dinamically add a css
	*/
	var loadCSS = function(path, callback){
		var url = V.StylesheetsPath + path;
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.type = "text/css";
		link.rel = "stylesheet"
		link.href = url;

		//Callback
		if(typeof callback == "function"){

			//Only call callback once
			var callbackCalled = false;

			var callCallback = function(){
				if(!callbackCalled){
					callbackCalled = true;
					callback();
				}
			}

			//calling a function after the css is loaded (Firefox & Google Chrome)
			link.onload = callCallback;
			link.onerror = callCallback;

			var loadFunction = function(){
				if((this.readyState == 'complete')||(this.readyState == 'loaded')){
					callCallback();
				}
			};
			//calling a function after the css is loaded (IE)
			link.onreadystatechange = loadFunction;
		};

		head.appendChild(link);

		if(typeof callback == "function"){
			//Workaround for browsers that don't support LINK onload functions
			var img = document.createElement('img');
			img.onerror = function(){
				callCallback();
			}
			img.src = url;
		}
	};

	var loadDeviceCSS = function(){
		//Set device CSS
		if(V.Status.getDevice().desktop){
			loadCSS("device/desktop.css");
		} else if(V.Status.getDevice().mobile){
			loadCSS("device/mobile.css");
		} else if(V.Status.getDevice().tablet){
			loadCSS("device/tablet.css");
		}

		//Set browser CSS
		switch(V.Status.getDevice().browser.name){
			case V.Constant.FIREFOX:
				loadCSS("browser/firefox.css");
				break;
			case V.Constant.IE:
				loadCSS("browser/ie.css");
				break;
			case V.Constant.CHROME:
				loadCSS("browser/chrome.css");
				break;
		}
	};

	var loadLanguageCSS = function(){
		var languagesWithCSS = ["es", "fr", "hu", "nl", "de"];
		var language = V.I18n.getLanguage();
		if(languagesWithCSS.indexOf(language)!=-1){
			//Load CSS for this language
			loadCSS("language/" + language + ".css");
		}
	};


	/*
	* Loading dialogs
	*/

	///////////////////
	// Full Loading
	///////////////////

	var t1Loading;

	var startLoading = function(){
		if(!_isFullLoadingActive()){
			t1Loading = Date.now();
			$("#fancyLoad").trigger('click');
		}
	};

	var stopLoading = function(callback){
		var diff = Date.now()-t1Loading;

		if(diff < 1250){
			setTimeout(function(){
				stopLoading(callback);
			},Math.max(0,Math.min(1250-diff,1250)));
		} else {
			var closed = false;
			var tWClose = 0;
			if(_isFullLoadingActive()){
				$.fancybox.close();
				closed = true;
				tWClose = 800;
			}
			if(typeof callback == "function"){
				setTimeout(function(){
					callback(closed);
				},tWClose);
			}
		}
	};

	var prepareFancyboxForFullLoading = function(){
		$("#fancybox-outer").css("background", "rgba(255,255,255,0.9)");
		$("#fancybox-wrap").css("margin-top", "20px");
       	$("#fancybox-wrap").css("margin-left", "20px");
	};

	var _isFullLoadingActive = function(){
		return $("#loading_fancy").is(":visible");
	};

	var startLoadingInContainer = function(container,options){
		var loadImg = document.createElement("img");
		$(loadImg).addClass("loading_fancy_img");
		$(loadImg).attr("src", V.ImagesPath + "lightbox-ico-loading.gif");
		if((options)&&(options.style)){
			$(loadImg).addClass(options.style);
		}
		var loadingBody = document.createElement("div");
		$(loadingBody).addClass("loading_fancy");
		$(loadingBody).append(loadImg);

		$(container).html("");
		$(container).append(loadingBody);
		$(container).addClass("loadingtmpShown");
	};

	var stopLoadingInContainer = function(container){
		$(container).find(".loading_fancy_img").parent().remove();
		$(container).removeClass("loadingtmpShown");
	};


	return {
		loadImagesOnContainer		: loadImagesOnContainer,
		loadScript					: loadScript,
		loadGoogleLibrary			: loadGoogleLibrary,
		loadCSS						: loadCSS,
		loadDeviceCSS				: loadDeviceCSS,
		loadLanguageCSS				: loadLanguageCSS,
		onGoogleLibraryLoaded		: onGoogleLibraryLoaded,
		prepareFancyboxForFullLoading	: prepareFancyboxForFullLoading,
		startLoading				: startLoading,
		stopLoading					: stopLoading,
		startLoadingInContainer		: startLoadingInContainer,
		stopLoadingInContainer		: stopLoadingInContainer
	};

}) (VISH);