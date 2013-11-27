VISH.Editor.Tools.Menu = (function(V,$,undefined){

	var _initialized = false;
	var _hoverMenu = false;
	var _competitionsModalShown = false;

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
						return false;
					}
					if(typeof V.Editor.Tools.Menu[$(menuButton).attr("action")] == "function"){
						V.Editor.Tools.Menu[$(menuButton).attr("action")](this);
						_hideMenuAfterAction();
					}
					return false;
				});
			});

			//Prevent iframe to move
			if(V.Status.getDevice().desktop){
				$("a.menu_option_main, a.menu_option:not('.menu_action')").on("click", function(event){
					event.preventDefault();
					return false;
				});
			}

			//EditorAdapter
			var options = V.Utils.getOptions();
			//Check exit option in menu
			if(typeof options.exitURL != "string"){
				$(".menu_option.menu_action[action='exit']").parent().hide();
			}
			
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
		V.Editor.Tools.changeSaveButtonStatus("loading");
		var presentation = V.Editor.savePresentation();
		V.Editor.sendPresentation(presentation,"save",function(){
			//onSave succesfully
			V.Debugging.log("onSave succesfully");
			V.Editor.Tools.changeSaveButtonStatus("disabled");
		}, function(){
			//error onSave
			V.Debugging.log("onSave failure");
			V.Editor.Tools.changeSaveButtonStatus("enabled");
		});
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

		//Competitions (deprecated)
		if(!V.Editor.Competitions.isValidCandidate() && !_competitionsModalShown){
			_competitionsModalShown = true;
			var options = {};
			options.width = 650;
			options.height = 190;
			options.text = V.I18n.getTrans("i.NoCompetitions1");
			options.textWrapperClass = "competitions_paragraph";

			options.onClosedCallback = function(){
				setTimeout(function(){
						V.Editor.Tools.Menu.onPublishButtonClicked()
				}, 500);
			};
			
			options.notificationIconSrc = V.ImagesPath + "zonethumbs/content_fail.png";

			options.middlerow = V.Editor.Competitions.generateForm();		
			options.middlerowExtraClass = "competitions_options";

			var button1 = {};
			button1.text = V.I18n.getTrans("i.Done");
			button1.extraclass = "competi_disabled";
			button1.callback = function(){
				$.fancybox.close();				
			}
			var button2 = {};
			button2.text = V.I18n.getTrans("i.NoThanks");
			button2.callback = function(){
				$.fancybox.close();				
			}
			options.buttons = [button1, button2];
			V.Utils.showDialog(options);
			return;
		}


		var options = {};
		options.width = 600;
		options.height = 200;
		options.notificationIconSrc = V.ImagesPath + "icons/publish_icon.png";
		options.notificationIconClass = "publishNotificationIcon";
		options.text = V.I18n.getTrans("i.Publish_confirmation");
		options.buttons = [];

		var button1 = {};
		button1.text = V.I18n.getTrans("i.cancel");
		button1.callback = function(){
			$.fancybox.close();
		}
		options.buttons.push(button1);

		var button2 = {};
		button2.text = V.I18n.getTrans("i.publish");

		button2.callback = function(){
			V.Editor.Tools.changePublishButtonStatus("publishing");
			var presentation = V.Editor.savePresentation();
			V.Editor.sendPresentation(presentation,"publish", function(data){
				//onSuccess

				switch(V.Configuration.getConfiguration().mode){
					case V.Constant.VISH:
						V.Editor.Events.allowExitWithoutConfirmation();
						window.top.location.href = data.url;
						break;
					case V.Constant.NOSERVER:
						V.Debugging.log("Saved presentation");
						V.Debugging.log(presentation);
						V.Editor.Preview.preview();
						V.Editor.Tools.changePublishButtonStatus("unpublish");
						break;
					case V.Constant.STANDALONE:
						break;
				}
			}, function(){
				//onFail
				V.Editor.Tools.changePublishButtonStatus("publish");
			});
			$.fancybox.close();
		}
		options.buttons.push(button2);

		V.Utils.showDialog(options);
	};

	var onUnpublishButtonClicked = function(){
		var options = {};
		options.width = 600;
		options.height = 200;
		options.notificationIconSrc = V.ImagesPath + "icons/unpublish_icon.png";
		options.notificationIconClass = "publishNotificationIcon";
		options.text = V.I18n.getTrans("i.Unpublish_confirmation");
		options.buttons = [];

		var button1 = {};
		button1.text = V.I18n.getTrans("i.cancel");
		button1.callback = function(){
			$.fancybox.close();
		}
		options.buttons.push(button1);

		var button2 = {};
		button2.text = V.I18n.getTrans("i.unpublish");

		button2.callback = function(){
			V.Editor.Tools.changePublishButtonStatus("unpublishing");
			var presentation = V.Editor.savePresentation();
			V.Editor.sendPresentation(null,"unpublish", function(){
				//onSuccess
				V.Editor.Tools.changePublishButtonStatus("publish");
			}, function(){
				//onFail
				V.Editor.Tools.changePublishButtonStatus("unpublish");
			});
			$.fancybox.close();
		}
		options.buttons.push(button2);

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

	var about = function(){
		V.Tour.startTourWithId('about_screen', 'top');
	}

	var exit = function(){

		if(V.Editor.hasPresentationChanged()){
			var options = {};
			options.width = 600;
			options.height = 200;
			options.notificationIconSrc = V.ImagesPath + "icons/save_document.png";
			// options.notificationIconClass = "publishNotificationIcon";
			options.text = V.I18n.getTrans("i.exitConfirmationMenu");
			options.buttons = [];

			var button1 = {};
			button1.text = V.I18n.getTrans("i.cancel");
			button1.callback = function(){
				$.fancybox.close();
			}
			options.buttons.push(button1);

			var button2 = {};
			button2.text = V.I18n.getTrans("i.ExitWSaving");
			button2.callback = function(){
				_exitFromVE();
				$.fancybox.close();
			}
			options.buttons.push(button2);

			var button3 = {};
			button3.text = V.I18n.getTrans("i.SaveAndExit");
			button3.callback = function(){
				$("#waiting_overlay").show();
				V.Editor.Tools.changeSaveButtonStatus("loading");
				var presentation = V.Editor.savePresentation();
				V.Editor.sendPresentation(presentation,"save",function(){
					//onSave succesfully
					V.Editor.Tools.changeSaveButtonStatus("disabled");
					_exitFromVE();
				}, function(){
					//error onSave
					V.Editor.Tools.changeSaveButtonStatus("enabled");
					$("#waiting_overlay").hide();
				});
				$.fancybox.close();
			}
			options.buttons.push(button3);

			V.Utils.showDialog(options);

		} else {
			_exitFromVE();
		}
	}

	var _exitFromVE = function(){
		V.Editor.Events.allowExitWithoutConfirmation();
		window.top.location.href = V.Utils.getOptions().exitURL;
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
		V.Editor.Utils.loadTab('tab_slides');
		return false; //Prevent iframe to move
	};

	var insertSubslide = function(){
		V.Editor.setContentAddMode(V.Constant.SLIDESET);
		$("#addSlideFancybox").trigger('click');
		V.Editor.Utils.loadTab('tab_slides');
		return false; //Prevent iframe to move
	};

	var insertJSON = function(){
		$("#addSlideFancybox").trigger('click');
		V.Editor.Utils.loadTab('tab_json_file');
	};

	var insertPDFex = function(){
		$("#addSlideFancybox").trigger('click');
		V.Editor.Utils.loadTab('tab_pdfex');
		return false; //Prevent iframe to move
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
			$("#menu ul.menu_option_main").addClass("temp_hidden");
			setTimeout(function(){
				$("#menu ul.menu_option_main").removeClass("temp_hidden");
			},500);
		}
	};

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
		onUnpublishButtonClicked		: onUnpublishButtonClicked,
		onSaveButtonClicked 			: onSaveButtonClicked,
		preview 						: preview,
		help 							: help,
		about							: about,
		exit 							: exit
	};

}) (VISH, jQuery);