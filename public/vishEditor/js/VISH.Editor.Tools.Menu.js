VISH.Editor.Tools.Menu = (function(V,$,undefined){

	var _initialized = false;
	var _hoverMenu = false;

	/*
	 * Init singleton
	 * Perform actions that must be executed only once
	 */
	var init = function(){
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

			_initialized = true;
		}
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

	var disableMenu = function(){
		$("#menu").hide();
		$("#menu").attr("id","menuDisabled");
	}

	var enableMenu = function(){
		$("#menuDisabled").show();
		$("#menuDisabled").attr("id","menu");
	}


	//////////////////
	/// SAVE
	/////////////////

	var onSaveButtonClicked = function(){
		onPublishButtonClicked();
	}

	/**
	* function called when user clicks on save
	* Generates the json for the current slides
	* covers the section element and every article inside
	* finally calls V.Viewer with the generated json
	*/
	var onPublishButtonClicked = function(){

		if(!V.Editor.Settings.checkMandatoryFields()){
			var options = {};
			options.width = 500;
			options.height = 200;
			options.onClosedCallback = function(){
				setTimeout(function(){
					V.Editor.Settings.displaySettings();
				},250);
			};
			_showDialog("message2_form", options);
			return;
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
	var _showDialog = function(id,options){
		if($("#"+id).length===0){
			return;
		}

		var width = 350;
		var height = 200;
		if(options){
			if(options.width){
				width = options.width;
			}
			if(options.height){
				height = options.height;
			}
		}

		$.fancybox(
			$("#"+id).html(),
			{
				'autoDimensions'	: false,
				'scrolling': 'no',
				'width'         	: width,
				'height'        	: height,
				'showCloseButton'	: false,
				'padding' 			: 5,
				'onClosed'			: function(){
					if((options)&&(typeof options.onClosedCallback == "function")){
						options.onClosedCallback();
					}
				}
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

	////////////////
	//More Actions
	///////////////

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
		V.Editor.Utils.loadTab('tab_slides');
	};

	var insertSubslide = function(){
		V.Editor.setContentAddMode(V.Constant.SLIDESET);
		$("#addSlideFancybox").trigger('click');
		V.Editor.Utils.loadTab('tab_slides');
	};

	var insertJSON = function(){
		$("#addJSONFancybox").trigger('click');
	};

	var insertPDFex = function(){
		$("#addSlideFancybox").trigger('click');
		V.Editor.Utils.loadTab('tab_pdfex');
	};

	var exportToJSON = function(){
		V.Utils.Loader.startLoading();
		V.Editor.Presentation.File.exportToJSON(function(){
			//on success
			V.Utils.Loader.stopLoading();
		}, function(){
			//on fail
			V.Utils.Loader.stopLoading();
		});
	};

	var displaySettings = function(){
		V.Editor.Settings.displaySettings();
	}

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
		disableMenu 					: disableMenu,
		enableMenu 						: enableMenu,
		insertPresentation				: insertPresentation,
		insertSmartcard					: insertSmartcard,
		insertSlide						: insertSlide,
		insertSubslide					: insertSubslide,
		insertJSON						: insertJSON,
		insertPDFex						: insertPDFex,
		exportToJSON 					: exportToJSON,
		displaySettings					: displaySettings,
		onPublishButtonClicked			: onPublishButtonClicked,
		onSaveButtonClicked 			: onSaveButtonClicked,
		preview 						: preview,
		help 							: help
	};

}) (VISH, jQuery);