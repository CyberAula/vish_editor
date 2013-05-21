VISH.Editor.Flashcard = (function(V,$,undefined){

	//Var to store the JSON of the inserted flashcards
	var myFlashcards;
	// myFlashcard = myFlashcards['flashcardIdInMyPresentation']

	var init = function(){
		V.Editor.Flashcard.Creator.init();
		myFlashcards = new Array();
	};

	var addFlashcard = function(fc){
		if(typeof myFlashcards !== "undefined"){
			myFlashcards[fc.id] = fc;
		}
	}

	var getFlashcard = function(id){
		if(typeof myFlashcards !== "undefined"){
			return myFlashcards[id];
		}
	}

	var getFlashcards = function(){
		return myFlashcards;
	}

	var hasFlascards = function(){
		return $("section.slides > .flashcard_slide[type='flashcard']").length>0;
	}

	var getSlideset = function(id){
		return getFlashcard(id);
	}

	var preCopyActions = function(fcJSON,fcDOM){
		//Add the points of interest with their click events to show the slides
		addFlashcard(fcJSON);
		for(index in fcJSON.pois){
			var poi = fcJSON.pois[index];
			V.Flashcard.addArrow(fcJSON.id, poi, true);
		}
		V.Editor.Events.bindEventsForFlashcard(fcJSON);
	}

	var postCopyActions = function(fcJSON,fcDOM){
		//No code required
	}

	return {
		init 				 	: init,
		addFlashcard 			: addFlashcard,
		getFlashcard 			: getFlashcard,
		getFlashcards			: getFlashcards,
		hasFlascards 			: hasFlascards,
		getSlideset				: getSlideset,
		preCopyActions			: preCopyActions,
		postCopyActions			: postCopyActions
	};

}) (VISH, jQuery);