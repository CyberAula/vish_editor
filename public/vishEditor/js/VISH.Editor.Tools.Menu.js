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

		$("#menu").hide();

		if(!VISH.Status.getDevice().desktop){
			if(VISH.Status.getDevice().tablet){
				VISH.Editor.MenuTablet.init();
			} else {
				disableMenu();
				return;
			}
		}

		var presentationType = VISH.Editor.getPresentationType();

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

		$("#menu").show();

		_initSettings();
		_initPreview();
	}

	var disableMenu = function(){
		$("#menu").hide();
		$("#menu").attr("id","menuDisabled");
	}

	var enableMenu = function(){
		$("#menuDisabled").show();
		$("#menuDisabled").attr("id","menu");
	}


	/////////////////////
	/// SETTINGS
	///////////////////////

	var initializedSettings = false;

	var _initSettings = function(){

		if ((VISH.Configuration.getConfiguration()["presentationSettings"]) && (!VISH.Editor.hasInitialPresentation()) && !initializedSettings){
			$("a#edit_presentation_details").fancybox({
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
			initializedSettings = true;
		} else {
			$("a#edit_presentation_details").fancybox({
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
		$("a#edit_presentation_details").trigger('click');
	}


	var firstSettingsCall = true;

	var onSettings = function(){
		
		if(firstSettingsCall){
			$("a#edit_presentation_details").fancybox({
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
			var draftPresentation = VISH.Editor.getPresentation();
			if(draftPresentation && draftPresentation.avatar){
				VISH.Editor.AvatarPicker.onLoadPresentationDetails(draftPresentation.avatar);
			} else {
				VISH.Editor.AvatarPicker.onLoadPresentationDetails(null);
			}
		}
	}

	var _onInitialTagsReceived = function(data){
		var tagList = $(".tagBoxIntro .tagList");
		var draftPresentation = VISH.Editor.getPresentation();

		if ($(tagList).children().length == 0){
			if(!draftPresentation){
				// //Insert the two first tags. //DEPRECATED
				// $.each(data, function(index, tag) {
				// 	if(index==2){
				// 		return false; //break the bucle
				// 	}
				// 	$(tagList).append("<li>" + tag + "</li>")
				// });
			} else {	
				if(draftPresentation.tags){
					//Insert draftPresentation tags
					$.each(draftPresentation.tags, function(index, tag) {
						$(tagList).append("<li>" + tag + "</li>")
					});
				}
			}
			$(tagList).tagit({tagSource:data, sortable:true, maxLength:15, maxTags:6 , 
			watermarkAllowMessage: VISH.Editor.I18n.getTrans("i.AddTags"), watermarkDenyMessage: VISH.Editor.I18n.getTrans("i.limitReached")});
		}
	}


	/**
	 * function called when the user clicks on the save button
	 * in the initial presentation details fancybox to save
	 * the data in order to be stored at the end in the JSON file   
	 */
	var onSavePresentationDetailsButtonClicked = function(event){
		if($('#presentation_title').val().length < 1) {
			$('#presentation_details_error').slideDown("slow");
			$('#presentation_details_error').show();
			return false;
		}
		
		var draftPresentation = VISH.Editor.getPresentation();

		if(!draftPresentation){
			draftPresentation = {};
		}

		draftPresentation.title = $('#presentation_title').val();
		draftPresentation.description = $('#presentation_description').val();
		draftPresentation.avatar = $('#presentation_avatar').val();
		draftPresentation.tags = VISH.Utils.convertToTagsArray($("#tagindex").tagit("tags"));

		VISH.Editor.setPresentation(draftPresentation);

		$('#presentation_details_error').hide();
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
		} else if(VISH.Editor.getPresentationType() === "flashcard" && !VISH.Editor.Flashcard.hasPoiInBackground()){
			$.fancybox(
				$("#message3_form").html(),
				{
					'autoDimensions'	: false,
					'scrolling': 'no',
					'width'         	: 350,
					'height'        	: 250,
					'showCloseButton'	: false,
					'padding' 			: 5		
				}
			);
		} else if(VISH.Editor.getPresentationType() === "flashcard" && !VISH.Editor.Flashcard.hasChangedBackground()){
			$.fancybox(
				$("#message4_form").html(),
				{
					'autoDimensions'	: false,
					'scrolling': 'no',
					'width'         	: 350,
					'height'        	: 250,
					'showCloseButton'	: false,
					'padding' 			: 5		
				}
			);

		} else {  

			switch(VISH.Configuration.getConfiguration()["mode"]){
				case VISH.Constant.NOSERVER:
					$("a[save-option-id='save']").hide();
					break;
				case VISH.Constant.VISH:
					if(VISH.Editor.isPresentationDraft()){
						$("a[save-option-id='save']").hide();
					} else {
						$("a[save-option-id='draft']").hide();
						$("a[save-option-id='publish']").hide();
					}
					break;
				case VISH.Constant.STANDALONE:
					$("a[save-option-id='publish']").hide();
					$("a[save-option-id='draft']").hide();
					break;
			}

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
						var response = $("#save_answer").val();
						if(response !=="cancel"){
							$("#save_answer").val("cancel");	
							var presentation = VISH.Editor.savePresentation();	
							VISH.Editor.afterSavePresentation(presentation,response);			
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
			'onStart'			: function(){
				VISH.Editor.Preview.prepare(V.Slides.getCurrentSlideNumber());
			},
			'onClosed'			: function() {
	    		V.Editor.Preview.setForcePresentation(false);
			}
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
		if(V.Slides.getSlides().length === 0){
			$.fancybox(
				$("#message5_form").html(),
				{
					'autoDimensions'	: false,
					'scrolling': 'no',
					'width'         	: 450,
					'height'        	: 220,
					'showCloseButton'	: false,
					'padding' 			: 5		
				}
			);
		}
		else{
			V.Editor.Flashcard.switchToFlashcard();
		}
	};

	var switchToPresentation = function(){
		var presentation = V.Editor.savePresentation();
		V.Editor.setPresentation(presentation);

		V.Editor.setPresentationType("presentation");
		
		//show slides
		V.Editor.Utils.showSlides();

		//show flashcard background, should be an image with help
		$("#flashcard-background").hide();
		
		V.Editor.Thumbnails.redrawThumbnails();
		VISH.Editor.Tools.init();
	};




	return {
		init							: init,
		disableMenu 					: disableMenu ,
		enableMenu 						: enableMenu,
		displaySettings					: displaySettings,
		onSettings						: onSettings,
		onSavePresentationDetailsButtonClicked	: onSavePresentationDetailsButtonClicked,
		onSaveButtonClicked             : onSaveButtonClicked,
		preview 						: preview,
		help 							: help,
		switchToFlashcard				: switchToFlashcard,
		switchToPresentation			: switchToPresentation
	};

}) (VISH, jQuery);