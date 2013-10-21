VISH.Editor.Tools.Menu = (function(V,$,undefined){

	var _initialized = false;
	var _hoverMenu = false;
	var _competitionsModalShown = true;

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
			options.text = V.I18n.getTrans("i.MandatoryFieldsNotification");
			var button1 = {};
			button1.text = V.I18n.getTrans("i.GotoSettings");
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
			options.text = V.I18n.getTrans("i.NoSlidesOnSaveNotification");
			var button1 = {};
			button1.text = V.I18n.getTrans("i.Ok");
			button1.callback = function(){
				$.fancybox.close();
			}
			options.buttons = [button1];
			V.Utils.showDialog(options);
			return;
		}

		if(!V.Editor.Competitions.isValidCandidate() && !_competitionsModalShown){
			//_competitionsModalShown = true;
			var options = {};
			options.width = 650;
			options.height = 190;
			options.text = V.I18n.getTrans("i.NoCompetitions1");
			options.textWrapperClass = "competitions_paragraph";

			options.onClosedCallback = function(){VISH.Editor.Tools.Menu.onPublishButtonClicked()};
			
			options.notificationIconSrc = V.ImagesPath + "zonethumbs/content_fail.png";

			options.middlerow = V.Editor.Competitions.generateForm();			
			options.middlerowExtraClass = "competitions_options";

			var button1 = {};
			button1.text = V.I18n.getTrans("i.Done");
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
		options.notificationIconSrc = V.ImagesPath + "icons/save_document.png";
		options.text = V.I18n.getTrans("i.areyousureNotification");
		options.buttons = [];

		var button1 = {};
		button1.text = V.I18n.getTrans("i.cancel");
		button1.callback = function(){
			$.fancybox.close();
		}
		options.buttons.push(button1);

		if(((V.Configuration.getConfiguration()["mode"]==V.Constant.VISH)&&(V.Editor.isPresentationDraft()))||(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER)){
			var button2 = {};
			button2.text = V.I18n.getTrans("i.draft");
			button2.callback = function(){
				var presentation = V.Editor.savePresentation();
				V.Editor.afterSavePresentation(presentation,"draft");
				$.fancybox.close();
			}
			options.buttons.push(button2);
		}

		var button3 = {};
		if((V.Configuration.getConfiguration()["mode"]==V.Constant.VISH)||(V.Configuration.getConfiguration()["mode"]==V.Constant.NOSERVER)){
			button3.text = V.I18n.getTrans("i.publish");
		} else if(V.Configuration.getConfiguration()["mode"]==V.Constant.STANDALONE){
			button3.text = V.I18n.getTrans("i.save");
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
		$("#addSlideFancybox").trigger('click');
		V.Editor.Utils.loadTab('tab_json_file');
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
			setTimeout(function(){
				V.Utils.Loader.onCloseLoading();
				var options = {};
				options.width = 600;
				options.height = 185;
				options.text = V.I18n.getTrans("i.exportPresToJSONerrorNotification");
				var button1 = {};
				button1.text = V.I18n.getTrans("i.Ok");
				button1.callback = function(){
					$.fancybox.close();
				}
				options.buttons = [button1];
				V.Utils.showDialog(options);
			},500);
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