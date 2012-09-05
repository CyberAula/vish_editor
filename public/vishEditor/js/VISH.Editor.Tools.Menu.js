VISH.Editor.Tools.Menu = (function(V,$,undefined){

	var menuEventsLoaded = false;


	/**
	* Menu item classes:
	* menu_all : Always visible
	* menu_standard_presentation: 	Visible for standard presentations
	* menu_presentation: 			Visible for presentations
	* menu_flaschard: 				Visible for flashcards
	* menu_game: 					Visible for games
	*/

	var init = function(){

		var presentationType = VISH.Editor.getExcursionType();

		$("ul.menu_option_main").find("li").hide();
		$("ul.menu_option_main").find("a.menu_all").parent().show();

		switch(presentationType){
			case "presentation":
				$("ul.menu_option_main").find("a.menu_presentation").parent().show();

				if(V.Editor.isPresentationStandard()){
					$("ul.menu_option_main").find("a.menu_standard_presentation").parent().show();
				}

				break;
			case "flashcard":
				$("ul.menu_option_main").find("a.menu_flashcard").parent().show();
				break;
			case "game":
				$("ul.menu_option_main").find("a.menu_game").parent().show();
				break;
			case "quiz_simple":
				break;
			default:
				break;
		}

		//Check for single elements and death menus
		var menus = $("ul.menu_option_main").find("ul");

		$.each($(menus), function(index, menu) {
			var lis = $(menu).find("li");
			var visibleLis = 0;
			var lastVisibleLi = null;

			$.each($(lis), function(index, li) {
				if($(li).css("display")!="none"){
					visibleLis = visibleLis+1;
					lastVisibleLi = li;
				}
			});
			
			if(visibleLis==0){
				//No elements... hide li that contains ul.
				var liContainer = $(menu).parent();
				
				if($(liContainer)[0].tagName=="LI"){
					$(liContainer).hide();
				}
				
			} else if(visibleLis==1){
				//Add special class for single elements
				$(lastVisibleLi).find("a").addClass("menu_single_element");
			}

			visibleLis = 0;
		});

		if(!menuEventsLoaded){
			//Add listeners to menu buttons
			$.each($("#menu a.menu_action"), function(index, menuButton) {
				$(menuButton).on("click", function(event){
					event.preventDefault();
					if(typeof VISH.Editor.Tools.Menu[$(menuButton).attr("action")] == "function"){
						VISH.Editor.Tools.Menu[$(menuButton).attr("action")](this);
					}
				});
			});
			menuEventsLoaded = true;
		}

	}
  

	var settings = function(){
		V.Debugging.log("Settings called");

		$.fancybox(
			$("#excursiondetails").html(),
			{
				'autoDimensions'	: false,
				'width': 800,
				'height': 660,
				'scrolling': 'no',
				'showCloseButton'	: true,
				'padding' 			: 0,
				'onClosed'			: function(){
				}
			}
		);
	}

	var switchToFlashcard = function(){		
		V.Editor.Flashcard.switchToFlashcard();
	};

	var switchToPresentation = function(){

		var excursion = V.Editor.saveExcursion();
		V.Editor.setExcursion(excursion);

		V.Editor.setExcursionType("presentation");
		
		//hide slides
		V.Editor.Utils.showSlides();

		//show flashcard background, should be an image with help
		$("#flashcard-background").hide();
		
		V.Editor.Thumbnails.redrawThumbnails();


	};


	return {
		init							: init,
		settings						: settings,
		switchToFlashcard				: switchToFlashcard,
		switchToPresentation			: switchToPresentation
	};

}) (VISH, jQuery);