VISH.Editor.Flashcard = (function(V,$,undefined){

	//Var to store the JSON of the inserted flashcards
	var myFlashcards;
	// myFlashcard = myFlashcards['flashcardIdInMyPresentation']

	var init = function(){
		V.Editor.Flashcard.Repository.init();
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

	var hasFlascards = function(){
		return $("section.slides > .flashcard_slide[type='flashcard']").length>0;
	}

	return {
		init 				 	: init,
		addFlashcard 			: addFlashcard,
		getFlashcard 			: getFlashcard,
		hasFlascards 			: hasFlascards
	};

}) (VISH, jQuery);