VISH.Editor.Slides = (function(V,$,undefined){

	var showSlides = function(){
		$(".slides > article").removeClass("temp_hidden");
	};

	var hideSlides = function(){
		$(".slides > article").addClass("temp_hidden");
	};

   /**
	* Function to dispatch the event that redraws the slides
	*/
	var redrawSlides = function(){
		$(document).trigger('OURDOMContentLoaded');
	};


	/**
	 * function to know if the slides have the focus or not
	 * Use to disable actions (like keyboard shortcuts) when the slide is not focused 
	 * @return false if other element has the focus
	 */
	var isSlideFocused = function() {
		//Wysiwyg is focused.
		if($(".wysiwygInstance").is(":focus")){
			return false;
		}
		
		//Fancybox is showing
		if($("#fancybox-content").is(":visible")){
			return false;
		}

		//Generic input is focused
		if($("input").is(":focus")){
			return false;
		}

		//An area is focused
		if(V.Editor && V.Editor.getCurrentArea()!==null){
			return false;
		}

		return true;
	};


	/*
	 *	Move slide_to_move after or before reference_slide.
	 *  Movement param posible values: "after", "before"
	 */
	var moveSlideTo = function(slide_to_move, reference_slide, movement){

		if((typeof slide_to_move === "undefined")||(typeof reference_slide === "undefined")){
			return;
		}

		if(typeof slide_to_move.length !== undefined){
			slide_to_move = $(slide_to_move)[0];
			if(typeof slide_to_move === "undefined"){
				return;
			}
		}

		if(typeof reference_slide.length !== undefined){
			reference_slide = $(reference_slide)[0];
			if(typeof reference_slide === "undefined"){
				return;
			}
		}

		if((slide_to_move.tagName!="ARTICLE")||(reference_slide.tagName!="ARTICLE")||(slide_to_move==reference_slide)){
			return;
		}

		var article_to_move = slide_to_move;
		var article_reference = reference_slide;

		var moving_current_slide = false;
		if(V.Slides.getCurrentSlide() === article_to_move){
			moving_current_slide = true;
		}

		var textAreas = copyTextAreasOfSlide(article_to_move);
		$(article_to_move).remove();
		if(movement=="after"){
			$(article_reference).after(article_to_move);
		} else if(movement=="before") {
			$(article_reference).before(article_to_move);
		} else {
			V.Debugging.log("V.Slides: Error. Movement not defined... !");
			return;
		}

		$(article_to_move).addClass("temp_shown");

		//Refresh Draggable Objects
		V.Editor.Utils.refreshDraggables(article_to_move);

		//Reload text areas
		_cleanTextAreas(article_to_move);
		_loadTextAreasOfSlide(article_to_move,textAreas);

		$(article_to_move).removeClass("temp_shown");

		//Update slideEls
		V.Slides.setSlides(document.querySelectorAll('section.slides > article'));

		if(moving_current_slide){
			//Update currentSlide
			V.Slides.setCurrentSlideIndex(V.Slides.getNumberOfSlide(article_to_move));
		}

		//Update slides classes next and past.
		//Current slide needs to be stablished before this call.
		V.Slides.updateSlideEls();
		
	}

	var copySlideWithNumber = function(slideNumber,options){
		var slide = V.Slides.getSlideWithNumber(slideNumber);
		if(slide===null){
			return;
		}
		var newSlide = $(slide).clone();
		copySlide(newSlide,options);
	}

	var copySlide = function(slideToCopy,options){
		slideToCopy = _cleanTextAreas(slideToCopy);
		slideToCopy = V.Editor.Utils.replaceIdsForSlide(slideToCopy);
		var newId = $(slideToCopy).attr("id");

		if(typeof slideToCopy == "undefined"){
			return;
		}

		var slideToCopyType = V.Slides.getSlideType(slideToCopy);

		/////////////////
		//Pre-copy actions
		/////////////////

		var slidesetModule = V.Editor.Slideset.getModule(slideToCopyType);
		if((typeof slidesetModule != "undefined")&&(slidesetModule!=null)){
			var slidesetModule = V.Editor.Slideset.getModule(slideToCopyType);
			var slidesetId = $(slideToCopy).attr("id");

			if(!options.JSON){
				//We need the JSON to copy a flashcard!
				return;
			}

			var slideToCopyJSON = V.Editor.Utils.replaceIdsForSlideJSON(options.JSON,slidesetId);
			slidesetModule.preCopyActions(slideToCopyJSON,slideToCopy);
		}

		/////////////////
		//Copy actions
		/////////////////

		var currentSlide = V.Slides.getCurrentSlide();
		if(currentSlide){
			$(currentSlide).after(slideToCopy);
		} else {
			$("section#slides_panel").append(slideToCopy);
		}
		

		/////////////////
		//Post-copy actions
		/////////////////
		var slideCopied = $("#"+newId);

		//Restore draggables
		V.Editor.Utils.refreshDraggables(slideCopied);

		//Restore text areas
		if(slideToCopyType === V.Constant.STANDARD){
			if(options.textAreas){
				_loadTextAreasOfSlide(slideCopied,options.textAreas);
			}
		}

		if((typeof slidesetModule != "undefined")&&(slidesetModule!=null)){
			slidesetModule.postCopyActions(slideToCopyJSON,slideCopied);
		}
		
		//Update slideEls
		V.Slides.setSlides(document.querySelectorAll('section.slides > article'));

		//Update slides classes next and past.
		//Current slide needs to be stablished before this call.
		V.Slides.updateSlideEls();


		//Redraw thumbnails
		V.Editor.Thumbnails.redrawThumbnails(function(){
			if(currentSlide){
				V.Slides.goToSlide(V.Slides.getCurrentSlideNumber()+1);
				V.Editor.Thumbnails.moveThumbnailsToSlide(V.Slides.getCurrentSlideNumber());
			} else {
				V.Slides.goToSlide(1);
				V.Editor.Thumbnails.moveThumbnailsToSlide(1);
			}
		});
	}

	var _cleanTextAreas = function(slide){
		$(slide).find("div[type='text'],div.wysiwygTextArea").each(function(index,textArea){
			$(textArea).html("");
		});
		return slide;
	}

	var copyTextAreasOfSlide = function(slide){
		var textAreas = {};

		//Copy text areas
		$(slide).find("div[type='text']").each(function(index,textArea){
			var areaId = $(textArea).attr("areaid");
			var ckEditor = V.Editor.Text.getCKEditorFromZone(textArea);
			if((areaId)&&(ckEditor!==null)){
				textAreas[areaId] = ckEditor.getData();
			}
		});

		//Copy quiz areas
		$(slide).find("div[type='quiz']").each(function(index,quizArea){
			var areaId = $(quizArea).attr("areaid");
			textAreas[areaId] = [];
			$(quizArea).find("div.wysiwygTextArea").each(function(index,textArea){
				var ckEditor = V.Editor.Text.getCKEditorFromTextArea(textArea);
				if((areaId)&&(ckEditor!==null)){
					textAreas[areaId].push(ckEditor.getData());
				}
			});
		});

		return textAreas;
	}

	var _loadTextAreasOfSlide = function(slide,textAreas){
		$(slide).find("div[type='text']").each(function(index,textArea){
			var areaId = $(textArea).attr("areaid");
			if((areaId)&&(textAreas[areaId])){
				var data = textAreas[areaId];
				V.Editor.Text.launchTextEditor({}, $(textArea), data);
			}
		});

		$(slide).find("div[type='quiz']").each(function(index,quizArea){
			var areaId = $(quizArea).attr("areaid");
			if((areaId)&&(textAreas[areaId])){
				var data = textAreas[areaId];
				$(quizArea).find("div.wysiwygTextArea").each(function(index,textArea){
					var parent = $(textArea).parent();
					$(parent).html("");
					V.Editor.Text.launchTextEditor({}, $(parent), data[index], {autogrow: true});
				});
			}
		});
	}

	var addSlide = function(slide){
		$('.slides').append(slide);
	};

	var removeSlide = function(slideNumber){
		var slide = V.Slides.getSlideWithNumber(slideNumber);
		if(slide===null){
			return;
		}
		var standardSlide = (slide.type===V.Constant.STANDARD);
		var removing_current_slide = false;
		if(V.Slides.getCurrentSlide() === slide){
			removing_current_slide = true;
		}

		$(slide).remove();
		if(removing_current_slide){
			if((V.Slides.getCurrentSlideNumber()===1)&&(V.Slides.getSlidesQuantity()>1)){
				V.Slides.setCurrentSlideNumber(1);
			} else {
				V.Slides.setCurrentSlideNumber(V.Slides.getCurrentSlideNumber()-1);
			}
		}
		redrawSlides();					
		V.Editor.Thumbnails.redrawThumbnails();
		if(!standardSlide){
			V.Editor.Tools.Menu.init();
		}
	};

	var addTooltipsToAddedSlide = function(){
		var last_slide = $(".slides article").filter(":last");
		var tooltip = "<span class='zone_tooltip'>"+V.Editor.I18n.getTrans('i.ZoneTooltip')+"</span>";
		var zones = last_slide.find(".editable");
		for (var i = 0; i < zones.length; i++) {
			$(last_slide.find(".editable")[i]).append(tooltip);
		};
	};

	return {
		showSlides				: showSlides,
		hideSlides				: hideSlides,
		redrawSlides	    	: redrawSlides,
		isSlideFocused			: isSlideFocused,
		moveSlideTo				: moveSlideTo,
		copySlide				: copySlide,
		copySlideWithNumber		: copySlideWithNumber,
		addSlide 				: addSlide,
		removeSlide				: removeSlide,
		addTooltipsToAddedSlide : addTooltipsToAddedSlide,
		copyTextAreasOfSlide	: copyTextAreasOfSlide
	};

}) (VISH, jQuery);