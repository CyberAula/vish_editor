VISH.Utils = (function(V,undefined){
	
	var ids;
	// a list of all used ids
	var domIds;
	// myDomId = domIds['prefix'] returns a unicId for the specified prefix

	var init = function(){
		if(!domIds){
			domIds = new Array();
			ids = [];
		}

		//Extend JQuery functionality
		jQuery.fn.cssNumber = function(prop){
			var v = parseInt(this.css(prop),10);
			return isNaN(v) ? 0 : v;
		};
	}

	/*
	 *
	 */
	var getOptions = function(){
		if(V.Editing){
			return V.Editor.getOptions();
		} else {
			return V.Viewer.getOptions();
		}
	}

   /**
	* Return a unic id.
	* full_id_prefix: Specify a prefix for the id, for example, article to get "article_x" ids.
	* Specify a separator for nested ids.
	* justCheck: only check if the id is really unic, if not generate a new id.
	*/
	var getId = function(full_id_prefix,justCheck,separator){
		if(!justCheck){
			if(typeof full_id_prefix !== "string"){
				//Default prefix
				full_id_prefix = "unicID";
			}

			if(typeof separator !== "string"){
				separator = "";
			}

			if(typeof domIds[full_id_prefix] === "undefined"){
				domIds[full_id_prefix] = 0;
			}
			domIds[full_id_prefix] = domIds[full_id_prefix] + 1;
			var full_id = full_id_prefix + separator + domIds[full_id_prefix];
		} else {
			var full_id = full_id_prefix;
			full_id_prefix = full_id_prefix.replace(full_id_prefix[full_id_prefix.length-1],"");
		}

		//Ensure that the id is unic.
		if(($("#"+full_id).length===0)&&(ids.indexOf(full_id)===-1)){
			ids.push(full_id);
			return full_id;
		} else {
			return getId(full_id_prefix,false,separator);
		}
	};

	var registerId = function(id){
		if (ids.indexOf(id)===-1){
			ids.push(id);
		}
	}

	/**
	 * Fix presentations with old JSON format
	 * Try to update them to current version
	 * Return null if presentation is irretrievable
	 */
	var fixPresentation = function(presentation){
		if((typeof presentation == "undefined")||(presentation === null)||(typeof presentation.slides == "undefined")){
			return null;
		}

		if(typeof presentation.VEVersion == "undefined"){
			presentation.VEVersion = "0.1";
		}

		presentation = _fixTypes(presentation);

		//Fix old slidesets
		if(V.Slides.isSlideset(presentation.type)){
			//Force presentation standard
			presentation.type = V.Constant.PRESENTATION;
		}

		if(!_checkIds(presentation)){
			presentation = _overwriteIds(presentation);
			// return null;
		}
		
		return presentation;
	}

	/**
	 * Check slide types and fix it
	 */
    var _fixTypes = function(presentation){
    	//Presentation type
    	if(typeof presentation.type == "undefined"){
			presentation.type = V.Constant.STANDARD;
		}

		//Slides type
		var slides = presentation.slides;
		var sL = slides.length;
		for(var i=0; i<sL; i++){
			var slide = slides[i];

			switch(slide.type){
				case V.Constant.STANDARD:
					break;
				case V.Constant.FLASHCARD:
				case V.Constant.VTOUR:
					var subslides = slide.slides;
					if(subslides){
						var ssL = subslides.length;
						for(var j=0; j<ssL;j++){
							if(typeof subslides[j].type == "undefined"){
								subslides[j].type = V.Constant.STANDARD;
							}
						}
					}
					break;
				case V.Constant.QUIZ_SIMPLE:
					break;
				default:
					slide.type = V.Constant.STANDARD;
					break;
			}
		}

		return presentation;
    }

	/*
	 * Look for errors in the presentation ids
	 * Return false if ids are wrong
	 */
	var _checkIds = function(presentation){
		var slides = presentation.slides;
		var sL = slides.length;

		for(var i=0; i<sL; i++){
			var slide = slides[i];

			if(!slide.id.match(/^article[0-9]+/g)){
				return false;
			}
			
			switch(slide.type){
				case V.Constant.STANDARD:
					if(!_checkIdsStandardSlide(slide)){
						return false;
					}
					break;
				case V.Constant.FLASHCARD:
					if(!_checkIdsFlashcardSlide(slide)){
						return false;
					}
					break;
				case V.Constant.VTOUR:
					if(!_checkIdsVTourSlide(slide)){
						return false;
					}
					break;
				case V.Constant.QUIZ_SIMPLE:
					break;
				default:
					break;
			}
		}

		return true;
	}

	var _checkIdsStandardSlide = function(slide){
		var elements = slide.elements;
		var eL = elements.length;
		for(var j=0;j<eL;j++){
			if (elements[j].id.match(new RegExp("^"+slide.id, "g")) === null){
				return false;
			}
		}
		return true;
	}

	var _checkIdsFlashcardSlide = function(slide){
		return _checkSlideset(slide);
	}

	var _checkIdsVTourSlide = function(slide){
		return _checkSlideset(slide);
	}

	var _checkSlideset = function(slideset){
		var subslides = slideset.slides;
		var subslidesIds = [];
		if(subslides){
			var ssL = subslides.length;
			for(var i=0; i<ssL;i++){
				var subslide = subslides[i];
				if(typeof subslide.id != "undefined"){
					subslidesIds.push(subslide.id);
				}
				if(!_checkIdsStandardSlide(subslide)){
					return false;
				}
			}
		}

		var pois = slideset.pois;
		if(typeof pois != "undefined"){
			var pL = pois.length;
			for(var j=0; j<pL;j++){
				var poi = pois[j];

				if(typeof poi.slide_id == "undefined"){
					return false;
				}

				if (poi.slide_id.match(new RegExp("^"+slideset.id+"_article[0-9]+", "g")) === null){
					return false;
				}

				if(subslidesIds.indexOf(poi.slide_id)===-1){
					return false;
				}
			}
		}

		return true;
	}

	var _overwriteIds = function(presentation){
		var slides = presentation.slides;
		var sL = slides.length;

		for(var i=0; i<sL; i++){
			var slide = slides[i];
			slide.id = "article"+(i+1).toString();
			
			switch(slide.type){
				case V.Constant.STANDARD:
					slide = _overwriteIdsStandardSlide(slide);
					break;
				case V.Constant.FLASHCARD:
					slide = _overwriteIdsFlashcardSlide(slide);
					break;
				case V.Constant.VTOUR:
					slide = _overwriteIdsVTourSlide(slide);
					break;
				case V.Constant.QUIZ_SIMPLE:
					break;
				default:
					return;
			}
		}

		return presentation;
	}

	var _overwriteIdsStandardSlide = function(slide){
		var elements = slide.elements;
		var eL = elements.length;
		for(var j=0;j<eL;j++){
			elements[j].id = slide.id + "_zone"+(j+1).toString();
		}
		return slide;
	}

	var _overwriteIdsFlashcardSlide = function(slide){
		return _overwriteIdsSlideset(slide);
	}

	var _overwriteIdsVTourSlide = function(slide){
		return _overwriteIdsSlideset(slide);
	}

	var _overwriteIdsSlideset = function(slideset){
		var subslides = slideset.slides;
		
		var subslidesIds = new Array();
		// subslidesIds[oldId] = newId

		if(subslides){
			var ssL = subslides.length;
			for(var i=0; i<ssL;i++){
				var subslide = subslides[i];
				var oldId = subslide.id;
				subslide.id = slideset.id + "_article"+(i+1).toString();
				subslidesIds[oldId] = subslide.id
				subslide = _overwriteIdsStandardSlide(subslide);
			}
		}

		var newPois = [];
		var pois = slideset.pois;
		if(typeof pois != "undefined"){
			var pL = pois.length;
			for(var j=0; j<pL;j++){
				var poi = pois[j];
				if(typeof subslidesIds[poi.slide_id] != "undefined"){
					poi.slide_id = subslidesIds[poi.slide_id];
					newPois.push(poi);
				}
			}
			slideset.pois = newPois;
		}

		return slideset;
	}


	var showPNotValidDialog = function(){
		$.fancybox(
			$("#presentation_not_valid_wrapper").html(),
			{
				'autoDimensions'  : false,
				'width'           : 650,
				'height'          : 250,
				'showCloseButton' : false,
				'padding'       : 0
			}
		);
	}

	var getOuterHTML = function(tag){
		//In some old browsers (before firefox 11 for example) outerHTML does not work
		//Trick to provide full browser support
		if (typeof($(tag)[0].outerHTML)=='undefined'){
			return $(tag).clone().wrap('<div></div>').parent().html();
		} else {
			return $(tag)[0].outerHTML;
		}
	}

	/*
	 * Function to send the parent to the specified URL, used for fullscreen
	 * We may be nested in more than one iframes
	 * So, we need to use window.top instead of window.parent
	 */
	var sendParentToURL = function(the_url){
		window.top.location = the_url;
	};

	var addParamToUrl = function(url,paramName,paramValue){
		if((typeof url !== "string")||(typeof paramName !== "string")||(typeof paramValue !== "string")){
			return url;
		}
		//Remove hash
		var splitHash = url.split("#");
		url = splitHash[0];

		var param = paramName+"="+paramValue;
		if (url.indexOf('?') > -1){
			url += '&'+param ;
		}else{
			url += '?'+param ;
		}

		//Add hash (if present)
		if(splitHash.length>1){
			url = url + "#" + splitHash[1];
		}
		
		return url;
	}

	var getParamsFromUrl = function(url){
		var params = {};
		if(typeof url !== "string"){
			return params;
		}
		var split = url.split("?");
		if(split.length<=1){
			return params;
		} else {
			//Remove hash if present
			var urlParams = split[1].split("#")[0].split("&");
			for(var i=0; i<urlParams.length; i++){
				var resultSplit = urlParams[i].split("=");
				if(resultSplit.length===2){
					//key-value pairs
					params[resultSplit[0]] = resultSplit[1];
				}
			}
			return params;
		}
	}

		
	//Check minium requirements to init vish editor
	var checkMiniumRequirements = function(){
		var browserRequirements = true;
		var device = V.Status.getDevice();

		switch(device.browser.name){
			case V.Constant.IE:
				if(V.Editing){
					if(device.browser.version < 9){
						browserRequirements = false;
					}
				} else {
					if(device.browser.version < 8){
						browserRequirements = false;
					}
				}
				break;
			case V.Constant.FIREFOX:
				break;
			case V.Constant.CHROME:
				break;
			default:
				//Allow...
			break;
		}
				
		if(!browserRequirements){
			$.fancybox(
				$("#requirements_form_wrapper").html(),
				{
					'autoDimensions'  : false,
					'width'           : 650,
					'height'          : 400,
					'showCloseButton' : false,
					'padding'       : 0,
					'onClosed'      : function(){
						//Do nothing!
					}
				}
			);
			return false;
		}

		return true;
	}
		

	/*
	* In the css we have url("image_path") and to use ir in an image src attribute we need to get the image_path
	* this function does that
	*/
	var getSrcFromCSS = function(css){
		if(css.indexOf("url") === 0){
			return css.substring(4,css.length-1);
		} else {
			return css;
		}
	}

	var getZoomInStyle = function(zoom){
		var style = "";
		style = style + "-ms-transform: scale(" + zoom + "); ";
		style = style + "-ms-transform-origin: 0 0; ";
		style = style + "-moz-transform: scale(" + zoom + "); ";
		style = style + "-moz-transform-origin: 0 0; ";
		style = style + "-o-transform: scale(" + zoom + "); ";
		style = style + "-o-transform-origin: 0 0; ";
		style = style + "-webkit-transform: scale(" + zoom + "); ";
		style = style + "-webkit-transform-origin: 0 0; ";
		return style;
	}

	var getZoomFromStyle = function(style){
		var zoom = 1; //Initial or default zoom

		if(!style){
			return zoom;
		}

		//Patterns
		var moz_zoom_pattern = /-moz-transform: ?scale\(([0-9]+.[0-9]+)\)/g
		var webkit_zoom_pattern = /-webkit-transform: ?scale\(([0-9]+.[0-9]+)\)/g
		var opera_zoom_pattern = /-o-transform: ?scale\(([0-9]+.[0-9]+)\)/g
		var ie_zoom_pattern = /-ms-transform: ?scale\(([0-9]+.[0-9]+)\)/g

		$.each(style.split(";"), function(index, property){
			if (property.match(moz_zoom_pattern) != null) {
				//Mozilla Firefox
				var result = moz_zoom_pattern.exec(property);
				if ((result!==null)&&(result[1])) {
					zoom = parseFloat(result[1]);
					return false;
				}
			} else if (property.match(webkit_zoom_pattern)!=null) {
				//Google Chrome
				var result = webkit_zoom_pattern.exec(property);
				if ((result!==null)&&(result[1])) {
					zoom = parseFloat(result[1]);
					return false;
				}
			} else if (property.match(opera_zoom_pattern)!=null) {
				//Opera
				var result = opera_zoom_pattern.exec(property);
				if ((result!==null)&&(result[1])) {
					zoom = parseFloat(result[1]);
					return false;
				}
			} else if (property.match(ie_zoom_pattern)!=null) {
				//Iexplorer
				var result = ie_zoom_pattern.exec(property);
				if ((result!==null)&&(result[1])) {
					zoom = parseFloat(result[1]);
					return false;
				}
			}
		});
		
		return zoom;
	};


   /**
	* Function to get width in pixels from a style attribute.
	* If width attribute is given by percent, area (parent container) attribute is needed.
	*/
	var getWidthFromStyle = function(style,area){
		return getPixelDimensionsFromStyle(style,area)[0];
	};
	
   /**
	* Function to get width in pixels from a style attribute.
	* If width attribute is given by percent, area (parent container) attribute is needed.
	*/
	var getHeightFromStyle = function(style,area){
		return getPixelDimensionsFromStyle(style,area)[1];
	};
	

	/**
	* Function to get width and height in pixels from a style attribute.
	* If widht or height attribute is given by percent, area (parent container) attribute is needed to convert to pixels.
	*/
	var getPixelDimensionsFromStyle = function(style,area){
		var dimensions = [];
		var width=null;
		var height=null;

		$.each(style.split(";"), function(index, property){

			//We need to redefine the var in each iteration (due to Android browser issues)
			var width_percent_pattern = /width:\s?([0-9]+(\.[0-9]+)?)%/g
			var width_px_pattern = /width:\s?([0-9]+(\.?[0-9]+)?)px/g
			var height_percent_pattern = /height:\s?([0-9]+(\.[0-9]+)?)%/g
			var height_px_pattern = /height:\s?([0-9]+(\.?[0-9]+)?)px/g

			//Look for property starting by width
			if(property.indexOf("width") !== -1){

				if(property.match(width_px_pattern)){
					//Width defined in px.
					var result = width_px_pattern.exec(property);
					if(result[1]){
						width = result[1];
					}
				} else if(property.match(width_percent_pattern)){
					//Width defined in %.
					var result = width_percent_pattern.exec(property);
					if(result[1]){
						var percent = result[1];
						if(area){
							width = $(area).width()*percent/100;
						}
					}
				}
			} else  if(property.indexOf("height") !== -1){

				if(property.match(height_px_pattern)){
					//height defined in px.
					var result = height_px_pattern.exec(property);
					if(result[1]){
						height = result[1];
					}
				} else if(property.match(height_percent_pattern)){
					//Width defined in %.
					var result = height_percent_pattern.exec(property);
					if(result[1]){
						var percent = result[1];
						if(area){
							height = $(area).height()*percent/100;
						}
					}
				}
			}
		});

		dimensions.push(width);
		dimensions.push(height);
		return dimensions;
	};

	var getFontSizeFromStyle = function(style){
		if(!style){
			return;
		}
		var ft = null;
	    $.each(style.split(";"), function(index, property){
	    	 //We need to redefine the var in each iteration (due to Android browser issues)
	    	 var font_style_pattern = /font-size:\s?([0-9]+)px/g;
		     if (property.match(font_style_pattern) != null) {
			   	var result = font_style_pattern.exec(property);
			   	if ((result!==null)&&(result[1]!==null)) {
			   		ft = parseFloat(result[1]);
			   		return false;
			   	}
			 }
		});
		return ft;
	}

	var addFontSizeToStyle = function(style,fontSize){
		if(typeof style !== "string"){
			return null;
		}

		var filterStyle = "";
		$.each(style.split(";"), function(index, property){
			if ((property.indexOf("font-size") === -1)&&(property!=="")) {
				filterStyle = filterStyle + property + "; ";
			}
		});
				
		if(fontSize){
			filterStyle = filterStyle + "font-size:"+fontSize+";";
		}

		return filterStyle;
	}

	var removeFontSizeInStyle = function(style){
		if(typeof style !== "string"){
			return null;
		}

		var filterStyle = "";
		$.each(style.split(";"), function(index, property){
			if ((property.indexOf("font-size") === -1)&&(property!=="")) {
				filterStyle = filterStyle + property + "; ";
			}
		});

		return filterStyle;
	}


   return {
		init 					: init,
		getOptions 				: getOptions,
		getId					: getId,
		registerId				: registerId,
		getOuterHTML 			: getOuterHTML,
		getSrcFromCSS			: getSrcFromCSS,
		checkMiniumRequirements : checkMiniumRequirements,
		addFontSizeToStyle 		: addFontSizeToStyle,
		removeFontSizeInStyle 	: removeFontSizeInStyle,
		getFontSizeFromStyle 	: getFontSizeFromStyle,
		getZoomFromStyle 		: getZoomFromStyle,
		getZoomInStyle    		: getZoomInStyle,
		getWidthFromStyle   	: getWidthFromStyle,
		getHeightFromStyle  	: getHeightFromStyle,
		getPixelDimensionsFromStyle : getPixelDimensionsFromStyle,
		sendParentToURL			: sendParentToURL,
		addParamToUrl			: addParamToUrl,
		getParamsFromUrl		: getParamsFromUrl,
		fixPresentation			: fixPresentation,
		showPNotValidDialog		: showPNotValidDialog
   };

}) (VISH);