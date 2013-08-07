/*
 * Manage slide thumbnails
 */
VISH.Editor.Thumbnails = (function(V,$,undefined){
	
	var thumbnailsDivId = "slides_list";
	var slidesetThumbnailsDivId = "subslides_list";

	//Tmp vars
	var redrawThumbnailsCallback;
	var drawSlidesetThumbnailsCallback;
	
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

		var srcURL;

		switch($(s).attr('type')){
			case V.Constant.STANDARD:
				var template = $(s).attr('template');
				srcURL = V.ImagesPath + "templatesthumbs/"+ template + ".png";
				break;
			case V.Constant.FLASHCARD:
				var avatar = $(s).attr('avatar');
				if(avatar){
					srcURL = V.Utils.getSrcFromCSS($(s).attr('avatar'));
				} else {
					srcURL = V.ImagesPath + "templatesthumbs/flashcard_template.png";
				}
				break;
			case V.Constant.VTOUR:
				srcURL = V.ImagesPath + "templatesthumbs/tVTour.png";
				break;
			default:
				break;
		}

			if(srcURL){
				slideElements += 1;
				imagesArray.push($("<img id='slideThumbnail" + slideElements + "' class='image_barbutton' slideNumber='" + slideElements + "' action='goToSlide' src='" + srcURL + "' />"));
				imagesArrayTitles.push(slideElements);
			}

    	});

		var options = {};
		options.order = true;
		options.titleArray = imagesArrayTitles;
		options.callback = _onImagesLoaded;
		V.Utils.Loader.loadImagesOnContainer(imagesArray,thumbnailsDivId,options);
	};
	 

	var _onImagesLoaded = function(){
		//Add class to title elements and events
		$("#" + thumbnailsDivId).find("img.image_barbutton").each(function(index,img){
			//Add class to title
			var imgContainer = $(img).parent();
			$(imgContainer).addClass("wrapper_barbutton");
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
	};


    /*
     * SlideNumber can be also the slide element itself
     */
	var moveThumbnailsToSlide = function(slideNumber){
		var element = $("img.image_barbutton[slideNumber=" + slideNumber + "]");
		V.Editor.Scrollbar.goToElement(thumbnailsDivId,element);
	}
  


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

			var template = $(s).attr('template');
			var srcURL = V.ImagesPath + "templatesthumbs/"+ template + ".png";
			slideElements += 1;
			imagesArray.push($("<img id='subslideThumbnail" + slideElements + "' class='image_barbutton' slideNumber='" + slideElements + "' action='goToSlide' src='" + srcURL + "' />"));
			imagesArrayTitles.push(slideElements);
    	});

		var options = {};
		options.order = true;
		options.titleArray = imagesArrayTitles;
		options.callback = _onSlidesetThumbnailsImagesLoaded;
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
		V.Editor.Slideset.showSubslideWithNumber(subslideNumber);
	}

	return {
		init              		: init,
		redrawThumbnails  		: redrawThumbnails,
		selectThumbnail	  		: selectThumbnail,
		moveThumbnailsToSlide	: moveThumbnailsToSlide,
		drawSlidesetThumbnails  : drawSlidesetThumbnails
	};

}) (VISH, jQuery);