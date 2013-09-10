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
			_showDialog(options);
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
			_showDialog(options);
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
	var _showDialog = function(options){
		var id = "notification_template";
		if($("#"+id).length===0){
			return;
		}
		if((!options)||(!options.text)){
			return;
		}

		var width = 350;
		var height = 200;
		var showCloseButton = false;
		var notificationIconSrc = V.ImagesPath + "zonethumbs/content_fail.png";

		if(options.width){
			width = options.width;
		}
		if(options.height){
			height = options.height;
		}
		if(options.showCloseButton){
			showCloseButton = options.showCloseButton;
		}
		if(options.notificationIconSrc){
			notificationIconSrc = options.notificationIconSrc;
		}

		// fancybox to edit presentation settings
		$("a#link_to_notification_template").fancybox({
			'autoDimensions' 	: false,
			'autoScale' 		: false,
			'scrolling'			: 'no',
			'width'				: width,
			'height'			: height,
			'padding' 			: 0,
			'hideOnOverlayClick': true,
			'hideOnContentClick': false,
			'showCloseButton'	: showCloseButton,
			"onStart"  	: function(data){
				var text_wrapper = $("#"+id).find(".notification_row1");
				var buttons_wrapper = $("#"+id).find(".notification_row2");

				$(text_wrapper).find(".notificationIcon").attr("src",notificationIconSrc);
				$(text_wrapper).find(".notification_text").html(options.text);

				if(options.buttons){
					var obLength = options.buttons.length;
					$(options.buttons).reverse().each(function(index,button){
						var bNumber = obLength-index;
						$(buttons_wrapper).append('<a href="#" buttonNumber="'+bNumber+'" class="button notification_button">'+button.text+'</a>');
						$(buttons_wrapper).find(".button[buttonNumber='"+bNumber+"']").click(function(event){
							event.preventDefault();
							button.callback();
						});
					});
				}
			},
			"onComplete"  	: function(data){
				//Adjust height (needed when height is smaller than the appropiately one)
				var text_wrapper = $("#fancybox-content").find(".notification_row1");
				var buttons_wrapper = $("#fancybox-content").find(".notification_row2");
				var adjustedHeight = $(text_wrapper).outerHeight(true)+$(buttons_wrapper).outerHeight(true);

				if($("#fancybox-content").height() < (adjustedHeight+10)){
					$("#"+id).height(adjustedHeight);
					var wrapperPadding = $("#"+id).cssNumber("padding-bottom")+$("#"+id).cssNumber("padding-top");
					var adjustedHeightWithPadding = adjustedHeight+wrapperPadding;
					$("#fancybox-content").height(adjustedHeightWithPadding);
					$("#fancybox-content > div").height(adjustedHeightWithPadding);
				}

			},
			"onClosed" : function(data){
				var text_wrapper = $("#"+id).find(".notification_row1");
				var buttons_wrapper = $("#"+id).find(".notification_row2");
				$(buttons_wrapper).html("");
				$(text_wrapper).find(".notificationIcon").removeAttr("src",notificationIconSrc);
				$(text_wrapper).find(".notification_text").html("");
				$("#"+id).removeAttr('style');

				if((options)&&(typeof options.onClosedCallback == "function")){
					options.onClosedCallback();
				}
			}
		});

		$("a#link_to_notification_template").trigger('click');
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