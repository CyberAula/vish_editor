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

	return {
		init 				 	: init,
		addFlashcard 			: addFlashcard,
		getFlashcard 			: getFlashcard,
		getFlashcards			: getFlashcards,
		hasFlascards 			: hasFlascards
	};

}) (VISH, jQuery);