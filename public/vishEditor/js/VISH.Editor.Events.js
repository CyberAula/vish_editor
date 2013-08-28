VISH.Editor.Events = (function(V,$,undefined){
	
	var bindedEventListeners = false;
	//Confirm on exit web app
	var confirmOnExit;
	//Ctrl key
	var ctrlDown = false;


	var init = function() {
		bindEditorEventListeners();
	};

   var bindEditorEventListeners = function(){
		if((!bindedEventListeners)&&(V.Editing)){
			var presentation = V.Editor.getPresentation();

			$(document).on('click', '#addSlideButton', V.Editor.Tools.Menu.insertSlide);
			$(document).on('click', '#addSlideButtonOnSubslides', V.Editor.Tools.Menu.insertSubslide);
			$(document).on('click', '#importButton', V.Editor.Tools.Menu.insertPDFex);

			$(document).on('click', '#subslide_selected_img', V.Editor.Slideset.onClickOpenSlideset);
			
			$(document).on('click', '#presentation_details_preview_thumbnail_img', V.Editor.Settings.onChangeThumbnailClicked);
			$(document).on('click', '#pedagogical_clasification_button', V.Editor.Settings.onPedagogicalButtonClicked);
			$(document).on('click', '#done_in_pedagogical', V.Editor.Settings.onDonePedagogicalButtonClicked);
			$(document).on('click', '#save_presentation_details', V.Editor.Settings.onSavePresentationDetailsButtonClicked);

			$(document).on('click','div.slidethumb', V.Editor.onSlideThumbClicked);
			$(document).on('click','.editable', V.Editor.onEditableClicked);
			$(document).on('click','.selectable', V.Editor.onSelectableClicked);
			$(document).on('click',':not(".selectable")', V.Editor.onNoSelectableClicked);
			
			$(document).on('click','.delete_content', V.Editor.onDeleteItemClicked);
			$(document).on('click','.delete_slide', V.Editor.onDeleteSlideClicked);

			$(document).on("click", ".change_bg_button", V.Editor.Tools.changeBackground);

			$(document).bind('keydown', handleBodyKeyDown);
			$(document).bind('keyup', handleBodyKeyUp);

			// Slide Enter and Leave events
			$('article').live('slideenter', V.Editor.onSlideEnterEditor);
			$('article').live('slideleave', V.Editor.onSlideLeaveEditor);

			//Tutorial events
			_addTutorialEvents();


			//Fancyboxes

			// fancybox to create a new slide
			$("a#addSlideFancybox").fancybox({
				'autoDimensions' : false,
				'scrolling': 'no',
				'width': 800,
				'height': 600,
				'padding': 0,
				"onStart"  : function(data) {
					var slidesAddMode = V.Editor.getContentAddMode();
					if(slidesAddMode===V.Constant.NONE){
						V.Editor.setContentAddMode(V.Constant.STANDARD);
					}

					if(slidesAddMode===V.Constant.SLIDESET){
						//Hide smartcards, show templates only
						$(".tab_slides_smartcards").hide();
						$("#tab_pdfex").parent().hide();
						$("#tab_presentations_repo").parent().hide();
						$("#tab_smartcards_repo").parent().hide();
					}

					var clickedZoneId = $(data).attr("zone");
					V.Editor.setCurrentArea($("#" + clickedZoneId));
					V.Editor.Utils.loadTab('tab_slides');
				},
				"onClosed"  : function(data) {
					$(".tab_slides_smartcards").show();
					$("#tab_pdfex").parent().show();
					$("#tab_presentations_repo").parent().show();
					$("#tab_smartcards_repo").parent().show();
					V.Editor.setContentAddMode(V.Constant.NONE);
				}
			});	

			// fancybox to create a new quiz		
			$("a#addQuizFancybox").fancybox({
				'autoDimensions' : false,
				'scrolling': 'no',
				'width': 385,
				'height': 340,
				'padding': 0,
				"onStart"  : function(data) {
					V.Editor.Utils.loadTab('tab_quizes');
				}
			});

			// fancybox to insert JSON	
			$("a#addJSONFancybox").fancybox({
				'autoDimensions' : false,
				'scrolling': 'no',
				'width': 800,
				'height': 300,
				'padding' : 0,
				"onComplete"  : function(data) {
					V.Editor.Utils.loadTab('tab_json_file');
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
						$("#fancybox-outer").css("background", "rgba(255,255,255,0.9)");
						$("#fancybox-wrap").css("margin-top", "20px");
						$("#fancybox-wrap").css("margin-left", "20px");
				},
				'onClosed' : function(data) {
						$("#fancybox-outer").css("background", "white");
				}
			});

			//Change flashcard background
			$("#hidden_button_to_launch_picture_fancybox_for_flashcard").fancybox({
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
					$("#tab_pic_thumbnails").show();
					V.Editor.Utils.loadTab('tab_pic_thumbnails');
				},
				"onClosed" : function(data){
					$("#tab_pic_thumbnails").hide();
					V.Editor.Image.setAddContentMode(V.Constant.NONE);
				}
			});

			//onbeforeunload event
			window.onbeforeunload = _exitConfirmation;
			confirmOnExit = true;

			//Allow keyboard events with the first click
			$(window.document).on('click', function(){
				window.focus();
			});

			bindedEventListeners = true;
		}
	};

	
	/**
	* Tutorial
	* Function to add the events to the help buttons to launch joy ride bubbles
	*/
	var _addTutorialEvents = function(){
		$(document).on('click','#start_tutorial', function(){
			V.Tour.startTourWithId('initial_screen_help', 'top');
		});

		$(document).on('click','#help_right', function(){
			V.Tour.startTourWithId('menubar_help', 'top');
		});

		//template
		$(document).on('click','.help_in_template', function(){
			V.Tour.startTourWithId('template_help', 'bottom');
		});

		//flashcard
		$(document).on('click','.help_in_flashcard', function(){
			V.Tour.startTourWithId('fc_help', 'top');
		});

		//VirtualTour
		$(document).on('click','.help_in_vt', function(){
			V.Tour.startTourWithId('vt_help', 'top');
		});

		//vtour
		$(document).on('click','#help_vtour', function(){
			V.Tour.startTourWithId('vt_help', 'top');
		});

		//add slides
		$(document).on('click','.help_addslides_selection', function(){			
			V.Editor.Tour.startTourWithId('help_addslides_selection_help', 'bottom');
		});

		//Quiz
		$(document).on('click','#tab_quizes_help', function(){			
			V.Tour.startTourWithId('quiz_help', 'bottom');
		});

		//themes
		$(document).on('click','#help_themes_selection', function(){			
			V.Tour.startTourWithId('themes_help', 'bottom');
		});
		
		//template selection fancybox	
		$(document).on('click','#help_template_selection', function(){
			V.Tour.startTourWithId('help_template_selection_help', 'bottom');
		});	

		//pedagogical options fancybox	
		$(document).on('click','#help_pedagogical_selection', function(){
			V.Tour.startTourWithId('help_pedagogical_selection_help', 'bottom');
		});	

		//template selection fancybox	
		$(document).on('click','#help_excursion_selection', function(){
			V.Tour.startTourWithId('help_excursion_selection_help', 'bottom');
		});	

		//template selection fancybox	
		$(document).on('click','#help_smartcard_selection', function(){
			V.Tour.startTourWithId('help_smartcard_selection_help', 'bottom');
		});	
		
		//image fancybox, one help button in each tab
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
		
		//object fancybox, one help button in each tab
		$(document).on('click','#tab_object_from_url_help', function(){
			V.Tour.startTourWithId('object_fancy_tabs_id_help', 'top');
		});
		$(document).on('click','#tab_object_from_web_help', function(){
			V.Tour.startTourWithId('object_fancy_tabs_web_help', 'top');
		});
		$(document).on('click','#tab_object_upload_help', function(){
			V.Tour.startTourWithId('upload_object_form_help', 'top');
		});
		$(document).on('click','#tab_object_repo_help', function(){
			V.Tour.startTourWithId('search_object_help', 'bottom');
		});
		$(document).on('click','#tab_object_snapshot_help', function(){
			V.Tour.startTourWithId('object_fancy_tabs_websnapshot_help', 'bottom');
		});
		
		//video fancybox, one help button in each tab
		$(document).on('click','#tab_video_from_url_help', function(){
			V.Tour.startTourWithId('video_fancy_tabs_id_help', 'top');
		});
		$(document).on('click','#tab_video_repo_help', function(){
			V.Tour.startTourWithId('search_video_help', 'top');
		});
		$(document).on('click','#tab_video_youtube_help', function(){
			V.Tour.startTourWithId('search_youtube_fancy_help', 'bottom');
		});
		$(document).on('click','#tab_video_vimeo_help', function(){
			V.Tour.startTourWithId('search_vimeo_fancy_help', 'bottom');
		});
		
		// live fancybox, one help button in each tab
		$(document).on('click','#tab_live_webcam_help', function(){
			V.Tour.startTourWithId('tab_live_webcam_id', 'bottom');
		});	
	};


	//////////////
	// Event Listeners
	//////////////
	
	var handleBodyKeyDown = function(event) {
		switch (event.keyCode) {
		case 39: // right arrow
		case 40: //down arrow	    
			if(V.Editor.Slides.isSlideFocused()) {
				if(!ctrlDown){
					V.Slides.forwardOneSlide();
				} else {
					V.Slides.moveSlides(10);
				}
				event.preventDefault();
			}
			break;
		case 37: // left arrow
		case 38: //up arrow	
			if(V.Editor.Slides.isSlideFocused()) {
				if(!ctrlDown){
					V.Slides.backwardOneSlide();
				} else {
					V.Slides.moveSlides(-10);
				}
				event.preventDefault();    		
			}
			break;
		case 17: //ctrl key
			ctrlDown = true;
			break;	
		case 67: //cKey
			if(V.Editor.Slides.isSlideFocused()) {
				if(ctrlDown){
					if(V.Slides.getCurrentSlideNumber()){
						V.Editor.Clipboard.copy(V.Slides.getCurrentSlide(),V.Constant.Clipboard.Slide);
					}
				}
			}
			break;	
		case 86: //vKey
		    if(V.Editor.Slides.isSlideFocused()) {
			    if(ctrlDown){
			    	V.Editor.Clipboard.paste();
		    	}
		    }
		    break;
		case 46: //Supr key
			if(V.Editor.Slides.isSlideFocused()) {
				V.Editor.Slides.removeSlide(V.Slides.getCurrentSlideNumber());
			}
			break;	
		}
	};

	var handleBodyKeyUp = function(event) {
	  switch (event.keyCode) {
	    case 17: //ctrl key
	    	ctrlDown = false;
	    	break;	     
	  }
	};

	var _exitConfirmation = function(){
		if((V.Configuration.getConfiguration().mode===V.Constant.VISH)&&(confirmOnExit)){
			return V.Editor.I18n.getTrans("i.exitConfirmation");
		} else {
			return;
		}
	};

	var allowExitWithoutConfirmation = function(){
		confirmOnExit = false;
	};


	////////////////
	// Unbind events
	////////////////

	var unbindEditorEventListeners = function(){
		if(bindedEventListeners){
			$(document).unbind('keydown', handleBodyKeyDown);
			$(document).unbind('keyup', handleBodyKeyUp);

			$(window.document).off('click', function(){
				window.focus();
			});

			bindedEventListeners = false;

			//TODO...
		}
	};
	

	return {
			init 							: init,
			bindEditorEventListeners		: bindEditorEventListeners,
			unbindEditorEventListeners		: unbindEditorEventListeners,
			allowExitWithoutConfirmation 	: allowExitWithoutConfirmation
	};

}) (VISH,jQuery);