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
		_initSettings();
		_initPreview();
	}


	/////////////////////
	/// SETTINGS
	///////////////////////

	var initializedSettings = false;

	var _initSettings = function(){

		if ((VISH.Configuration.getConfiguration()["presentationSettings"])&&(!VISH.Editor.hasInitialExcursion())){
			$("a#edit_excursion_details").fancybox({
				'autoDimensions' : false,
				'scrolling': 'no',
				'width': 800,
				'height': 660,
				'padding': 0,
				'hideOnOverlayClick': false,
				'hideOnContentClick': false,
				'showCloseButton': false
			});
			displaySettings();
		} else {
			$("a#edit_excursion_details").fancybox({
				'autoDimensions' : false,
				'scrolling': 'no',
				'width': 800,
				'height': 660,
				'padding': 0,
				'hideOnOverlayClick': false,
				'hideOnContentClick': false,
				'showCloseButton': true
			});
		}
	}


	var displaySettings = function(){
		$("a#edit_excursion_details").trigger('click');
	}


	var firstSettingsCall = true;

	var onSettings = function(){
		
		if(firstSettingsCall){
			$("a#edit_excursion_details").fancybox({
				'autoDimensions' : false,
				'scrolling': 'no',
				'width': 800,
				'height': 660,
				'padding': 0,
				'hideOnOverlayClick': false,
				'hideOnContentClick': false,
				'showCloseButton': true
			});
		}

		if((VISH.Configuration.getConfiguration()["presentationTags"])&&(firstSettingsCall)){
			VISH.Editor.API.requestTags(_onInitialTagsReceived);
			var draftExcursion = VISH.Editor.getExcursion();
			if(draftExcursion && draftExcursion.avatar){
				VISH.Editor.AvatarPicker.onLoadExcursionDetails(draftExcursion.avatar);
			} else {
				VISH.Editor.AvatarPicker.onLoadExcursionDetails(null);
			}
		}
	}

	var _onInitialTagsReceived = function(data){
		var tagList = $(".tagBoxIntro .tagList");
		var draftExcursion = VISH.Editor.getExcursion();

		if ($(tagList).children().length == 0){
			if(!draftExcursion){
				//Insert the two first tags.
				$.each(data, function(index, tag) {
					if(index==2){
						return false; //break the bucle
					}
					$(tagList).append("<li>" + tag + "</li>")
				});
			} else {	
				if(draftExcursion.tags){
					//Insert draftExcursion tags
					$.each(draftExcursion.tags, function(index, tag) {
						$(tagList).append("<li>" + tag + "</li>")
					});
				}
			}
			$(tagList).tagit({tagSource:data, sortable:true, maxLength:15, maxTags:6 , 
			watermarkAllowMessage: "Add tags", watermarkDenyMessage: "limit reached" });
		}
	}


	/**
	 * function called when the user clicks on the save button
	 * in the initial excursion details fancybox to save
	 * the data in order to be stored at the end in the JSON file   
	 */
	var onSaveExcursionDetailsButtonClicked = function(event){
		if($('#excursion_title').val().length < 1) {
			$('#excursion_details_error').slideDown("slow");
			$('#excursion_details_error').show();
			return false;
		}
		
		var draftExcursion = VISH.Editor.getExcursion();
		
		if(!draftExcursion){
			draftExcursion = {};
		}

		draftExcursion.title = $('#excursion_title').val();
		draftExcursion.description = $('#excursion_description').val();
		draftExcursion.avatar = $('#excursion_avatar').val();
		draftExcursion.tags = VISH.Utils.convertToTagsArray($("#tagindex").tagit("tags"));

		VISH.Editor.setExcursion(draftExcursion);

		$('#excursion_details_error').hide();
		$.fancybox.close();
	};


	//////////////////
	/// SAVE
	/////////////////

	/**
	* function called when user clicks on save
	* Generates the json for the current slides
	* covers the section element and every article inside
	* finally calls SlideManager with the generated json
	*/
	var onSaveButtonClicked = function(){
		if(VISH.Slides.getSlides().length === 0){
			$.fancybox(
				$("#message1_form").html(),
				{
					'autoDimensions'	: false,
					'scrolling': 'no',
					'width'         	: 350,
					'height'        	: 200,
					'showCloseButton'	: false,
					'padding' 			: 5		
				}
			);
		} else {    
			$.fancybox(
				$("#save_form").html(),
				{
					'autoDimensions'	: false,
					'width'         	: 350,
					'scrolling': 'no',
					'height'        	: 150,
					'showCloseButton'	: false,
					'padding' 			: 0,
					'onClosed'			: function(){
						//if user has answered "yes"
						if($("#save_answer").val() ==="true"){
							$("#save_answer").val("false");	
							var excursion = VISH.Editor.saveExcursion();	
							VISH.Editor.afterSaveExcursion(excursion);			
						}	else {
							return false;
						}
					}
				}
			);
		  }
	};


	/////////////////////
	/// PREVIEW
	///////////////////////

	var preview = function(){
		$("img#preview_circle").trigger('click');
	}

	var _initPreview = function(){
		$("img#preview_circle").fancybox({
			'width'				: '8',
			'height'			: '6',
			'autoScale'     	: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'type'				: 'iframe',
			'onStart'			: VISH.Editor.Preview.prepare
		});	
	}


	/////////////////////
	/// HELP
	///////////////////////

	var help = function(){
		$("#help_right").trigger('click');
	}


	/////////////////////
	/// CONVERSION
	///////////////////////

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
		displaySettings					: displaySettings,
		onSettings						: onSettings,
		onSaveExcursionDetailsButtonClicked	: onSaveExcursionDetailsButtonClicked,
		onSaveButtonClicked             : onSaveButtonClicked,
		preview 						: preview,
		help 							: help,
		switchToFlashcard				: switchToFlashcard,
		switchToPresentation			: switchToPresentation
	};

}) (VISH, jQuery);