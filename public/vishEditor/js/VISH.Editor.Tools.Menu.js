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
			options.width = 600;
			options.height = 220;
			options.text = "You need to write a title for the excursion and select an avatar before publish the excursion.";
			var button1 = {};
			button1.text = "Go to Settings";
			button1.callback = function(){
				V.Editor.Settings.displaySettings();
			}
			options.buttons = [button1];
			// options.onClosedCallback = function(){
			// };
			V.Utils.showDialog(options);
			return;
		}

		if(V.Slides.getSlides().length === 0){
			var options = {};
			options.width = 600;
			options.height = 150;
			options.text = "Create at least one slide before saving.";
			var button1 = {};
			button1.text = "Ok";
			button1.callback = function(){
				$.fancybox.close();
			}
			options.buttons = [button1];
			V.Utils.showDialog(options);
			return;
		}

		var options = {};
		options.width = 400;
		options.height = 140;
		options.notificationIconSrc = V.ImagesPath + "toolbar/save_document.png";
		options.text = "are you sure?";
		options.buttons = [];

		var button1 = {};
		button1.text = "cancel";
		button1.callback = function(){
			$.fancybox.close();
		}
		options.buttons.push(button1);

		if(((V.Configuration.getConfiguration()["mode"]==V.Constant.VISH)&&(V.Editor.isPresentationDraft()))||(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER)){
			var button2 = {};
			button2.text = "draft";
			button2.callback = function(){
				var presentation = V.Editor.savePresentation();
				V.Editor.afterSavePresentation(presentation,"draft");
				$.fancybox.close();
			}
			options.buttons.push(button2);
		}

		var button3 = {};
		if((V.Configuration.getConfiguration()["mode"]==V.Constant.VISH)||(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER)){
			button3.text = "publish";
		} else if(V.Configuration.getConfiguration()["mode"]==V.Constant.STANDALONE){
			button3.text = "save";
		}
		button3.callback = function(){
			var presentation = V.Editor.savePresentation();
			V.Editor.afterSavePresentation(presentation,"publish");
			$.fancybox.close();
		}
		options.buttons.push(button3);

		V.Utils.showDialog(options);
	};

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