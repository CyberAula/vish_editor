VISH.Flashcard = (function(V,$,undefined){

	var initialized = false;

	var flashcards;
	// myFlashcard = flashcards['flashcardId'] has:
	// myFlashcard.arrows = [arrow1,arrow2,...,arrow3];
	// myFlashcard.timer = arrowTimer;
	//Each arrow has id, position and a associated slide id

	//Direct access to pois data.
	var pois;

	//Arrow rendering information
	//Arrow frames per second
	var FPS = 20;

	var init = function(){
		if(!initialized){
			initialized = true;
			flashcards = {};
			pois = {};
			_loadEvents();
		}
	};

	var _loadEvents = function(){
		var device = V.Status.getDevice();
		var isIphoneAndSafari = ((device.iPhone)&&(device.browser.name===V.Constant.SAFARI));
		if(isIphoneAndSafari){
			//Fix for Iphone With Safari
			V.EventsNotifier.registerCallback(V.Constant.Event.Touchable.onSimpleClick, function(params){
				var event = params.event;
				var target = event.target;
				if($(target).hasClass("fc_poi")){
					event.preventDefault();
					var poiId = target.id;
					_onFlashcardPoiSelected(poiId);
				}
			});	
		} else {
			$(document).on("click", '.fc_poi', _onFlashcardPoiClicked);
		}
	};

	var draw = function(flashcardJSON){
		//Add the background and pois
		$("#"+ flashcardJSON.id).css("background-image", flashcardJSON.background);
		
		for(index in flashcardJSON.pois){
			var poi = flashcardJSON.pois[index];
			_addArrow(flashcardJSON.id, poi);
		}
	};

	var _addArrow = function(fcId, poi){
		if((!poi)||(!poi.x)||(!poi.y)||(poi.x > 100)||(poi.y > 100)){
			//Corrupted poi
			return;
		}

		var flashcard_div = $("#"+ fcId);
		var poiId = V.Utils.getId(fcId + "_poi");
		var div_to_add = "<div class='fc_poi' id='" + poiId + "' style='position:absolute;left:"+poi.x+"%;top:"+poi.y+"%'></div>";
		flashcard_div.append(div_to_add);

		if(typeof flashcards[fcId] === "undefined"){
			flashcards[fcId] = new Object();
			flashcards[fcId].arrows = [];
		}

		//Add arrow
		var arrow = new Object();
		arrow.id = poiId;
		arrow.slide_id = poi.slide_id;
		arrow.x = poi.x;
		arrow.y = poi.y;
		
		flashcards[fcId].arrows.push(arrow);
		pois[arrow.id] = arrow;
	};

	var onEnterSlideset = function(slideset){
		_startAnimation($(slideset).attr("id"));
	};

	var onLeaveSlideset = function(slideset){
		_stopAnimation($(slideset).attr("id"));
	};


	/* Arrow animations */

	var _startAnimation = function(slideId){
		if((typeof flashcards !== "undefined")&&(typeof flashcards[slideId] !== "undefined")&&(typeof flashcards[slideId].timer == "undefined")){
			flashcards[slideId].timer = setInterval( function() { _animateArrows(slideId); }, 1000/FPS );      
		}
	};

	var _animateArrows = function(slideId){
		if((!slideId)||(typeof flashcards[slideId] == "undefined")){
			return;
		}

		var cacheBackgroundPosX = undefined;

		$(flashcards[slideId].arrows).each(function(index,value){
			var arrowDOM = $("#"+value.id);

			if(typeof cacheBackgroundPosX == "undefined"){
				var backgroundPosX = $(arrowDOM).cssNumber("background-position-x")+5;
				//Fix for browsers that not support background-position-x
				if(backgroundPosX==5){
					backgroundPosX = V.Utils.getBackgroundPosition(arrowDOM).x+5;
				}

				//backgroundPosX should be a number between 0 and 95
				if(backgroundPosX>95){
					backgroundPosX = 0; //bucle
				}
				
				cacheBackgroundPosX = backgroundPosX;
			}

			$(arrowDOM).css("background-position",cacheBackgroundPosX + "%" + " center");
		});
	};

	var _stopAnimation = function(slideId){
		if((typeof flashcards !== "undefined")&&(typeof flashcards[slideId] !== "undefined")&&(typeof flashcards[slideId].timer !== "undefined")){
			clearTimeout(flashcards[slideId].timer);
			flashcards[slideId].timer = undefined;
		}
	};

	/*
	 * Events
	 */
	var _onFlashcardPoiClicked = function(event){
		_onFlashcardPoiSelected($(event.target).attr("id"));
	};

	var _onFlashcardPoiSelected = function(poiId){
		if((typeof pois != "undefined")&&(typeof pois[poiId] != "undefined")){
			var poiJSON = pois[poiId];
			if(typeof poiJSON != "undefined"){
				V.Slides.openSubslide(poiJSON.slide_id,true);
			}
		}
	};

	var afterSetupSize = function(increase,increaseW){
		var fcArrowIncrease;
		if(increase >= 1){
			fcArrowIncrease = V.ViewerAdapter.getPonderatedIncrease(increase,0.1);
		} else {
			fcArrowIncrease = V.ViewerAdapter.getPonderatedIncrease(increase,0.8);
		}

		//Update arrows
		//Use geometric formulas to properly allocate the arrows after setup size
		//This way, arrows always point to the same spot
		for(var fckey in flashcards) {
			var fc = flashcards[fckey];
			var arrows = fc.arrows;
			$(arrows).each(function(index,arrow){
				var orgX = arrow.x * 8;
				var newWidth = 50*fcArrowIncrease;
				var newLeft = increase * orgX + 25 *(increase - fcArrowIncrease);

				var orgY = arrow.y * 6;
				var newHeight = 40*fcArrowIncrease;
				var newTop = increase * orgY + 40 * 0.8 * (increase - fcArrowIncrease);

				var arrowDom = $("#"+arrow.id);
				$(arrowDom).css("left",newLeft+"px");
				$(arrowDom).width(newWidth+"px");
				$(arrowDom).css("top",newTop+"px");
				$(arrowDom).height(newHeight+"px");
			});
		}
	};

	return {
		init			: init,
		draw			: draw,
		onEnterSlideset	: onEnterSlideset,
		onLeaveSlideset	: onLeaveSlideset,
		afterSetupSize	: afterSetupSize
	};

}) (VISH, jQuery);

