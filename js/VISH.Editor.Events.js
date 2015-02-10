/*
 * Events for ViSH Editor (the events of the Viewer are handled in VISH.Events.js)
 */
VISH.Editor.Events = (function(V,$,undefined){
	
	var _bindedEditorEventListeners = false;
	var _confirmOnExit;
	var _isCtrlKeyPressed = false;
	var _mobile;

	var init = function(){
		_mobile = (!V.Status.getDevice().desktop);
		if(_mobile){
			V.Editor.Events.Mobile.init();
		}
		bindEditorEventListeners();
	};

	var bindEditorEventListeners = function(){
		if(!_bindedEditorEventListeners){

			$(document).on('click', '#addSlideButton', V.Editor.Tools.Menu.insertSlide);
			$(document).on('click', '#addSlideButtonOnSubslides', V.Editor.Tools.Menu.insertSubslide);
			$(document).on('click', '#importButton', V.Editor.Tools.Menu.insertPDFex);

			$(document).on('click', '#slideset_selected_img', V.Editor.Slideset.onClickOpenSlideset);
			
			//Settings events
			$(document).on('click', '#presentation_details_preview_thumbnail', V.Editor.Settings.onChangeThumbnailClicked);
			$(document).on('hover', '#presentation_details_preview_thumbnail', function(event){
				var thumbnail = $("#presentation_details_preview_thumbnail_img");
				if($(thumbnail).hasClass("addThumbnailPlus")){
					return;
				}
				if(event.type==="mouseenter"){
					$("#editthumb").slideDown();
				} else {
					$("#editthumb").slideUp();
				}
			});
			
			$(document).on('keyup', '#presentation_details_input_title', V.Editor.Settings.onKeyUpOnTitle);
			$(document).on('keyup', '#presentation_details_preview_addtitle_input', V.Editor.Settings.onKeyUpOnPreviewTitle);
			$(document).on('click', '#pedagogical_clasification_button', V.Editor.Settings.onPedagogicalButtonClicked);
			$(document).on('click', '#done_in_pedagogical', V.Editor.Settings.onDonePedagogicalButtonClicked);
			$(document).on('click', '#fill_details_later_button', function(event){
				event.preventDefault();
				$.fancybox.close();
			});
			$(document).on('change', '#tlt_hours, #tlt_minutes, #tlt_seconds', V.Editor.Settings.onTLTchange);
			$(document).on('keyup', '#tlt_hours, #tlt_minutes, #tlt_seconds', V.Editor.Settings.onTLTchange);
			$(document).on('click', '#save_presentation_details', V.Editor.Settings.onSavePresentationDetailsButtonClicked);
			
			$(document).on('click','div.templatethumb', V.Editor.onSlideThumbClicked);
			$(document).on('click','div.stthumb', V.Editor.onSlideThumbClicked);
			$(document).on('click','#animation_fancybox div.slidethumb', V.Editor.onAnimationThumbClicked); //animations thumb

			$(document).on('click','.stthumb_wrapper p', V.Editor.onSlideThumbClicked);
			$(document).on('click','.editable', V.Editor.onEditableClicked);
			$(document).on('click','.selectable', V.Editor.onSelectableClicked);
			$(document).on('click',':not(".selectable"):not(".preventNoselectable")', V.Editor.onNoSelectableClicked);
			
			$(document).on('click','.delete_content', V.Editor.onDeleteItemClicked);
			$(document).on('click','.delete_slide', V.Editor.onDeleteSlideClicked);

			$(document).on('click','#animation_fancybox div[animation]', V.Editor.Animations.onAnimationSelected);

			$(document).on('click','#theme_fancybox img[theme]', V.Editor.Themes.onThemeSelected);

			$(document).on("click", ".change_bg_button", V.Editor.Tools.changeBackground);

			$(document).bind('keydown', handleBodyKeyDown);
			$(document).bind('keyup', handleBodyKeyUp);

			// Slide Enter and Leave events
			$('article').live('slideenter', V.Editor.onSlideEnterEditor);
			$('article').live('slideleave', V.Editor.onSlideLeaveEditor);

			//Waiting overlay
			$(document).on('click',"#waiting_overlay", function(event){
				event.stopPropagation();
				event.preventDefault();
			});

			//Focus
			$(window).focus(function(){
				V.Status.setWindowFocus(true);
			}).blur(function(){
				V.Status.setWindowFocus(false);
			});

			//Load onresize event
			//Prevent multiple consecutively calls
			var multipleOnResize = undefined;
			window.onresize = function(){
				if(typeof multipleOnResize == "undefined"){
					multipleOnResize = false;
					setTimeout(function(){
						if(!multipleOnResize){
							multipleOnResize = undefined;

							//After Resize actions
							V.Status.refreshDeviceAfterResize();

							var currentDevice = V.Status.getDevice();
							V.EventsNotifier.notifyEvent(V.Constant.Event.onViewportResize,{screen: currentDevice.screen, viewport: currentDevice.viewport});
							
							V.Editor.ViewerAdapter.updateInterface();
						} else {
							multipleOnResize = undefined;
							window.onresize();
						}
					},600);
				} else {
					multipleOnResize = true;
				}
			};

			//Tutorial events
			_addTutorialEvents();

			//Fancyboxes

			// fancybox to create a new slide
			$("a#addSlideFancybox").fancybox({
				'autoDimensions' : false,
				'scrolling': 'no',
				'width': 800,
				'height': 740,
				'padding': 0,
				"onStart"  : function(data) {
					var slidesAddMode = V.Editor.getContentAddMode();
					if(slidesAddMode===V.Constant.NONE){
						V.Editor.setContentAddMode(V.Constant.STANDARD);
					}

					if(slidesAddMode===V.Constant.SLIDESET){
						//Show slides only
						$("#tab_pdfex").parent().hide();
						$("#tab_presentations_repo").parent().hide();
						$("#tab_json_file").parent().hide();

						//Inside slides, show templates only
						$(".tab_slides_smartcards").hide();
					}

					var clickedZoneId = $(data).attr("zone");
					V.Editor.setCurrentArea($("#" + clickedZoneId));
					V.Editor.Utils.loadTab('tab_slides');
				},
				"onClosed"  : function(data) {
					$(".tab_slides_smartcards").show();

					$("#tab_pdfex").parent().show();
					$("#tab_presentations_repo").parent().show();
					$("#tab_json_file").parent().show();

					V.Editor.setContentAddMode(V.Constant.NONE);
				}
			});

			//Select theme fancybox
			$("#hidden_button_to_launch_theme_fancybox").fancybox({
				'autoDimensions' : false,
				'width': 600,
				'scrolling': 'no',
				'height': 400,
				'padding' : 0
			});

			//Select animation fancybox
			$("#hidden_button_to_launch_animation_fancybox").fancybox({
				'autoDimensions' : false,
				'width': 600,
				'scrolling': 'no',
				'height': 400,
				'padding' : 0
			});

			//Loading fancybox
			$("#fancyLoad").fancybox({
				'type'		   : 'inline',
				'autoDimensions' : false,
				'scrolling': 'no',
				'autoScale' : true,		      
				'width': '100%',
				'height': '100%',
				'padding': 0,
				'margin' : 0,
				'overlayOpacity': 0.0,
				'overlayColor' : "#fff",
				'showCloseButton'	: false,
				'onComplete'  : function(data) {
						V.Utils.Loader.prepareFancyboxForFullLoading();
				},
				'onClosed' : function(data) {
				}
			});

			//Change background
			$("#hidden_button_to_change_slide_background").fancybox({
				'autoDimensions' : false,
				'width': 800,
				'scrolling': 'no',
				'height': 600,
				'padding' : 0,
				"onStart"  : function(data) {
					V.Editor.Image.setAddContentMode(V.Constant.FLASHCARD);
					V.Editor.Utils.loadTab('tab_pic_from_url');
				},
				"onClosed"  : function(data) {
					V.Editor.Image.setAddContentMode(V.Constant.NONE);
				}
			});

			//Fancybox to select presentation Thumbnail
			$("#hidden_button_to_uploadThumbnail").fancybox({
				'autoDimensions' : false,
				'width': 800,
				'scrolling': 'no',
				'height': 600,
				'padding' : 0,
				"onStart"  : function(data) {
					V.Editor.Image.setAddContentMode(V.Constant.THUMBNAIL);
					V.Editor.Utils.loadTab('tab_pic_upload');
				},
				"onClosed" : function(data){
					if(V.Editor.Image.getAddContentMode()===V.Constant.THUMBNAIL){
						setTimeout(function(){
							V.Editor.Settings.displaySettings();
						},100);
					};
					V.Editor.Image.setAddContentMode(V.Constant.NONE);
				}
			});

			//Element Settings
			$(document).on("click", "#quizSettingsDone", V.Editor.Quiz.onQuizSettingsDone);
			$(document).on("click", "#exportQuizToIMSQTI", function(){ V.Editor.Quiz.onExportTo("QTI") });
			$(document).on("click", "#exportQuizToMoodleXML", function(){ V.Editor.Quiz.onExportTo("MoodleXML") });
			
			//onbeforeunload event
			window.onbeforeunload = _exitConfirmation;
			_confirmOnExit = true;

			//Allow keyboard events with the first click
			$(window.document).on('click', function(ev){
				if(V.Status.getDevice().browser.name === V.Constant.IE){
					//Prevent inputs to lose the focus when IE
					if((ev.target)&&($(ev.target).is(":input"))){
						return;
					}
				}
				window.focus();
			});

			if(_mobile){
				V.Editor.Events.Mobile.bindEditorMobileEventListeners();
			}

			_bindedEditorEventListeners = true;
		}
	};


	/**
	* Tutorial
	* Function to add the events to the help buttons to launch joy ride bubbles
	*/
	var _addTutorialEvents = function(){
		//Help in menu
		$(document).on('click','#help_right', function(){
			V.Tour.startTourWithId('menubar_help', 'top');
		});

		//Help in standard slide
		$(document).on('click','.help_in_sslide', function(){
			V.Tour.startTourWithId('sslide_help', 'bottom');
		});

		//Help in Flashcards
		$(document).on('click','.help_in_flashcard', function(){
			V.Tour.startTourWithId('fc_help', 'top');
		});

		//Help in Virtual Tours
		$(document).on('click','.help_in_vt', function(){
			V.Tour.startTourWithId('vt_help', 'top');
		});

		//Help in Enriched Videos
		$(document).on('click','.help_in_evideo', function(){
			V.Tour.startTourWithId('evideo_help', 'top');
		});

		//Help in slide templates selection
		$(document).on('click','#tab_slides_help', function(){
			V.Tour.startTourWithId('help_template_selection_help', 'bottom');
		});

		//Help inserting a PDF presentation
		$(document).on('click','#tab_pdfex_help', function(){
			V.Tour.startTourWithId('help_pdfex_help', 'bottom');
		});

		//Help inserting e-Learning packages
		$(document).on('click','#tab_epackage_help', function(){
			V.Tour.startTourWithId('help_epackage_help', 'bottom');
		});

		//Help importing external files (e.g. JSON)
		$(document).on('click','#tab_efile_help', function(){
			V.Tour.startTourWithId('help_efile_help', 'bottom');
		});

		//Help in presentation carrousel
		$(document).on('click','#tab_presentations_repo_help', function(){
			V.Tour.startTourWithId('help_excursion_selection_help', 'bottom');
		});	

		//Help in LRE carrousel
		$(document).on('click','#tab_presentations_lre_help', function(){
			V.Tour.startTourWithId('tab_presentations_lre_help', 'bottom');
		});	

		//Help in themes templates
		$(document).on('click','#help_themes_selection', function(){			
			V.Tour.startTourWithId('themes_help', 'bottom');
		});

		//Help in animation templates
		$(document).on('click','#help_animation_selection', function(){		
			V.Tour.startTourWithId('animation_help', 'bottom');
		});

		//Help in Settings
		$(document).on('click','#help_in_settings', function(){
			V.Tour.startTourWithId('help_in_settings_help', 'bottom');
		});

		//Help in pedagogical options settings	
		$(document).on('click','#help_pedagogical_selection', function(){
			V.Tour.startTourWithId('help_pedagogical_selection_help', 'bottom');
		});

		//Help inserting images [URL, Upload, ViSH, Flickr, LRE]
		$(document).on('click','#tab_pic_from_url_help', function(){
			V.Tour.startTourWithId('images_fancy_tabs_id_help', 'top');
		});	
		$(document).on('click','#tab_pic_upload_help', function(){
			V.Tour.startTourWithId('upload_picture_form_help', 'top');
		});
		$(document).on('click','#tab_pic_repo_help', function(){
			V.Tour.startTourWithId('search_picture_help', 'bottom');
		});
		$(document).on('click','#tab_pic_flikr_help', function(){
			V.Tour.startTourWithId('search_flickr_fancy_help', 'bottom');
		});
		$(document).on('click','#tab_pic_lre_help', function(){
			V.Tour.startTourWithId('search_lre_fancy_help', 'bottom');
		});

		//Help inserting objects [Web, Snapshot, URL/Embed, Upload, ViSH, LRE]
		$(document).on('click','#tab_object_from_web_help', function(){
			V.Tour.startTourWithId('object_fancy_tabs_main_help', 'top');
		});
		$(document).on('click','#tab_object_snapshot_help', function(){
			V.Tour.startTourWithId('object_fancy_tabs_main_help', 'top');
		});
		$(document).on('click','#tab_object_from_url_help', function(){
			V.Tour.startTourWithId('object_fancy_tabs_main_help', 'top');
		});
		$(document).on('click','#tab_object_upload_help', function(){
			V.Tour.startTourWithId('object_fancy_tabs_main_help', 'top');
		});
		$(document).on('click','#tab_object_repo_help', function(){
			V.Tour.startTourWithId('object_fancy_tabs_main_help', 'top');
		});
		$(document).on('click','#tab_object_lre_help', function(){
			V.Tour.startTourWithId('object_fancy_tabs_main_help', 'top');
		});

		//Help inserting videos [URL, ViSH, YouTube, Vimeo]
		$(document).on('click','#tab_video_from_url_help', function(){
			V.Tour.startTourWithId('video_fancy_tabs_main_help', 'top');
		});
		$(document).on('click','#tab_video_repo_help', function(){
			V.Tour.startTourWithId('video_fancy_tabs_main_help', 'top');
		});
		$(document).on('click','#tab_video_youtube_help', function(){
			V.Tour.startTourWithId('video_fancy_tabs_main_help', 'top');
		});
		$(document).on('click','#tab_video_vimeo_help', function(){
			V.Tour.startTourWithId('video_fancy_tabs_main_help', 'top');
		});

		//Help in Quiz Templates
		$(document).on('click','#tab_quizzes_help', function(){			
			V.Tour.startTourWithId('quiz_help', 'bottom');
		});
		
		//Help inserting live objects
		$(document).on('click','#tab_live_resource_help', function(){
			V.Tour.startTourWithId('tab_live_resource_id', 'bottom');
		});
	};

	//////////////
	// Event Listeners
	//////////////
	var addZoneThumbsEvents = function(container){

		$(container).find("a.addpicture").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'scrolling': 'no',
			'height': 600,
			'padding' : 0,
			"onStart"  : function(data) {
				//re-set the current area to the clicked zone, because maybe the user have clicked in another editable zone before this one
				var clickedZoneId = $(data).attr("zone");
				V.Editor.setCurrentArea($("#" + clickedZoneId));
				V.Editor.Image.setAddContentMode(V.Constant.NONE);
				V.Editor.Utils.loadTab('tab_pic_from_url');
			}
		});

		$(container).find("a.addobject").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'height': 600,
			'scrolling': 'no',
			'padding' : 0,
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				V.Editor.setCurrentArea($("#" + clickedZoneId));
				V.Editor.Utils.loadTab('tab_object_from_web');
			}
		});

		$(container).find("a.addvideo").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'scrolling': 'no',
			'height': 600,
			'padding' : 0,
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				V.Editor.setCurrentArea($("#" + clickedZoneId));
				V.Editor.Utils.loadTab('tab_video_youtube');
			}
		});

		//Fancybox to create a new quiz
		$(container).find("a.addQuiz").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'scrolling': 'no',
			'height': 600,
			'padding' : 0,
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				V.Editor.setCurrentArea($("#" + clickedZoneId));
				V.Editor.Utils.loadTab('tab_quizzes');
			}
		});
	};


	//////////////
	// Event Listeners
	//////////////
	
	var handleBodyKeyDown = function(event){
		switch (event.keyCode) {
		case 39: // right arrow
			if(V.Editor.Slides.isSlideFocused()){
				if(V.Editor.Slideset.isSlideset(V.Slides.getCurrentSlide())){
					V.Editor.Slides.forwardOneSubslide();
				}
				event.preventDefault();
			}
			break;
		case 40: //down arrow	    
			if(V.Editor.Slides.isSlideFocused()){
				if(!_isCtrlKeyPressed){
					V.Slides.forwardOneSlide();
				} else {
					V.Slides.moveSlides(10);
				}
				event.preventDefault();
			}
			break;
		case 37: // left arrow
			if(V.Editor.Slides.isSlideFocused()){
				if(V.Editor.Slideset.isSlideset(V.Slides.getCurrentSlide())){
					V.Editor.Slides.backwardOneSubslide();
				}
				event.preventDefault();
			}
			break;
		case 38: //up arrow	
			if(V.Editor.Slides.isSlideFocused()){
				if(!_isCtrlKeyPressed){
					V.Slides.backwardOneSlide();
				} else {
					V.Slides.moveSlides(-10);
				}
				event.preventDefault();    		
			}
			break;
		case 17: //ctrl key
			_isCtrlKeyPressed = true;
			break;	
		case 67: //cKey
			if(V.Editor.Slides.isSlideFocused()){
				if(_isCtrlKeyPressed){
					if(V.Slides.getCurrentSlideNumber()){
						V.Editor.Clipboard.copy(V.Slides.getCurrentSlide(),V.Constant.Clipboard.Slide);
					}
				}
			}
			break;	
		case 86: //vKey
		    if(V.Editor.Slides.isSlideFocused()){
			    if(_isCtrlKeyPressed){
			    	V.Editor.Clipboard.paste();
		    	}
		    }
		    break;
		case 46: //Supr key
			if(V.Editor.Slides.isSlideFocused()){
				V.Editor.Slides.removeSlideKeyboard();
			}
			break;	
		}
	};

	var handleBodyKeyUp = function(event) {
	  switch (event.keyCode) {
	    case 17: //ctrl key
	    	_isCtrlKeyPressed = false;
	    	break;	     
	  }
	};

	var _exitConfirmation = function(){
		V.EventsNotifier.notifyEvent(V.Constant.Event.exit);
		
		if(_confirmOnExit){
			if(V.Editor.hasPresentationChanged()){
				if((V.Configuration.getConfiguration().mode===V.Constant.VISH)||(true)){
					var confirmationMsg = V.I18n.getTrans("i.exitConfirmation");
					return confirmationMsg;
				}
			}
		} else {
			return;
		}
	};

	var allowExitWithoutConfirmation = function(){
		_confirmOnExit = false;
	};


	////////////////
	// Unbind events
	////////////////

	var unbindEditorEventListeners = function(){
		if(_bindedEditorEventListeners){
			$(document).unbind('keydown', handleBodyKeyDown);
			$(document).unbind('keyup', handleBodyKeyUp);

			$(window.document).off('click', function(){
				window.focus();
			});

			if (_mobile){
				V.Editor.Events.Mobile.unbindEditorMobileEventListeners();
			}

			_bindedEditorEventListeners = false;
		}
	};
	

	return {
			init 							: init,
			bindEditorEventListeners		: bindEditorEventListeners,
			unbindEditorEventListeners		: unbindEditorEventListeners,
			addZoneThumbsEvents				: addZoneThumbsEvents,
			allowExitWithoutConfirmation 	: allowExitWithoutConfirmation
	};

}) (VISH,jQuery);