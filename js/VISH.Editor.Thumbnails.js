/*
 * Manage slide thumbnails
 */
VISH.Editor.Thumbnails = (function(V,$,undefined){
	
	var thumbnailsDivId = "slides_list";
	var slidesetThumbnailsDivId = "subslides_list";

	//Tmp vars
	var redrawThumbnailsCallback;
	var drawSlidesetThumbnailsCallback;

	//State vars
	var lastSelectedSlideThumbnail = undefined;
	var lastSelectedSubslideThumbnail = undefined;
	
	var init = function(){
	}
	 
	var redrawThumbnails = function(successCallback){
		redrawThumbnailsCallback = successCallback;

		//Clean previous content
		V.Editor.Scrollbar.cleanScrollbar(thumbnailsDivId);
		$("#" + thumbnailsDivId).hide();

		//Generate thumbnail images
		var imagesArray = [];
		var imagesArrayTitles = [];

		var slideElements = 0;
		$('.slides > article').each(function(index,s){
			var srcURL = getThumbnailURL(s);
			var defaultURL = getDefaultThumbnailURL(s);
			if(srcURL){
				slideElements += 1;
				imagesArray.push($("<img id='slideThumbnail" + slideElements + "' class='image_barbutton' slideNumber='" + slideElements + "' action='goToSlide' src='" + srcURL + "' defaultsrc='" + defaultURL + "'/>"));
				imagesArrayTitles.push(slideElements);
			}
    	});

		var options = {};
		options.order = true;
		options.titleArray = imagesArrayTitles;
		options.callback = _onImagesLoaded;
		options.defaultOnError = true;
		options.onImageErrorCallback = _onImageError;
		V.Utils.Loader.loadImagesOnContainer(imagesArray,thumbnailsDivId,options);
	};
	 
	var _onImageError = function(image){
		var slideNumber = $(image).attr("slidenumber");
		var slide = V.Slides.getSlideWithNumber(slideNumber);
		var isSlideset = V.Slideset.isSlideset(slide);
		if(isSlideset){
			var creator = V.Editor.Slideset.getCreatorModule(slide);
			if(typeof creator.onThumbnailLoadFail == "function"){
				creator.onThumbnailLoadFail(slide);
			}
		}
	}

	var _onImagesLoaded = function(){
		//Add class to title elements and events
		$("#" + thumbnailsDivId).find("img.image_barbutton").each(function(index,img){
			//Add class to title
			var imgContainer = $(img).parent();
			$(imgContainer).addClass("wrapper_barbutton");
			$(imgContainer).addClass("preventNoselectable");
			var p = $(imgContainer).find("p");
			$(p).addClass("ptext_barbutton");

			//Add events to imgs
			$(img).click(function(event){
				_onClickSlideElement(event);
			});
		});

		//Unselect all thumbnails
		$(".barbutton").css("background-color", "transparent");

		var options = new Array();
		options['callback'] = _afterCreateSlidesScrollbar;

		//Create scrollbar
		$("#" + thumbnailsDivId).show();
		V.Editor.Scrollbar.createScrollbar(thumbnailsDivId, options);
	}
	
	var _afterCreateSlidesScrollbar = function(){
		//Add sortable
		$( "#" + thumbnailsDivId).sortable({
			items: 'div.wrapper_barbutton:has(img[action="goToSlide"])',
			change: function(event, ui) {
				//Do nothing
			},
			start: function(event, ui) { 
				//Do nothing
			},
			stop: function(event, ui) {
				var dragElement = ui.item;

				var img = $(ui.item).find("img.image_barbutton[slidenumber]");
				if(isNaN($(img).attr("slidenumber"))){
					return;
				}

				var orgPosition = parseInt($(img).attr("slidenumber"));
				var destPosition;

				//Detect destPosition
				$("#slides_list").find("img.image_barbutton[slidenumber]").each(function(index,item){
					var beforeIndex = parseInt($(item).attr("slidenumber"));
					var afterIndex = index+1;

					if((beforeIndex===orgPosition)&&(beforeIndex!=afterIndex)){
						destPosition = afterIndex;
					}

				});

				// V.Debugging.log("Org position: " + orgPosition);
				// V.Debugging.log("Dest position: " + destPosition);

				V.Editor.Slides.moveSlideTo(orgPosition, destPosition);
			}
		});

		if(typeof redrawThumbnailsCallback == "function"){
			redrawThumbnailsCallback();
			redrawThumbnailsCallback = undefined;
		}
	}

	var _onClickSlideElement = function(event){
		switch($(event.target).attr("action")){
			case "goToSlide":
				V.Slides.goToSlide($(event.target).attr("slideNumber"));
				break;
			default:
			  return;
		}
	}

	/**
	* Function to select the thumbnail
	*/
	var selectThumbnail = function(no){
		$("#slides_list img.image_barbutton").removeClass("selectedSlideThumbnail");
		$("#slides_list img.image_barbutton[slideNumber=" + no + "]").addClass("selectedSlideThumbnail");

		var advance = ((lastSelectedSlideThumbnail===undefined)||(no > lastSelectedSlideThumbnail));
		lastSelectedSlideThumbnail = no;
		var slide = V.Slides.getSlideWithNumber(no);
		if(!isThumbnailVisible(slide)){
			if(advance){
				moveThumbnailsToSlide(Math.max(no-5,1));
			} else {
				moveThumbnailsToSlide(no);
			}
		};
	};

	var moveThumbnailsToSlide = function(slideNumber){
		var element = $("img.image_barbutton[slideNumber=" + slideNumber + "]");
		V.Editor.Scrollbar.goToElement(thumbnailsDivId,element);
	}

	var moveThumbnailsToSubslide = function(slideNumber){
		var element = $("#subslides_list img.image_barbutton[slideNumber=" + slideNumber + "]").parent();
		V.Editor.Scrollbar.goToElement(slidesetThumbnailsDivId,element);
	}
  
	var getThumbnailForSlide = function(slide){
		if(V.Slides.isSubslide(slide)){
			return _getThumbnailForSubslide(slide);
		}
		var slidenumber = $(slide).attr("slidenumber");
		return $("#slides_list img.image_barbutton[slideNumber=" + slidenumber + "]");
	}

	var _getThumbnailForSubslide = function(subslide){
		var slidenumber = $(subslide).attr("slidenumber");
		return $("#subslides_list img.image_barbutton[slideNumber=" + slidenumber + "]");
	}

	var getThumbnailURL = function(slide){
		var thumbnailURL;
		var slideType = $(slide).attr('type');
		var isSlideset = V.Slideset.isSlideset(slideType);

		if(isSlideset){
			thumbnailURL = V.Editor.Slideset.getCreatorModule(slideType).getThumbnailURL(slide);
		} else if(slideType==V.Constant.STANDARD){
			//If the slide only contains one element, and it's an image, use it as thumbnail.
			var zone = $(slide).children("div.vezone");
			if(($(zone).length === 1)&&(!V.Editor.isZoneEmpty(zone))&&($(zone).attr("type")=="image")){
				//The slide contains only one image in the zone 'zone'
				var img = $(zone).find("img");
				if(($(img).length === 1)&&(typeof $(img).attr("src") == "string")){
					thumbnailURL = $(img).attr("src");
				}
			} else {
				thumbnailURL = _getDefaultThumbnailURLForStandardSlide(slide);
			}
		}

		return thumbnailURL;
	};

	var getDefaultThumbnailURL = function(slide){
		var slideType = $(slide).attr('type');

		if(slideType==V.Constant.STANDARD){
			return _getDefaultThumbnailURLForStandardSlide(slide);
		} else if(V.Slideset.isSlideset(slideType)){
			var creatorModule = V.Editor.Slideset.getCreatorModule(slideType);
			if(typeof creatorModule.getDefaultThumbnailURL == "function"){
				return creatorModule.getDefaultThumbnailURL(slide);
			} else {
				return creatorModule.getThumbnailURL(slide);
			}
		}
	};

	var _getDefaultThumbnailURLForStandardSlide = function(slide){
		//Use template as thumbnail
		var template = $(slide).attr('template');
		return V.ImagesPath + "templatesthumbs/"+ template + ".png";
	};

	////////////////
	// Slideset Thumbnails
	///////////////

	var drawSlidesetThumbnails = function(subslides,successCallback){
		drawSlidesetThumbnailsCallback = successCallback;

		//Clean previous content
		V.Editor.Scrollbar.cleanScrollbar(slidesetThumbnailsDivId);
		$("#" + slidesetThumbnailsDivId).hide();

		//Generate thumbnail images
		var imagesArray = [];
		var imagesArrayTitles = [];

		var slideElements = 0;

		$(subslides).each(function(index,s){

			if($(s).attr('type')!==V.Constant.STANDARD){
				V.Debugging.log("Subslide must be of standard type");
				return true; //Continue
			}

			var srcURL = getThumbnailURL(s);
			var defaultURL = getDefaultThumbnailURL(s);
			slideElements += 1;
			imagesArray.push($("<img id='subslideThumbnail" + slideElements + "' class='image_barbutton' slideNumber='" + slideElements + "' src='" + srcURL + "' defaultsrc='" + defaultURL + "'/>"));
			imagesArrayTitles.push(String.fromCharCode(64+slideElements));
    	});

		var options = {};
		options.order = true;
		options.titleArray = imagesArrayTitles;
		options.callback = _onSlidesetThumbnailsImagesLoaded;
		options.defaultOnError = true;
		V.Utils.Loader.loadImagesOnContainer(imagesArray,slidesetThumbnailsDivId,options);
	};

	var _onSlidesetThumbnailsImagesLoaded = function(){
		//Add class to title elements and events
		$("#" + slidesetThumbnailsDivId).find("img.image_barbutton").each(function(index,img){
			//Add class to title
			var imgContainer = $(img).parent();
			$(imgContainer).addClass("wrapper_barbutton");
			var p = $(imgContainer).find("p");
			$(p).addClass("ptext_barbutton");

			//Add events to imgs
			$(img).click(function(event){
				_onClickSubslideElement(event);
			});
		});

		V.Editor.Slideset.beforeCreateSlidesetThumbnails();

		var options = new Array();
		options['horizontalScroll'] = true;
		options['callback'] = _afterCreateSubslidesScrollbar;

		//Create scrollbar
		$("#" + slidesetThumbnailsDivId).show();
		V.Editor.Scrollbar.createScrollbar(slidesetThumbnailsDivId, options);
	}

	var _afterCreateSubslidesScrollbar = function(){
		// //Add sortable
		
		// $( "#" + thumbnailsDivId).sortable({
		// 	items: 'div.wrapper_barbutton:has(img[action="goToSlide"])',
		// 	change: function(event, ui) {
		// 		//Do nothing
		// 	},
		// 	start: function(event, ui) { 
		// 		//Do nothing
		// 	},
		// 	stop: function(event, ui) {
		// 		var dragElement = ui.item;

		// 		var img = $(ui.item).find("img.image_barbutton[slidenumber]");
		// 		if(isNaN($(img).attr("slidenumber"))){
		// 			return;
		// 		}

		// 		var orgPosition = parseInt($(img).attr("slidenumber"));
		// 		var destPosition;

		// 		//Detect destPosition
		// 		$("#slides_list").find("img.image_barbutton[slidenumber]").each(function(index,item){
		// 			var beforeIndex = parseInt($(item).attr("slidenumber"));
		// 			var afterIndex = index+1;

		// 			if((beforeIndex===orgPosition)&&(beforeIndex!=afterIndex)){
		// 				destPosition = afterIndex;
		// 			}

		// 		});

		// 		// V.Debugging.log("Org position: " + orgPosition);
		// 		// V.Debugging.log("Dest position: " + destPosition);

		// 		V.Editor.Slides.moveSlideTo(orgPosition, destPosition);
		// 	}
		// });

		if(typeof drawSlidesetThumbnailsCallback == "function"){
			drawSlidesetThumbnailsCallback();
			drawSlidesetThumbnailsCallback = undefined;
		}
	}

	var _onClickSubslideElement = function(event){
		var subslideNumber = $(event.target).attr("slideNumber");
		V.Editor.Slideset.openSubslideWithNumber(subslideNumber);
	}

	var selectSubslideThumbnail = function(no){
		$("#subslides_list img.image_barbutton").removeClass("selectedSubslideThumbnail");
		if(no===null){
			//Used to unselect all subslide thumbnails
			return;
		}
		$("#subslides_list img.image_barbutton[slideNumber=" + no + "]").addClass("selectedSubslideThumbnail");

		var advance = ((lastSelectedSubslideThumbnail===undefined)||(no > lastSelectedSubslideThumbnail));
		lastSelectedSubslideThumbnail = no;
		var subslide = V.Slides.getSubslideWithNumber(V.Slides.getCurrentSlide(),no);
		if(!isThumbnailVisible(subslide)){
			if(advance){
				moveThumbnailsToSubslide(Math.max(no-7,1));
			} else {
				moveThumbnailsToSubslide(no);
			}
		};
	};

	var isThumbnailVisible = function(slide){
		var slideThumbnail = getThumbnailForSlide(slide);
		var offset = $(slideThumbnail).offset();
		if((typeof offset == "undefined")||(offset===null)){
			//Transitory states...
			return true;
		}
		if(V.Slides.isSubslide(slide)){
			var offsetLeft = offset.left;
			return ((offsetLeft > 466) && (offsetLeft < 1119));
		} else {
			//Standard slide
			var offsetTop = offset.top;
			return ((offsetTop > 132) && (offsetTop < 667));
		}
	};

	return {
		init              			: init,
		redrawThumbnails  			: redrawThumbnails,
		drawSlidesetThumbnails  	: drawSlidesetThumbnails,
		selectThumbnail	  			: selectThumbnail,
		selectSubslideThumbnail		: selectSubslideThumbnail,
		moveThumbnailsToSlide		: moveThumbnailsToSlide,
		moveThumbnailsToSubslide	: moveThumbnailsToSubslide,
		getThumbnailURL				: getThumbnailURL,
		getDefaultThumbnailURL 		: getDefaultThumbnailURL,
		getThumbnailForSlide 		: getThumbnailForSlide,
		isThumbnailVisible			: isThumbnailVisible
	}

}) (VISH, jQuery);