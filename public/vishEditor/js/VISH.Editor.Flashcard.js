VISH.Editor.Flashcard = (function(V,$,undefined){

	var init = function(){
		$(document).on("click", "#flashcard_button", _onFlashcardButtonClicked );
	};


	var _onFlashcardButtonClicked = function(){
		$("#flashcard_button").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'scrolling': 'no',
			'height': 600,
			'padding' : 0,
			"onStart"  : function(data) {
				V.Editor.Utils.loadTab('tab_pic_from_url');
			}
		});
	};

	return {
		init 				: init
	};

}) (VISH, jQuery);