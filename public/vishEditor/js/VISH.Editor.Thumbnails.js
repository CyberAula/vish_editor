/*
 * Manage slide thumbnails
 */
VISH.Editor.Thumbnails = (function(V,$,undefined){
	
	var thumbnailsDivId = "slides_list";

	//Tmp var
	var redrawThumbnailsCallback;
	
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
          switch($(s).attr('type')){
			case undefined:
			case V.Constant.STANDARD:
					var template = $(s).attr('template');
					slideElements += 1;
					imagesArray.push($("<img id='slideThumbnail" + slideElements + "' class='image_barbutton' slideNumber='" + slideElements + "' action='goToSlide' src='" + V.ImagesPath + "templatesthumbs/"+ template + ".png' />"));
					imagesArrayTitles.push(slideElements);
				break;
			case V.Constant.FLASHCARD:
					slideElements += 1;
					imagesArray.push($("<img id='slideThumbnail" + slideElements + "' class='image_barbutton' slideNumber='" + slideElements + "' action='goToSlide' src='" + V.Utils.getSrcFromCSS($(s).attr('avatar'))+ "' />"));
					imagesArrayTitles.push(slideElements);
				break;
			case V.Constant.VTOUR:
					slideElements += 1;
					imagesArray.push($("<img id='slideThumbnail" + slideElements + "' class='image_barbutton' slideNumber='" + slideElements + "' action='goToSlide' src='" + V.ImagesPath + "templatesthumbs/tVTour.png' />"));
					imagesArrayTitles.push(slideElements);
				break;
			default:
				break;
		  }          
    	});
		
		//Add plus button
		imagesArray.push($("<img class='image_barbutton add_slide_button' action='plus' id='addslidebutton' src='" + V.ImagesPath + "templatesthumbs/add_slide.png' />"));
		slideElements += 1;

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
			case "plus":
				$("#addSlideFancybox").trigger('click');
				break;
			case "goToSlide":
				V.Slides.goToSlide($(event.target).attr("slideNumber"));
				break;
			default:
			  break;
		}
	}

	/**
	* Function to select the thumbnail
	*/
	var selectThumbnail = function(no){
		$("img.image_barbutton").removeClass("selectedSlideThumbnail");
		$("img.image_barbutton[slideNumber=" + no + "]").addClass("selectedSlideThumbnail");
	};


    /*
     * SlideNumber can be also the slide element itself
     */
	var moveThumbnailsToSlide = function(slideNumber){
		var element = $("img.image_barbutton[slideNumber=" + slideNumber + "]");
		V.Editor.Scrollbar.goToElement(thumbnailsDivId,element);
	}
  
	return {
		init              		: init,
		redrawThumbnails  		: redrawThumbnails,
		selectThumbnail	  		: selectThumbnail,
		moveThumbnailsToSlide	: moveThumbnailsToSlide
	};

}) (VISH, jQuery);