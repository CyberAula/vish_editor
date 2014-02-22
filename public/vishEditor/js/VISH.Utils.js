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

		jQuery.fn.reverse = [].reverse;

		//Extend primitives
		String.prototype.replaceAll = function (find, replace) {
			var str = this;
			return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
		};

		Array.prototype.select = function(selectFunction){
			for(var n = 0; n < this.length; n++) {
				if(selectFunction(this[n])){
					return this[n];
				}
			}
			return null;
		};

		// if(!Array.prototype.filter){
			Array.prototype.filter = function(fun /*, thisp */){
				"use strict";

				if (this == null)
					throw new TypeError();

				var t = Object(this);
				var len = t.length >>> 0;
				if (typeof fun != "function")
					throw new TypeError();

				var res = [];
				var thisp = arguments[1];
				for (var i = 0; i < len; i++)
				{
					if (i in t)
					{
						var val = t[i]; // in case fun mutates this
						if (fun.call(thisp, val, i, t))
							res.push(val);
					}
				}
				return res;
			};
		// };

		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
		// if (!Array.prototype.map){
			Array.prototype.map = function(fun /*, thisArg */){
				"use strict";

				if (this === void 0 || this === null)
					throw new TypeError();

				var t = Object(this);
				var len = t.length >>> 0;
				if (typeof fun !== "function")
					throw new TypeError();

				var res = new Array(len);
				var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
				for (var i = 0; i < len; i++)
				{
					// NOTE: Absolute correctness would demand Object.defineProperty
					//       be used.  But this method is fairly new, and failure is
					//       possible only if Object.prototype or Array.prototype
					//       has a property |i| (very unlikely), so use a less-correct
					//       but more portable alternative.
					if (i in t)
						res[i] = fun.call(thisArg, t[i], i, t);
				}

				return res;
			};
		// }

		//Disable watermark for IE
		jQuery.fn.vewatermark = function(text){
			if(V.Status.getDevice().browser.name != V.Constant.IE){
				$(this).watermark(text);
			} else {
				$(this).attr("placeholder",text);
			}
		};
	};

	var dimentionsToDraw = function(w_zone, h_zone, w_content, h_content){
		var dimentions = {width:  w_content, height: h_content};
		var aspect_ratio_zone = w_zone/h_zone;
		var aspect_ratio_content = w_content/h_content;
		
		if (aspect_ratio_zone>aspect_ratio_content) {
			dimentions.width = aspect_ratio_content*h_zone;
			dimentions.height = h_zone;
			return dimentions;
		} else {
			dimentions.width = w_zone;
			dimentions.height = w_zone/aspect_ratio_content;
			return  dimentions;
		}
	};

	var fitChildInParent = function(child){
		var parent = $(child).parent();
		var dimensions = V.Utils.dimentionsToDraw($(parent).width(),$(parent).height(),$(child).width(),$(child).height());
		$(child).width(dimensions.width);
		$(child).height(dimensions.height);
	};

	var getOptions = function(){
		if(V.Editing){
			return V.Editor.getOptions();
		} else {
			return V.Viewer.getOptions();
		}
	};

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
	};

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
		if(V.Slideset.isSlideset(presentation.type)){
			//Force presentation standard
			presentation.type = V.Constant.PRESENTATION;
		}

		if(!_checkIds(presentation)){
			presentation = _overwriteIds(presentation);
			// return null;
		}

		return presentation;
	};

	/**
	 * Check slide types and fix it
	 */
    var _fixTypes = function(presentation){
    	//Presentation type
    	if(typeof presentation.type == "undefined"){
			presentation.type = V.Constant.PRESENTATION;
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
				case V.Constant.EVIDEO:
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
    };

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
	};

	var _checkIdsStandardSlide = function(slide){
		var elements = slide.elements;
		var eL = elements.length;
		for(var j=0;j<eL;j++){
			if (elements[j].id.match(new RegExp("^"+slide.id, "g")) === null){
				return false;
			}
		}
		return true;
	};

	var _checkIdsFlashcardSlide = function(slide){
		return _checkSlideset(slide);
	};

	var _checkIdsVTourSlide = function(slide){
		return _checkSlideset(slide);
	};

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
	};

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
	};

	var _overwriteIdsStandardSlide = function(slide){
		var elements = slide.elements;
		var eL = elements.length;
		for(var j=0;j<eL;j++){
			elements[j].id = slide.id + "_zone"+(j+1).toString();
		}
		return slide;
	};

	var _overwriteIdsFlashcardSlide = function(slide){
		return _overwriteIdsSlideset(slide);
	};

	var _overwriteIdsVTourSlide = function(slide){
		return _overwriteIdsSlideset(slide);
	};

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
	};

	var showPNotValidDialog = function(){
		var options = {};
		options.width = 650;
		options.height = 220;
		options.text = V.I18n.getTrans("i.resourceNonCompatibleNotification");
		var button1 = {};
		button1.text = V.I18n.getTrans("i.Ok");
		button1.callback = function(){
			$.fancybox.close();
		}
		options.buttons = [button1];
		V.Utils.showDialog(options);
	};

	var getOuterHTML = function(tag){
		//In some old browsers (before firefox 11 for example) outerHTML does not work
		//Trick to provide full browser support
		if (typeof($(tag)[0].outerHTML)=='undefined'){
			return $(tag).clone().wrap('<div></div>').parent().html();
		} else {
			return $(tag)[0].outerHTML;
		}
	};

	/*
	 * Function to send the parent to the specified URL, used for fullscreen
	 * We may be nested in more than one iframes
	 * So, we need to use window.top instead of window.parent
	 */
	var sendParentToURL = function(the_url){
		window.top.location = the_url;
	};

	var removeParamFromUrl = function(url,paramName){
		if((typeof url !== "string")||(typeof paramName !== "string")){
			return url;
		}

		//Remove hash
		var splitHash = url.split("#");
		url = splitHash[0];

		var splitParams = url.split("?");
		if (splitParams.length === 2){
			url = splitParams[0];
			var params = splitParams[1];

			var validParams = [];
			var splitParams = params.split("&");
			var sPL = splitParams.length;
			for(var i=0; i<sPL; i++){
				var splitParam = splitParams[i].split("=");
				if(splitParam[0]!=paramName){
					validParams.push({key: splitParam[0], value: splitParam[1]}); 
				}
			}
			//Add valid params
			var vPL = validParams.length;
			for(var j=0; j<vPL; j++){
				var param = validParams[j];
				if(j===0){
					url = url + "?";
				} else {
					url = url + "&";
				}
				url = url + param.key + "=" + param.value;
			}
		}

		//Add hash (if present)
		if(splitHash.length>1){
			url = url + "#" + splitHash[1];
		}

		return url;
	};

	var addParamToUrl = function(url,paramName,paramValue){
		if((typeof url !== "string")||(typeof paramName !== "string")||(typeof paramValue !== "string")){
			return url;
		}

		//Remove param (to overwrite it in case if exists)
		url = removeParamFromUrl(url,paramName);

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
	};

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
	};

		
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
	};
		

	/*
	* In the css we have url("image_path") and to use ir in an image src attribute we need to get the image_path
	* this function does that
	*/
	var getSrcFromCSS = function(css){
		try {
			if((typeof css == "string")&&(css.indexOf("url")===0)&&(css.length>3)){
				var quote = css[4];
				if((quote=="\"")||(quote=="'")){
					return css.substring(5,css.length-2);
				} else {
					return css.substring(4,css.length-1);
				}
			}
		} catch(e){}
		
		return css;
	};

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
	};

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
		     if(property.match(font_style_pattern) != null){
			   	var result = font_style_pattern.exec(property);
			   	if ((result!==null)&&(result[1]!==null)) {
			   		ft = parseFloat(result[1]);
			   		return false;
			   	}
			 }
		});
		return ft;
	};

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
	};

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
	};

	var getBackgroundPosition = function(elem){
		var bp = {x:0, y:0}
		var ebp = $(elem).css('background-position').split(' ');
		var ebpL = ebp.length;

		if(ebpL === 2){
			bp.x = parseInt(ebp[0],10);
			bp.y = parseInt(ebp[1],10);
		} else if((ebp.length === 4)&&(ebp[0] === 'left')){
			bp.x = parseInt(ebp[1],10);
			bp.y = parseInt(ebp[3],10);
		}

		bp.x = isNaN(bp.x) ? 0 : bp.x;
		bp.y = isNaN(bp.y) ? 0 : bp.y;

		return bp;
	};


	/*
	 * Helper to show validation dialogs
	 */
	var showDialog = function(options){
		_cleanDialog();

		var rootTemplate = $("#notification_template");
		if($(rootTemplate).length===0){
			return;
		}

		if((!options)||(!options.text)){
			return;
		}
		
		//*Defaults
		var width = '90%';
		var height; //it will be calculated
		var showCloseButton = false;
		var notificationIconSrc;
		if(V.Editing){
			notificationIconSrc = V.ImagesPath + "zonethumbs/content_fail.png";
		}
		
		if(options.width){
			width = options.width;
		}
		if(options.showCloseButton){
			showCloseButton = options.showCloseButton;
		}
		if(options.notificationIconSrc){
			notificationIconSrc = options.notificationIconSrc;
		}

		//Automatically center text when no image is specified in the notification
		if(!notificationIconSrc){
			options.textWrapperClass = "forceCenter";
		}

		//Transform width to px (if not)
		if((typeof width == "string")&&(width.indexOf("%")!=0)){
			width = width.split("%")[0].trim();
			width = (width*$(window).width())/100;
		}

		//*Calculate Height (use root template)
		var notificationParent = $(rootTemplate).parent();
		$(rootTemplate).width(width);
		
		//Fill template
		var text_wrapper = $(rootTemplate).find(".notification_row1");
		var buttons_wrapper = $(rootTemplate).find(".notification_row2");
		var imgIcon = $(text_wrapper).find(".notificationIcon");

		if(notificationIconSrc){
			$(imgIcon).attr("src",notificationIconSrc);
			$(imgIcon).css("display","inline");
		}
		if(options.notificationIconClass){
			$(imgIcon).addClass(options.notificationIconClass);
		}

		if(options.textWrapperClass){
			$(text_wrapper).addClass(options.textWrapperClass);
		}

		if(options.buttonsWrapperClass){
			$(buttons_wrapper).addClass(options.buttonsWrapperClass);
		}

		$(text_wrapper).find(".notification_text").html(options.text);

		if(options.buttons){
			var obLength = options.buttons.length;
			$(options.buttons).reverse().each(function(index,button){
				var bNumber = obLength-index;
				var buttonDOM = $('<a href="#" buttonNumber="'+bNumber+'" class="button notification_button">'+button.text+'</a>');
				if(button.extraclass){
					$(buttonDOM).addClass(button.extraclass);
				}
				$(buttons_wrapper).append(buttonDOM);
			});
		}

		//Look for additional HTML
		if(options.middlerow){
			var middlerow = document.createElement('div');
			$(middlerow).addClass("notification_middlerow");
			$(middlerow).append(options.middlerow);
			if(options.middlerowExtraClass){
				$(middlerow).addClass(options.middlerowExtraClass);
			}
			$(buttons_wrapper).before(middlerow);
		}

		V.Utils.addTempShown(notificationParent);
		var adjustedHeight = $(text_wrapper).outerHeight(true)+$(buttons_wrapper).outerHeight(true);
		if(options.middlerow){
			var middlerow = $(rootTemplate).find(".notification_middlerow");
			adjustedHeight = adjustedHeight + $(middlerow).outerHeight(true);
		}
		V.Utils.removeTempShown(notificationParent);

		//*Clone the root template
		var cloneTemplate = $(rootTemplate).clone();
		$(cloneTemplate).attr("id","notification_template_cloned");
		$(notificationParent).append(cloneTemplate);
		var notification = $("#notification_template_cloned");

		//Replace buttons (we need to add the events)
		if(options.buttons){
			buttons_wrapper = $(notification).find(".notification_row2");
			$(buttons_wrapper).html("");
			var obLength = options.buttons.length;
			$(options.buttons).reverse().each(function(index,button){
				var bNumber = obLength-index;
				var buttonDOM = $('<a href="#" buttonNumber="'+bNumber+'" class="button notification_button">'+button.text+'</a>');
				if(button.extraclass){
					$(buttonDOM).addClass(button.extraclass);
				}
				$(buttons_wrapper).append(buttonDOM);

				//Add buttons callback
				$(buttons_wrapper).find(".button[buttonNumber='"+bNumber+"']").click(function(event){
					event.preventDefault();
					button.callback();
				});
			});
		};

		$("a#link_to_notification_template").fancybox({
			'autoDimensions' 	: false,
			'autoScale' 		: true,
			'scrolling'			: 'no',
			'width'				: width,
			'height'			: adjustedHeight,
			'padding' 			: 0,
			'hideOnOverlayClick': true,
			'hideOnContentClick': false,
			'showCloseButton'	: showCloseButton,
			"onStart"  	: function(data){
			},
			"onComplete"  	: function(data){
			},
			"onClosed" : function(data){
				_cleanDialog();
				if((options)&&(typeof options.onClosedCallback == "function")){
					options.onClosedCallback();
				}
			}
		});
		
		$("a#link_to_notification_template").trigger('click');
	};

	var _cleanDialog = function(){
		var notificationWrapper = $("#notification_template_wrapper");
		$(notificationWrapper).html("");
		
		var notificationTemplate = document.createElement('div');
		$(notificationTemplate).attr("id","notification_template");

		var row1 = document.createElement('div');
		$(row1).addClass("notification_row1");
		var img = document.createElement('img');
		$(img).addClass("notificationIcon");
		$(img).attr("style","display:none");
		var span = document.createElement('span');
		$(span).addClass("notification_text");
		$(row1).append(img);
		$(row1).append(span);
		$(notificationTemplate).append(row1);

		var row2 = document.createElement('div');
		$(row2).addClass("notification_row2");
		$(notificationTemplate).append(row2);

		$(notificationWrapper).append(notificationTemplate);
	};

	/////////////
	// VERSION MANAGEMENT
	////////////

	var isObseleteVersion = function(version){
		return _getVersionValue(V.VERSION) > _getVersionValue(version);
	};

	var _getVersionValue = function(version){
		var vValue = 0;
		var coef = [100,10,1];
		try {
			var digits = version.split(".");
			for(var i=0; i<digits.length; i++){
				vValue += parseFloat(digits[i])*coef[i];
			}
		} catch (e){
			return 0;
		}
		return vValue;
	};


	/* Hash Management */

	var getSlideNumberFromHash = function(){
		try {
			if(getOptions()["readHashFromParent"]===true){
				var location = window.parent.location;
			} else {
				var location = window.location;
			}

			if(typeof location == "undefined"){
				return;
			}

			var sNumber = Math.max(1,Math.min(V.Slides.getSlidesQuantity(),parseInt(location.hash.split("?")[0].split("#").pop())));
			if(isNaN(sNumber)){
				return undefined;
			} else {
				return sNumber;
			}
		} catch(err){
			return undefined;
		}
	};

	var updateHash = function(){
		var newHash = '#' + V.Slides.getCurrentSlideNumber();

		//Propagate hash (slidenumber without params)
		if(getOptions()["readHashFromParent"]===true){
			window.parent.location.hash = newHash;
		}

		var splitedHash = location.hash.split("?");
		if(splitedHash.length > 1){
			newHash = newHash + "?" + splitedHash[1];
		}

		window.location.hash = newHash;
	};

	var cleanHash = function(){
		window.location.hash = "";
		if(getOptions()["readHashFromParent"]===true){
			window.parent.location.hash = "";
		}

		//Try to remove # simbol
		if(V.Status.getDevice().features.historypushState){
			var locationWithoutHash = removeHashFromUrlString(document.location.href);
			window.history.replaceState("","",locationWithoutHash);
			if(getOptions()["readHashFromParent"]===true){
				var locationWithoutHash = removeHashFromUrlString(window.parent.document.location.href);
				window.parent.history.replaceState("","",locationWithoutHash);
			}
		}
	};

	var removeHashFromUrlString = function(url){
		return url.split("#")[0];
	};

	var getHashParams = function(){
		var params = {};
		var hash = window.location.hash;
		var splitHash = hash.split("?");
		if (splitHash.length > 1) {
			var hashParams = splitHash[1];
			var splitParams = hashParams.split("&");
			var sPL = splitParams.length;
			for(var i=0; i<sPL; i++){
				var paramInHash = splitParams[i];
				var splitParamInHash = paramInHash.split("=");
				if(splitParamInHash.length === 2){
					params[splitParamInHash[0]] = splitParamInHash[1];
				}
			}
		}
		return params;
	};


	/* 
	 * Multiple animation callback
	 */
	var nAnimationsFinishedList = {};
	var checkAnimationsFinish = function(animationId,nAnimations,callback,callbackParams){
		if(typeof nAnimationsFinishedList[animationId] == "undefined"){
			nAnimationsFinishedList[animationId] = 0;
		}
		nAnimationsFinishedList[animationId] = nAnimationsFinishedList[animationId] + 1;

		if(nAnimationsFinishedList[animationId]===nAnimations){
			nAnimationsFinishedList[animationId] = 0;
			if(typeof callback == "function"){
				callback(callbackParams);
			}
		}
	};


	/* Time Format for Multimedia */
	var fomatTimeForMPlayer = function(s,sN){
		sN = (typeof sN == "number" ? sN : -1);

		//Get whole hours
		var h = Math.floor(s/3600);
		s -= h*3600;

		//Get remaining minutes
		var m = Math.floor(s/60); 
		s -= m*60;
		s = Math.round(s);

		return ((h<1 && sN<5) ? '' : h + ":") + (((sN>3)&&(m<10)) ? '0'+m : m) + ":" + (s < 10 ? '0'+s : s);
	};
	
	
	/* 
	 * Prevent multiple calls to the same function in a time period 
	 */
	var delayedFunctionTimestamps = {};
	var delayedFunctionTimers = {};

	var delayFunction = function(functionId,callbackFunction,PERIOD){
		var dN = Date.now();
		// var timeStamp = delayedFunctionTimestamps[functionId];
		// var timer = delayedFunctionTimers[functionId];

		if(typeof delayedFunctionTimestamps[functionId] != "undefined"){
			var diff = dN - delayedFunctionTimestamps[functionId];
			if(diff < PERIOD){
				if(typeof delayedFunctionTimers[functionId] == "undefined"){
					delayedFunctionTimers[functionId] = setTimeout(function(){
						delayedFunctionTimers[functionId] = undefined;
						callbackFunction();
					},PERIOD-diff);
				}
				return true;
			}
		}

		if(typeof delayedFunctionTimers[functionId] != "undefined"){
			clearTimeout(delayedFunctionTimers[functionId]);
			delayedFunctionTimers[functionId] = undefined;
		}
		delayedFunctionTimestamps[functionId] = dN;

		return false;
	};


	var tempShownCounts = {};

	var addTempShown = function(els){
		$(els).each(function(index,el){
			var elId = $(el).attr("id");
			if(typeof elId == "undefined"){
				// V.Debugging.log("WARNING: Element without id");
				// V.Debugging.log(el);
				elId = V.Utils.getId("TmpShownId");
				$(el).attr("id",elId);
			}
			var tmpShownCount = (typeof tempShownCounts[elId] != "undefined") ? tempShownCounts[elId] : 0;
			tempShownCounts[elId] = tmpShownCount+1;
			if(tmpShownCount==0){
				$(el).addClass("temp_shown");
			}
		});
	};

	var removeTempShown = function(els){
		$(els).each(function(index,el){
			var elId = $(el).attr("id");
			if(typeof elId == "undefined"){
				elId = V.Utils.getId("TmpShownId");
				$(el).attr("id",elId);
			}
			var tmpShownCount = (typeof tempShownCounts[elId] != "undefined") ? tempShownCounts[elId] : 0;
			var newTmpShownCount = Math.max(0,tmpShownCount-1);
			tempShownCounts[elId] = newTmpShownCount;
			if(newTmpShownCount==0){
				setTimeout(function(){
					if(tempShownCounts[elId]===0){
						$(el).removeClass("temp_shown");
					}
				},1);
			}
		});
	};


	return {
		init 					: init,
		getOptions 				: getOptions,
		dimentionsToDraw		: dimentionsToDraw,
		fitChildInParent		: fitChildInParent,
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
		getBackgroundPosition	: getBackgroundPosition,
		sendParentToURL			: sendParentToURL,
		addParamToUrl			: addParamToUrl,
		removeParamFromUrl		: removeParamFromUrl,
		getParamsFromUrl		: getParamsFromUrl,
		fixPresentation			: fixPresentation,
		showDialog 				: showDialog,
		showPNotValidDialog		: showPNotValidDialog,
		isObseleteVersion		: isObseleteVersion,
		updateHash				: updateHash,
		cleanHash				: cleanHash,
		removeHashFromUrlString	: removeHashFromUrlString,
		getHashParams			: getHashParams,
		getSlideNumberFromHash	: getSlideNumberFromHash,
		checkAnimationsFinish	: checkAnimationsFinish,
		fomatTimeForMPlayer		: fomatTimeForMPlayer,
		delayFunction 			: delayFunction,
		addTempShown			: addTempShown,
		removeTempShown			: removeTempShown
	};

}) (VISH);