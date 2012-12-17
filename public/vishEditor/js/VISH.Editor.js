VISH.Editor = (function(V,$,undefined){
	
	//boolean to indicate if we are editing a previous presentation.
	var initialPresentation = false;

	//Store the initialOptions
	var initOptions;

	//Pointer to the currentZone
	var currentZone;

	//Prevent to load events multiple times.
	var eventsLoaded = false;

	//Confirm on exit
	var confirmOnExit;
	
	//drafPresentation uses:
	//* Store the presentation we are previewing
	//* Used when changing from presentation to flashcard
	//* Used when editing an presentation
	var draftPresentation = null;

	//savedPresentation uses:
	var savedPresentation = null;


	/**
	 * VISH editor initializer
	 * Adds the listeners to the click events in the different images and buttons
	 * Call submodule initializers
	 * options is a hash with params and options received from the server
	 * presentation is the presentation to edit (in not present, a new presentation is created)
	 */
	var init = function(options, presentation){
		VISH.Debugging.init(options);

		//first set VISH.Editing to true
		VISH.Editing = true;
		if(options){
			initOptions = options;
			if((options["configuration"])&&(VISH.Configuration)){
				VISH.Configuration.init(options["configuration"]);
				VISH.Configuration.applyConfiguration();
			}
		} else {
			initOptions = {};
		}
		
		VISH.Status.init();
		if(!VISH.Utils.checkMiniumRequirements()){
			return;
		}
		VISH.Utils.loadDeviceCSS();

		VISH.Dummies.init();
		VISH.Slides.init();
		VISH.User.init(options);

		if(VISH.Debugging.isDevelopping()){
			if ((options["configuration"]["mode"]=="noserver")&&(VISH.Debugging.getActionInit() == "loadSamples")&&(!presentation)) {
			 	presentation = VISH.Debugging.getPresentationSamples();
			}
		}

		//init age range slider, this has to be done BEFORE VISH.Editor.Renderer.init(presentation);
		$("#slider-range").slider({
	            range: true,
	            min: 0,
	            max: 30,
	            values: [ 4, 20 ],
	            slide: function( event, ui ) {
	                $( "#age_range" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
	            }
	    });
	    $("#age_range").val(VISH.Constant.AGE_RANGE);

		//If we have to edit
		if(presentation){
			initialPresentation = true;
			setPresentation(presentation);
			VISH.Editor.Renderer.init(presentation);
			//remove focus from any zone
			_removeSelectableProperties();					
		}

		
		// fancybox to create a new slide		
		$("a#addSlideFancybox").fancybox({
			'autoDimensions' : false,
			'scrolling': 'no',
			'width': 640,
			'height': 350,
			'padding': 0,
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				setCurrentArea($("#" + clickedZoneId));
				VISH.Utils.loadTab('tab_templates');
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
				VISH.Utils.loadTab('tab_quizes');
			}
		});
	
		if(!eventsLoaded){
			eventsLoaded = true;
				 
			$(document).on('click', '#edit_presentation_details', VISH.Editor.Tools.Menu.onSettings); 
			$(document).on('click', '#save', VISH.Editor.Tools.Menu.onSaveButtonClicked);
			$(document).on('click', '#pedagogical_clasification_button', VISH.Editor.Tools.Menu.onPedagogicalButtonClicked);
			$(document).on('click', '#save_presentation_details', VISH.Editor.Tools.Menu.onSavePresentationDetailsButtonClicked);
			$(document).on('click', '#done_in_pedagogical', VISH.Editor.Tools.Menu.onDonePedagogicalButtonClicked);

			$(document).on('click','.templatethumb', _onTemplateThumbClicked);
			$(document).on('click','.editable', _onEditableClicked);
			$(document).on('click','.selectable', _onSelectableClicked);
			$(document).on('click',':not(".selectable")', _onNoSelectableClicked);
			
			$(document).on('click','.delete_content', _onDeleteItemClicked);
			$(document).on('click','.delete_slide', _onDeleteSlideClicked);
			//arrows in button panel
			$(document).on('click','#arrow_left_div', _onArrowLeftClicked);
			$(document).on('click','#arrow_right_div', _onArrowRightClicked);

			$(document).on("click", "#fc_change_bg_big", V.Editor.Tools.changeFlashcardBackground);

			//used directly from SlideManager, if we separate editor from viewer that code would have to be in a common file used by editor and viewer
			_addEditorEnterLeaveEvents();

			VISH.Editor.Utils.redrawSlides();
			VISH.Editor.Thumbnails.redrawThumbnails();

			//if click on begginers tutorial->launch it
			_addTutorialEvents();

			//onbeforeunload event
			window.onbeforeunload = exitConfirmation;
			confirmOnExit = true;
		}
		
		if(presentation){
			//hide objects (the _onslideenterEditor event will show the objects in the current slide)
			$('.object_wrapper').hide();			
		}
		
		//Init submodules
		VISH.Editor.I18n.init(options["lang"]);
		VISH.Editor.Text.init();
		VISH.Editor.Image.init();
		VISH.Editor.Video.init();
		VISH.Editor.Object.init();
		VISH.Editor.Thumbnails.init();
		VISH.Editor.AvatarPicker.init();
		VISH.Editor.Quiz.init();
		VISH.Editor.Tools.init();
		VISH.Editor.Filter.init();
		VISH.Editor.Clipboard.init();

		VISH.Editor.Events.init();
		VISH.EventsNotifier.init();

		//Init Vish Editor Addons
		if(options.addons){
			VISH.Addons.init(options.addons);
		}
	};
	
	
	
	////////////////
	/// Helpers 
	////////////////

	var getOptions = function(){
		return initOptions;
	};	
	

	/**
	* Function to add a delete button to the element
	*/
	var addDeleteButton = function(element){
		element.append("<div class='delete_content'></div>");
	};
  

	

	//////////////////
	///    Events
	//////////////////
	
	/**
	* function to add the events to the help buttons to launch joy ride bubbles
	*/
 	var _addTutorialEvents = function(){
		$(document).on('click','#start_tutorial', function(){
			VISH.Editor.Tour.startTourWithId('initial_screen_help', 'top');
		});

		$(document).on('click','#help_right', function(){
			VISH.Editor.Tour.startTourWithId('menubar_help', 'top');
		});

		//flashcard
		$(document).on('click','#help_flashcard', function(){
			VISH.Editor.Tour.startTourWithId('fc_help', 'top');
		});

		//template
		$(document).on('click','#help_template_image', function(){			
			VISH.Editor.Tour.startTourWithId('template_help', 'bottom');
		});

		//Quiz
		$(document).on('click','#tab_quizes_help', function(){			
			VISH.Editor.Tour.startTourWithId('quiz_help', 'bottom');
		});

		//themes
		$(document).on('click','#help_themes_selection', function(){			
			VISH.Editor.Tour.startTourWithId('themes_help', 'bottom');
		});
		
		//template selection fancybox	
		$(document).on('click','#help_template_selection', function(){
			VISH.Editor.Tour.startTourWithId('help_template_selection_help', 'bottom');
		});	
		
		//image fancybox, one help button in each tab
		$(document).on('click','#tab_pic_from_url_help', function(){
			VISH.Editor.Tour.startTourWithId('images_fancy_tabs_id_help', 'top');
		});	
		$(document).on('click','#tab_pic_upload_help', function(){
			VISH.Editor.Tour.startTourWithId('upload_picture_form_help', 'top');
		});
		$(document).on('click','#tab_pic_repo_help', function(){
			VISH.Editor.Tour.startTourWithId('search_picture_help', 'bottom');
		});
		$(document).on('click','#tab_pic_flikr_help', function(){
			VISH.Editor.Tour.startTourWithId('search_flickr_fancy_help', 'bottom');
		});
		
		//object fancybox, one help button in each tab
		$(document).on('click','#tab_object_from_url_help', function(){
			VISH.Editor.Tour.startTourWithId('object_fancy_tabs_id_help', 'top');
		});	
		$(document).on('click','#tab_object_from_web_help', function(){
			VISH.Editor.Tour.startTourWithId('object_fancy_tabs_web_help', 'top');
		});
		$(document).on('click','#tab_object_upload_help', function(){
			VISH.Editor.Tour.startTourWithId('upload_object_form_help', 'top');
		});
		$(document).on('click','#tab_object_repo_help', function(){
			VISH.Editor.Tour.startTourWithId('search_object_help', 'bottom');
		});
		$(document).on('click','#tab_object_snapshot_help', function(){
			VISH.Editor.Tour.startTourWithId('object_fancy_tabs_websnapshot_help', 'bottom');
		});

		
		//video fancybox, one help button in each tab
		$(document).on('click','#tab_video_from_url_help', function(){
			VISH.Editor.Tour.startTourWithId('video_fancy_tabs_id_help', 'top');
		});	
		$(document).on('click','#tab_video_repo_help', function(){
			VISH.Editor.Tour.startTourWithId('search_video_help', 'top');
		});
		$(document).on('click','#tab_video_youtube_help', function(){
			VISH.Editor.Tour.startTourWithId('search_youtube_fancy_help', 'bottom');
		});
		$(document).on('click','#tab_video_vimeo_help', function(){
			VISH.Editor.Tour.startTourWithId('search_vimeo_fancy_help', 'bottom');
		});
		
		// live fancybox, one help button in each tab
		$(document).on('click','#tab_live_webcam_help', function(){
				VISH.Editor.Tour.startTourWithId('tab_live_webcam_id', 'bottom');
		});	
	};
  
	/**
	* function to add enter and leave events only for the VISH editor
	*/
	var _addEditorEnterLeaveEvents = function(){
		$('article').live('slideenter',_onslideenterEditor);
		$('article').live('slideleave',_onslideleaveEditor);
	};
  
	/**
	* function called when entering slide in editor, we have to show the objects
	*/
	var _onslideenterEditor = function(e){
		setTimeout(function(){
			$(e.target).find('.object_wrapper').show();
		},500);
		if($(e.target).hasClass("flashcard_slide")){
			V.Flashcard.startAnimation(e.target.id);
		}
		if($(e.target).hasClass("subslide")){
			setTimeout(function(){
				if($(e.target).hasClass('object')){
					V.ObjectPlayer.loadObject($(e.target));
				}
				else if($(e.target).hasClass('applet')){
					V.AppletPlayer.loadApplet($(e.target));
				}
				else if($(e.target).hasClass('snapshot')){
	        		V.SnapshotPlayer.loadSnapshot($(e.target));
	      		}
			},500);
			
			V.VideoPlayer.HTML5.playVideos(e.target);

			if($(e.target).hasClass("flashcard_slide") || $(e.target).hasClass("virtualTour_slide")){
				$("#forward_arrow").css("top", "15%");				
			}
			if($(e.target).hasClass("flashcard_slide")){
				V.Flashcard.startAnimation(e.target.id);
			}
		}
	};
  
	/**
	* function called when leaving slide in editor, we have to hide the objects
	*/
	var _onslideleaveEditor = function(e){
		//radical way
		$('.object_wrapper').hide();
		if($(e.target).hasClass("flashcard_slide")){
			V.Flashcard.stopAnimation(e.target.id);
		}
		if($(e.target).hasClass("subslide")){
			V.VideoPlayer.HTML5.stopVideos(e.target);
			V.ObjectPlayer.unloadObject(e.target);
			V.AppletPlayer.unloadApplet();		
			if($(e.target).hasClass("flashcard_slide") || $(e.target).hasClass("virtualTour_slide")){
				$("#forward_arrow").css("top", "0%");
			}
			if($(e.target).hasClass("flashcard_slide")){
				V.Flashcard.stopAnimation(e.target.id);
			}
		}
	};
  


	/**
	 * function called when user clicks on template
	 * Includes a new slide following the template selected
	 */
	var _onTemplateThumbClicked = function(event){
		var theid = draftPresentation ? draftPresentation.id : "";
		var slide = VISH.Dummies.getDummy($(this).attr('template'), VISH.Slides.getSlides().length, theid, false);	
		VISH.Editor.Utils.addSlide(slide);
		$.fancybox.close();
		VISH.Editor.Utils.redrawSlides();		
		VISH.Editor.Thumbnails.redrawThumbnails();
		setTimeout("VISH.Slides.lastSlide()", 300);	
	};

	/**
	 * Function called when user clicks on an editable element
	 * Event launched when an editable element belonging to the slide is clicked
	 */
	var _onEditableClicked = function(event){
		//first remove the "editable" class because we are going to add clickable icons there and we don´t want it to be editable any more
		$(this).removeClass("editable");
		setCurrentArea($(this));
				
		//need to clone it, because we need to show it many times, not only the first one
		//so we need to remove its id		
		var content = $("#menuselect").clone().attr('id','current_menu');

		$(content).find("a").css("display","none");
		$(content).find("a.all").css("display","inline");

		switch($(this).attr("size")){
			case VISH.Constant.EXTRA_SMALL:
				$(content).find("a.small").css("display","inline");
				$(content).find("a > div").addClass("thumb_extra_small");
				break;
			case VISH.Constant.SMALL:
				$(content).find("a.small").css("display","inline");
				$(content).find("a > div").addClass("thumb_small");
				break;
			case VISH.Constant.MEDIUM:
				$(content).find("a.medium").css("display","inline");
				$(content).find("a > div").addClass("thumb_medium");
				break;
			case VISH.Constant.LARGE:
				$(content).find("a.large").css("display","inline");
				$(content).find("a > div").addClass("thumb_large");
				break;
		}

		$(this).html(content);

		$("a.addpicture").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'scrolling': 'no',
			'height': 600,
			'padding' : 0,
			"onStart"  : function(data) {
				//re-set the current area to the clicked zone, because maybe the user have clicked in another editable zone before this one
				var clickedZoneId = $(data).attr("zone");
				setCurrentArea($("#" + clickedZoneId));
				V.Editor.Image.setAddContentMode(VISH.Constant.NONE);
				VISH.Utils.loadTab('tab_pic_from_url');
			}
		});
		$("a.addobject").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'height': 600,
			'scrolling': 'no',
			'padding' : 0,
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				setCurrentArea($("#" + clickedZoneId));
				VISH.Utils.loadTab('tab_object_from_url');
			}
		});
		$("a.addvideo").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'scrolling': 'no',
			'height': 600,
			'padding' : 0,
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				setCurrentArea($("#" + clickedZoneId));
				VISH.Utils.loadTab('tab_video_from_url');
			}
		});
		$("a.addLive").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'scrolling': 'no',
			'height': 600,
			'padding' : 0,
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				setCurrentArea($("#" + clickedZoneId));
				VISH.Utils.loadTab('tab_live_webcam');
			}
		});

		$("a.addQuiz").click(function(event){
			$("a#addQuizFancybox").trigger("click");
		});

	}; 


	/**
	* function called when user clicks on the delete icon of the zone
	*/
	var _onDeleteItemClicked = function(){
		setCurrentArea($(this).parent());
		$("#image_template_prompt").attr("src", VISH.ImagesPath + getCurrentArea().attr("type") + ".png");
		$.fancybox(
			$("#prompt_form").html(),
			{
				'autoDimensions'	: false,
				'scrolling': 'no',
				'width'         	: 350,
				'height'        	: 150,
				'showCloseButton'	: false,
				'padding' 			: 0,
				'onClosed'			: function(){
					//if user has answered "yes"
					if($("#prompt_answer").val() ==="true"){
						$("#prompt_answer").val("false");
						getCurrentArea().html("");
						getCurrentArea().removeAttr("type");
						getCurrentArea().addClass("editable");
					}
				}
			}
		);
	};
  
  /**
   * function called when user delete a slide
   */
	var _onDeleteSlideClicked = function(){
		var article_to_delete = $(this).parent();
		$("#image_template_prompt").attr("src", VISH.ImagesPath + "templatesthumbs/" + article_to_delete.attr("template") + ".png");
		$.fancybox(
		$("#prompt_form").html(),
			{
				'autoDimensions'	: false,
				'width'         	: 350,
				'scrolling': 'no',
				'height'        	: 150,
				'showCloseButton'	: false,
				'padding' 			: 0,
				'onClosed'			: function(){
				  //if user has answered "yes"
					if($("#prompt_answer").val() ==="true"){						
						$("#prompt_answer").val("false");  
            			VISH.Slides.removeSlide(VISH.Slides.getCurrentSlideNumber());		
					}
				}
			}
		);
	};



	/**
	* function called when user clicks on template zone with class selectable
	*/
	var _onSelectableClicked = function(event){
		selectArea($(this));
		event.stopPropagation();
		event.preventDefault();
	};
  
  	var selectArea = function(area){
  		setCurrentArea(area);	
		_removeSelectableProperties(area);
		_addSelectableProperties(area);
		VISH.Editor.Tools.loadToolsForZone(area);
  	}
  
   /**
	* Function called when user clicks on any element without class selectable
	*/
	var _onNoSelectableClicked = function(event){
		
		//Add class 'noSelectableElement' to a element to call _onNoSelectableClicked without restrictions
		if(!$(event.target).hasClass("noSelectableElement")){

			//No hide toolbar when we are working in a fancybox
			if($("#fancybox-content").is(":visible")){
				return;
			}

			//No hide toolbar for selectable childrens
			if($(event.target).parent().hasClass("selectable")){
				return;
			}

			//Enable toolbar actions
			if (jQuery.contains($("#toolbar_wrapper")[0],event.target)){
				return;
			}

			if(event.target.id==="toolbar_wrapper"){
				return;
			}

			//NiceEditor menu: font and size selection
			if(event.target.tagName==="FONT"){
				return;
			}
		}

		// VISH.Debugging.log(event.target);
		setCurrentArea(null);
		VISH.Editor.Tools.cleanZoneTools();
	};
	
	var _addSelectableProperties = function(zone){
		//add selectable css
		$(zone).css("cursor", "auto");
		$(zone).css("border-color", "rgb(255, 2, 94)");
		$(zone).css("-webkit-box-shadow", "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 100, 100, 0.6)");
		$(zone).css("-moz-box-shadow", "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 100, 100, 0.6)");
		$(zone).css("box-shadow", "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 100, 100, 0.6)");
		$(zone).css("outline", "0");
		$(zone).css("outline", "thin dotted \9");
	};
	
	var _removeSelectableProperties = function(zone){
		//Remove selectable css
		$(".selectable").css("border-color", "none");
		$(".selectable").css("-webkit-box-shadow", "none");
		$(".selectable").css("-moz-box-shadow", "none");
		$(".selectable").css("box-shadow", "none");
		$(".selectable").css("outline", "0");
		$(".selectable").css("cursor", "pointer");
	};

	
	
	/**
	* function to save the presentation
	* 
	* forcePresentation is a boolean to indicate if we should force type to presentation, although we might be in flashcard
	* It is used for preview in the flashcard
	*/
	var savePresentation = function(forcePresentation){
		//first of all show all objects that have been hidden because they are in previous and next slides
		//so they are not saved with style hidden
		$('.object_wrapper').show();

		//now save the presentation
		var presentation = {};
		presentation.VEVersion = VISH.VERSION;
		if(draftPresentation){
			presentation.id = draftPresentation.id;
		}else{
			presentation.id = '';	
		}

		if(forcePresentation){
			presentation.type = "presentation";
		} else {
			presentation.type = getPresentationType();
		}

		if(draftPresentation){
			presentation.title = draftPresentation.title;
			presentation.description = draftPresentation.description;
			presentation.avatar = draftPresentation.avatar;
			presentation.tags = draftPresentation.tags;
			presentation.theme = draftPresentation.theme;
			presentation.age_range = draftPresentation.age_range;
			presentation.subject = draftPresentation.subject;
			presentation.language = draftPresentation.language;
			presentation.educational_objectives = draftPresentation.educational_objectives;
			presentation.adquired_competencies = draftPresentation.adquired_competencies;
		}
		presentation.author = '';
		presentation.slides = [];

		var slide = {};
		if(presentation.type==="flashcard"){
			slide.id = $("#flashcard-background").attr("flashcard_id");
			slide.type = "flashcard";
			slide.background = $("#flashcard-background").css("background-image");
			//save the pois
			slide.pois = VISH.Editor.Flashcard.savePois();
			slide.slides = [];
			presentation.slides.push(slide);
		}


		slide = {};
		$('.slides > article').each(function(index,s){
			slide.id = $(s).attr('id'); //TODO what if saved before!
			slide.type = $(s).attr('type');
			if(slide.type === V.Constant.FLASHCARD){
				//if it is a flashcard slide, it can't be modified in the editor, so we take it from slideEls
				for(index in draftPresentation.slides){
					if(draftPresentation.slides[index].id === slide.id){
						slide = draftPresentation.slides[index];
						break;
					}
				}
				presentation.slides.push(slide);
				slide = {};
				return true; //equivalent to continue in an each loop
			}
			slide.template = $(s).attr('template');
			slide.elements = [];
			var element = {};

			//important show it (the browser does not know the height and width if it is hidden)
			$(s).addClass("temp_shown");
			$(s).find('div').each(function(i,div){
				
				if($(div).attr("areaid") !== undefined){   

					element.id 		= $(div).attr('id');
					element.type 	= $(div).attr('type');
					element.areaid 	= $(div).attr('areaid');	 				 
						 
					if(element.type=="text"){
						//NicEditor version
						element.body   = VISH.Editor.Text.changeFontPropertiesToSpan($(div).find(".wysiwygInstance"));
					} else if(element.type=="image"){
						element.body   = $(div).find('img').attr('src');
						element.style  = VISH.Editor.Utils.getStylesInPercentages($(div), $(div).find('img'));
						if($(div).attr("hyperlink")){
							element.hyperlink = $(div).attr("hyperlink");
						}
					} else if(element.type=="video"){
						var video = $(div).find("video");
						element.poster = $(video).attr("poster");
						element.style  = VISH.Editor.Utils.getStylesInPercentages($(div), $(video));
						//Sources
						var sources= '';				
						$(video).find('source').each(function(index, source) {
							if(index!=0){
								sources = sources + ',';
							}
							var type = (typeof $(source).attr("type") != "undefined")?' "type": "' + $(source).attr("type") + '", ':''
							sources = sources + '{' + type + '"src": "' + $(source).attr("src") + '"}'
						});
						sources = '[' + sources + ']'
						element.sources = sources;
					} else if(element.type=="object"){
						var object = $(div).find(".object_wrapper").children()[0];
						var myObject = $(object).clone();
						$(myObject).removeAttr("style");
						element.body   = VISH.Utils.getOuterHTML(myObject);
						element.style  = VISH.Editor.Utils.getStylesInPercentages($(div), $(object).parent());
						var zoom = VISH.Utils.getZoomFromStyle($(object).attr("style"));
						if(zoom!=1){
							element.zoomInStyle = VISH.Utils.getZoomInStyle(zoom);
						}
					} else if (element.type =="quiz") {
						var	quizQuestion = $(div).find(".value_multiplechoice_question_in_zone");
						element.question = VISH.Editor.Text.changeFontPropertiesToSpan($(quizQuestion));
						if($(div).find(".multiplechoice_option_in_zone")) {
							element.quiz_id = "";
							if ($(div).find("input[name=quiz_id]").val()!="") {
								element.quiz_id = $(div).find("input[name=quiz_id]").val();
							} 
							element.quiztype = "multiplechoice";
							element.options = {};  	
							element.options.choices = []; 
							$(div).find('.multiplechoice_option_in_zone').each(function(i, option_text){
								var option = VISH.Editor.Text.changeFontPropertiesToSpan(option_text);
								if((option)&&($(option_text).text() != 'Write options here')&& ($(option_text).text() !="")){
									result = VISH.Editor.Text.changeFontPropertiesToSpan(option_text);
									var choice = new Object();
									choice.value = $(option_text).text();
									choice.container = VISH.Editor.Text.changeFontPropertiesToSpan($(option_text));
									element.options.choices.push(choice);
								}
							});
						}
					} else if(element.type === "snapshot"){
						var snapshotWrapper = $(div).find(".snapshot_wrapper");
						var snapshotIframe = $(snapshotWrapper).children()[0];
						$(snapshotIframe).removeAttr("style");
						element.body   = VISH.Utils.getOuterHTML(snapshotIframe);
						element.style  = VISH.Editor.Utils.getStylesInPercentages($(div), snapshotWrapper);
						element.scrollTop = $(snapshotWrapper).scrollTop();
						element.scrollLeft = $(snapshotWrapper).scrollLeft();
					} else if(typeof element.type == "undefined"){
						//Empty element, we don't save as empty text because if we do that when we edit everything is text
						//element.type = "empty";
						// VISH.Debugging.log("Empty element");
					}

					slide.elements.push(element);
					if(element.type=="quiz"){
						var quizSlide = $.extend(true, new Object(), element);
						//Apply presentation Wrapper
						var quizPresentation = new Object();
						quizPresentation.title = presentation.title;
						quizPresentation.description = presentation.description;
						quizPresentation.author = '';
					    quizPresentation.slides = [quizSlide];
						quizPresentation.type = "quiz_simple";
						element.quiz_simple_json = quizPresentation;
					}

					element = {};
				}
			
				
			});

			if(presentation.type==="flashcard"){
				//if it is flashcard we save the slide into the flashcard slides (the flashcard is the first slide by convention)
				presentation.slides[0].slides.push(slide);
			}
			else{
				presentation.slides.push(slide);
			}
			
			slide = {};
			$(s).removeClass("temp_shown");						
		});

		savedPresentation = presentation;  
		  
		VISH.Debugging.log("\n\nVish Editor save the following presentation:\n")
		VISH.Debugging.log(JSON.stringify(presentation));
		return savedPresentation; 
	};
	

	var afterSavePresentation = function(presentation, order){
		switch(VISH.Configuration.getConfiguration()["mode"]){
			case VISH.Constant.NOSERVER:
				//Ignore order param for developping
				if((VISH.Debugging)&&(VISH.Debugging.isDevelopping())){
					if(VISH.Debugging.getActionSave()=="view"){
						VISH.Debugging.initVishViewer();
					} else if (VISH.Debugging.getActionSave()=="edit") {
						VISH.Debugging.initVishEditor();
					}
				}
				break;
			case VISH.Constant.VISH:
				var send_type;
		        if(initialPresentation){
		          send_type = 'PUT'; //if we are editing
		        } else {  
		          send_type = 'POST'; //if it is a new
		        } 

		        var draft = (order==="draft");
		        
		        //POST to http://server/excursions/
		        var jsonPresentation = JSON.stringify(presentation);  
		        var params = {
		          "excursion[json]": jsonPresentation,
		          "authenticity_token" : initOptions["token"],
		          "draft": draft
		        }
		        
		        $.ajax({
		          type    : send_type,
		          url     : VISH.UploadPresentationPath,
		          data    : params,
		          success : function(data) {
		          	  allowExitWithoutConfirmation();
		          	  window.top.location.href = data.url;
		          }     
		        });
				break;
			case VISH.Constant.STANDALONE:
				//Order is always save, ignore order param
				uploadPresentationWithNode(presentation);
				break;
		}
	}
	

	var uploadPresentationWithNode = function(presentation){
		var send_type;
		var url = VISH.UploadPresentationPath;

		if(draftPresentation){
			send_type = 'PUT'; //if we are editing
			url = url + draftPresentation.id;
		} else {
			send_type = 'POST'; //if it is a new
		} 
	       
		//POST to /server/presentation/
		var jsonPresentation = JSON.stringify(presentation);   
		var params = {
			"presentation[json]": jsonPresentation
		}
		   
		$.ajax({
			type    : send_type,
			url     : url,
			data    : params,
			success : function(data) {
				//Redirect
				allowExitWithoutConfirmation();
				window.top.location.href = data.url;
			}
		});
	};



	
	/**
	 * Function to move the slides left one item
	 */
	var _onArrowLeftClicked = function(){
		VISH.Slides.backwardOneSlide();
	};
	
	/**
	 * Function to move the slides right one item
	 */
	var _onArrowRightClicked = function(){
		VISH.Slides.forwardOneSlide();
	};
	
	
	//////////////////
	///    Getters
	//////////////////

	/**
	 * function to get the template of the slide of current_el
	 * param area: optional param indicating the area to get the template, used for editing presentations
	 */
	var getTemplate = function(area) {
		if(area){
			return area.parent().attr('template');
		}	else if(getCurrentArea()){
			return getCurrentArea().parent().attr('template');
		}
		return null;
	}
	
	var getCurrentArea = function() {
		if(currentZone){
			return currentZone;
		}
		return null;
	}
	
	var setCurrentArea = function(area){
		currentZone = area;
	}

	var getPresentation = function() {
		return draftPresentation;
	}

	var setPresentation = function(presentation) {
		draftPresentation = presentation;
	}

	var getSavedPresentation = function() {
		if(savedPresentation){
			return savedPresentation;
		} else {
			return null;
		}
	}

	var hasInitialPresentation = function(){
		return initialPresentation;
	}
	
	/*
	 * Load the initial fancybox
	 */
	var loadFancyBox = function(fancy) {
		var fancyBoxes = {1: "templates", 2: "quizes"}	
				
		for( tab in fancyBoxes) {
			$('#tab_'+fancyBoxes[tab]+'_content').hide();
			$('#tab_'+fancyBoxes[tab]).attr("class", "");
			$('#tab_'+fancyBoxes[tab]).attr("class", "fancy_tab");
		} 
		//just show the fancybox selected 
		$('#tab_'+fancy+'_content').show();
		$('#tab_'+fancy).attr("class", "fancy_tab fancy_selected");
	}

	/*
	 * type can be "presentation", "flashcard" or "game"
	 */
	var getPresentationType = function(){
		if((!draftPresentation)||(!draftPresentation.type)){
			return "presentation";
		}
		return draftPresentation.type;
	};

	var setPresentationType  = function(type){
		if(!draftPresentation){
			draftPresentation = new Object();
		}
		if(type){
			draftPresentation.type = type;
		} else {
			draftPresentation.type = "presentation";
		}
	};

	/*
	 * Check if a presentation is standard.
	 * true when only contain standard slides.
	 * false when contains other slide types like flashcards, games or virtual experiments.
	 */
	var isPresentationStandard = function(presentation){
		if(presentation){
			//Eval presentation
			return _isThisPresentationStandard(presentation);
		} else {
			//Eval current presentation

			if($("article[template]").length===0){
				//Empty presentation, optimization for first call
				return true;
			}
			return _isThisPresentationStandard(savePresentation());
		}
	}

	var _isThisPresentationStandard = function(presentation){
		if(presentation.type!="presentation"){
			return false;
		}
		var isStandard = true;
		$.each(presentation.slides, function(index, slide) {
			if((slide.type)&&(slide.type!="standard")){
				isStandard = false;
				return false;
			}
		});
		return isStandard;
	}

	/*
	 * Returns if the server has checked the presentation has a draft.
	 */
	var isPresentationDraft = function(){
		if(initialPresentation){
			//Look for options["draft"]
			if((initOptions["draft"])&&(typeof initOptions["draft"] === "boolean")){
				return initOptions["draft"];
			} else {
				//Server must indicate explicity that this presentation is a draft with the "draft" option.
				return false;
			}
		} else {
			//New presentation created, draft by default.
			return true;
		}
	}


	var exitConfirmation = function(){
		if((VISH.Configuration.getConfiguration()["mode"]===VISH.Constant.VISH)&&(confirmOnExit)){
			return VISH.Editor.I18n.getTrans("i.exitConfirmation");
		} else {
			return
		}
	}

	var allowExitWithoutConfirmation = function(){
		confirmOnExit = false;
	}


	return {
		init 					: init,
		addDeleteButton 		: addDeleteButton,
		getTemplate 			: getTemplate,
		getCurrentArea 			: getCurrentArea,
		getPresentationType		: getPresentationType,
		getOptions 				: getOptions, 
		loadFancyBox 			: loadFancyBox,
		getPresentation 		: getPresentation,
		setPresentation 		: setPresentation,
		isPresentationStandard 	: isPresentationStandard,
		isPresentationDraft		: isPresentationDraft,
		getSavedPresentation 	: getSavedPresentation,
		hasInitialPresentation	: hasInitialPresentation,
		savePresentation 		: savePresentation,
		afterSavePresentation  	: afterSavePresentation,
		setPresentationType 	: setPresentationType,
		allowExitWithoutConfirmation	: allowExitWithoutConfirmation, 
		setCurrentArea			: setCurrentArea,
		selectArea				: selectArea
	};

}) (VISH, jQuery);
