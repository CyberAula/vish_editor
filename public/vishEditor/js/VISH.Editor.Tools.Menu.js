VISH.Editor.Tools.Menu = (function(V,$,undefined){

	var _initialized = false;
	var _hoverMenu = false;

	/*
	 * Init singleton
	 * Perform actions that must be executed only once
	 */
	var _init = function(){
		if(!_initialized){
			if(!V.Status.getDevice().desktop){
				if(V.Status.getDevice().tablet){
					V.Editor.MenuTablet.init();
				} else {
					disableMenu();
					return;
				}
			} else {
				_hoverMenu = true;
			}

			//Add listeners to menu buttons
			$.each($("#menu a.menu_action"), function(index, menuButton) {
				$(menuButton).on("click", function(event){
					event.preventDefault();
					if($(menuButton).parent().hasClass("menu_item_disabled")){
						//Disabled button
						return;
					}
					if(typeof V.Editor.Tools.Menu[$(menuButton).attr("action")] == "function"){
						V.Editor.Tools.Menu[$(menuButton).attr("action")](this);
						_hideMenuAfterAction();
					}
				});
			});
			_initSettings();

			_initialized = true;
		}
	}


   /**
    * Called every time that menu needs to be updated
    *
	* Menu item classes:
	* menu_all : Always visible
	* menu_standard_presentation: 	Visible for standard presentations
	* menu_presentation: 			Visible for presentations
	* menu_flaschard: 				Visible for flashcards
	* menu_game: 					Visible for games
	*/
	var init = function(){
		_init();

		$("#menu").hide();

		var presentationType = V.Editor.getPresentationType();

		_disableMenuItem($("ul.menu_option_main").find("li"));
		_enableMenuItem($("ul.menu_option_main").find("a.menu_all").parent());

		switch(presentationType){
			case V.Constant.PRESENTATION:
				_enableMenuItem($("ul.menu_option_main").find("a.menu_presentation").parent());
				if(V.Editor.isPresentationStandard()){
					_enableMenuItem($("ul.menu_option_main").find("a.menu_standard_presentation").parent());
				}
				break;
			case V.Constant.FLASHCARD:
				_enableMenuItem($("ul.menu_option_main").find("a.menu_flashcard").parent());
				break;
			case V.Constant.GAME:
				_enableMenuItem($("ul.menu_option_main").find("a.menu_game").parent());
				break;
			case V.Constant.VTOUR:
				_enableMenuItem($("ul.menu_option_main").find("a.menu_vtour").parent());
				break;	
			case V.Constant.QUIZ_SIMPLE:
				break;
			default:
				break;
		}

		/////////////////////////////////////////////
		// Check for single elements and death menus (For flexible-dynamic menus)
		//////////////////////////////////////////////

		// var menus = $("ul.menu_option_main").find("ul");

		// $.each($(menus), function(index, menu) {
		// 	var lis = $(menu).find("li");
		// 	var visibleLis = 0;
		// 	var lastVisibleLi = null;

		// 	$.each($(lis), function(index, li) {
		// 		if($(li).css("display")!="none"){
		// 			visibleLis = visibleLis+1;
		// 			lastVisibleLi = li;
		// 		}
		// 	});
			
		// 	if(visibleLis==0){
		// 		//No elements... hide li that contains ul.
		// 		var liContainer = $(menu).parent();
				
		// 		if($(liContainer)[0].tagName=="LI"){
		// 			_disableMenuItem($(liContainer));
		// 		}
				
		// 	} else if(visibleLis==1){
		// 		//Add special class for single elements
		// 		$(lastVisibleLi).find("a").addClass("menu_single_element");
		// 	}

		// 	visibleLis = 0;
		// });

		$("#menu").show();
	}

	var _enableMenuItem = function(items){
		// $(items).show();
		$(items).removeClass("menu_item_disabled").addClass("menu_item_enabled");
	}

	var _disableMenuItem = function(items){
		// $(items).hide();
		$(items).removeClass("menu_item_enabled").addClass("menu_item_disabled");
	}

	var updateMenuAfterAddSlide = function(slideType){
		switch(slideType){
			case V.Constant.STANDARD:
				break;
			case V.Constant.FLASHCARD:
			case V.Constant.VTOUR:
				return init();
				break;
			default:
				break;
		}
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

	var _initSettings = function(){
		if ((V.Configuration.getConfiguration()["presentationSettings"]) && (!V.Editor.hasInitialPresentation())){
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

		if((V.Configuration.getConfiguration()["presentationTags"])&&(firstSettingsCall)){
			V.Editor.API.requestTags(_onInitialTagsReceived);
			var draftPresentation = V.Editor.getPresentation();
			if(draftPresentation && draftPresentation.avatar){
				V.Editor.AvatarPicker.onLoadPresentationDetails(draftPresentation.avatar);
			} else {
				V.Editor.AvatarPicker.onLoadPresentationDetails(null);
			}
		}
	}

	var _onInitialTagsReceived = function(data){
		var tagList = $(".tagBoxIntro .tagList");
		var draftPresentation = V.Editor.getPresentation();

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
			watermarkAllowMessage: V.Editor.I18n.getTrans("i.AddTags"), watermarkDenyMessage: V.Editor.I18n.getTrans("i.limitReached")});
		}
	}


	/**
	 * function called when the user clicks on the save button
	 * in the initial presentation details fancybox to save
	 * the data in order to be stored at the end in the JSON file   
	 */
	var onSavePresentationDetailsButtonClicked = function(event){
		event.preventDefault();
		
		if($('#presentation_title').val().length < 1) {
			$('#presentation_details_error').slideDown("slow");
			$('#presentation_details_error').show();
			return false;
		}
		
		var draftPresentation = V.Editor.getPresentation();

		if(!draftPresentation){
			draftPresentation = {};
		}

		draftPresentation.title = $('#presentation_title').val();
		draftPresentation.description = $('#presentation_description').val();
		draftPresentation.avatar = $('#presentation_avatar').val();
		draftPresentation.tags = V.Editor.Utils.convertToTagsArray($("#tagindex").tagit("tags"));

		//now the pedagogical fields if any
		draftPresentation.age_range = $("#age_range").val();
		draftPresentation.subject = $("#subject_tag").val();
		draftPresentation.language = $("#language_tag").val();
		draftPresentation.educational_objectives = $("#educational_objectives_tag").val();
		draftPresentation.adquired_competencies = $("#acquired_competencies_tag").val();

		V.Editor.setPresentation(draftPresentation);

		$('#presentation_details_error').hide();
		$.fancybox.close();
	};


	/**
	 * function called when the user clicks on the pedagogical options button
	 */
	 var onPedagogicalButtonClicked = function(event){
	 	event.preventDefault();
	 	$("#presentation_details_fields").slideUp();
	 	$("#pedagogical_options_fields").slideDown();

	 };

	 /**
	 * function called when the user clicks on the done button in the pedagogical options panel
	 */
	 var onDonePedagogicalButtonClicked = function(event){
	 	event.preventDefault();
	 	$("#pedagogical_options_fields").slideUp();
	 	$("#presentation_details_fields").slideDown();
	 	
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
		var slidesetModule = V.Editor.Slideset.getCreatorModule(V.Editor.getPresentationType());
		var isSlideset = (slidesetModule!==null);

		if(isSlideset){
			var validate = slidesetModule.validateOnSave();
			if(typeof validate === "string"){
				_showDialog(validate);
				return;
			}
		}

		if(V.Slides.getSlides().length === 0){
			_showDialog("message1_form");
			return;
		} 
	
		switch(V.Configuration.getConfiguration()["mode"]){
			case V.Constant.NOSERVER:
				$("a[save-option-id='save']").hide();
				break;
			case V.Constant.VISH:
				if(V.Editor.isPresentationDraft()){
					$("a[save-option-id='save']").hide();
				} else {
					$("a[save-option-id='draft']").hide();
					$("a[save-option-id='publish']").hide();
				}
				break;
			case V.Constant.STANDALONE:
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
						var presentation = V.Editor.savePresentation();	
						V.Editor.afterSavePresentation(presentation,response);			
					} else {
						return false;
					}
				}
			}
		);  
	};

	/*
	 * Helper to show validation dialogs
	 */
	var _showDialog = function(id){
		if($("#"+id).length===0){
			return;
		}
		$.fancybox(
			$("#"+id).html(),
			{
				'autoDimensions'	: false,
				'scrolling': 'no',
				'width'         	: 350,
				'height'        	: 200,
				'showCloseButton'	: false,
				'padding' 			: 5		
			}
		);
	}

	/////////////////////
	/// PREVIEW
	///////////////////////

	var preview = function(){
		V.Editor.Preview.preview();
	}

	/////////////////////
	/// HELP
	///////////////////////

	var help = function(){
		$("#help_right").trigger('click');
	}


	/////////////////////
	/// Modes
	///////////////////////

	var switchToPresentation = function(){
		_beforeChangeMode();
		V.Editor.setMode(V.Constant.PRESENTATION);

		var presentation = V.Editor.savePresentation();
		V.Editor.setPresentation(presentation);
		V.Editor.setPresentationType(V.Constant.PRESENTATION);
		V.Editor.Slides.showSlides();
		V.Editor.Thumbnails.redrawThumbnails();
		V.Editor.Tools.init();
	};

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
		} else {
			_beforeChangeMode();
			V.Editor.setMode(V.Constant.FLASHCARD);
			V.Editor.Flashcard.Creator.onLoadMode();
		}
	};

	var switchToVirtualTour = function(){
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
		} else {
			_beforeChangeMode();
			V.Editor.setMode(V.Constant.VTOUR);
			V.Editor.VirtualTour.Creator.onLoadMode();
		}
	}

	var _beforeChangeMode = function(){
		switch(V.Editor.getMode()){
			case V.Constant.PRESENTATION:
				break;
			case V.Constant.FLASHCARD:
					V.Editor.Flashcard.Creator.onLeaveMode();
				break;
			case V.Constant.VTOUR:
					V.Editor.VirtualTour.Creator.onLeaveMode();
				break;
			default:
				break;
		}
	}

	var insertSmartcard = function(){
		$("#addSlideFancybox").trigger('click');
		V.Editor.Utils.loadTab('tab_smartcards_repo');
	};

	var insertPresentation = function(){
		$("#addSlideFancybox").trigger('click');
		V.Editor.Utils.loadTab('tab_presentations_repo');
	};

	var insertSlide = function(){
		$("#addSlideFancybox").trigger('click');
		V.Editor.Utils.loadTab('tab_templates');
	};

	var insertJSON = function(){
		$("#addJSONFancybox").trigger('click');
	};

	var exportToJSON = function(){
		//TODO: Show Loading
		VISH.Editor.Presentation.File.exportToJSON(function(){
			//on success
			//TODO: Hide Loading
		});
	};

	var _hideMenuAfterAction = function(){
		if(_hoverMenu){
			$("#menu").hide();
			setTimeout(function(){
				$("#menu").show();
			},50);
		}
	}

	return {
		init							: init,
		updateMenuAfterAddSlide 		: updateMenuAfterAddSlide,
		disableMenu 					: disableMenu ,
		enableMenu 						: enableMenu,
		displaySettings					: displaySettings,
		insertPresentation				: insertPresentation,
		insertSmartcard					: insertSmartcard,
		insertSlide						: insertSlide,
		insertJSON						: insertJSON,
		exportToJSON 					: exportToJSON,
		onSettings						: onSettings,
		onSavePresentationDetailsButtonClicked	: onSavePresentationDetailsButtonClicked,
		onPedagogicalButtonClicked   	: onPedagogicalButtonClicked,
		onDonePedagogicalButtonClicked 	: onDonePedagogicalButtonClicked,
		onSaveButtonClicked             : onSaveButtonClicked,
		preview 						: preview,
		help 							: help,
		switchToPresentation			: switchToPresentation,
		switchToFlashcard				: switchToFlashcard,
		switchToVirtualTour 			: switchToVirtualTour
	};

}) (VISH, jQuery);