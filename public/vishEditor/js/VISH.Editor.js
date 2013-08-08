/**
 * ViSH Editor
 * @namespace VISH
 * @class Editor
 */
VISH.Editor = (function(V,$,undefined){
	
	//boolean to indicate if we are editing a previous presentation.
	var initialPresentation = false;

	//Store the initialOptions
	var initOptions;

	//Pointers to the current and last zone
	var currentZone;
	var lastZone;
	
	//drafPresentation uses:
	//* Store the presentation we are previewing
	//* Used when editing a presentation
	var draftPresentation = null;

	//savedPresentation contains the JSON of the saved presentation
	var savedPresentation = null;

	//Content mode to add slides
	var contentAddModeForSlides = V.Constant.NONE;
	//Tmp var to store slide to delete
	var article_to_delete;


	/**
	 * VISH Editor initializer.
	 * Adds the listeners to the click events in the different images and buttons of the UI.
	 * Call submodule initializers.
	 *
	 * @param {hashTable} options Hash with params and options received from the server.
	 * @param {JSONObject} presentation Presentation to edit (if not present, a new presentation is created).
	 *
	 * @method init
	 */
	var init = function(options, presentation){
		V.Editing = true;

		V.Debugging.init(options);
		
		if(options){
			initOptions = options;
			if((options.configuration)&&(V.Configuration)){
				V.Configuration.init(options.configuration);
				V.Configuration.applyConfiguration();
			}
		} else {
			initOptions = {};
		}
		
		// V.Storage.setTestingMode(true);
		
		V.Utils.init();
		V.Status.init(function(){
			//Status loading finishes
			_initAferStatusLoaded(options,presentation);
		});
	}

	var _initAferStatusLoaded = function(options,presentation){
		if(!V.Utils.checkMiniumRequirements()){
			return;
		}
		V.Utils.loadDeviceCSS();
		V.Editor.I18n.init(options.lang);
		V.Editor.Dummies.init();
		V.EventsNotifier.init();
		V.Editor.Themes.init();
		V.Flashcard.init();
		V.VirtualTour.init();
		V.Editor.Slideset.init();
		V.Editor.Presentation.init();
		V.Editor.Flashcard.init();
		V.Editor.VirtualTour.init();
		V.Renderer.init();
		V.Slides.init();
		V.User.init(options);
		V.Editor.LRE.init(options.lang);

		if(V.Debugging.isDevelopping()){
			if ((options.configuration.mode==V.Constant.NOSERVER)&&(V.Debugging.getActionInit() == "loadSamples")&&(!presentation)) {
				presentation = V.Debugging.getPresentationSamples();
			}
		}

		//init age range slider, this has to be done BEFORE V.Editor.Renderer.init(presentation);
		$("#slider-range").slider({
			range: true,
			min: 0,
			max: 30,
			values: [ V.Constant.AGE_RANGE_MIN, V.Constant.AGE_RANGE_MAX ],
			slide: function( event, ui ) {
				$( "#age_range" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
			}
		});
		$("#age_range").val(V.Constant.AGE_RANGE);


		//If we have to edit
		if(presentation){
			presentation = V.Utils.fixPresentation(presentation);
			if(presentation===null){
				V.Utils.showPNotValidDialog();
				return;
			}
			initialPresentation = true;
			setPresentation(presentation);
			V.Editor.Renderer.init(presentation);
			//remove focus from any zone
			_removeSelectableProperties();					
		} else {
			initialPresentation = false;
		}

		V.Slides.redrawSlides();
		V.Editor.Thumbnails.redrawThumbnails(function(){
			V.Editor.Thumbnails.selectThumbnail(V.Slides.getCurrentSlideNumber());
		});
		
		if(presentation){
			//hide objects (the onSlideEnterEditor event will show the objects in the current slide)
			$('.object_wrapper').hide();
		}
		
		//Init submodules
		V.Editor.Text.init();
		V.Editor.Image.init();
		V.Editor.Video.init();
		V.Editor.Object.init();
		V.Editor.PDFex.init();
		V.Editor.Presentation.Repository.init();
		V.Editor.Slideset.Repository.init();
		V.Editor.Thumbnails.init();
		V.Editor.AvatarPicker.init();
		V.Editor.Quiz.init();
		V.Editor.Preview.init();
		V.Editor.Tools.init();
		V.Editor.Filter.init();
		V.Storage.init();
		V.Editor.Clipboard.init();
		V.Editor.Events.init();
		
		//Init Vish Editor Addons
		if(options.addons){
			V.Addons.init(options.addons);
		}

		//Unload all objects
		V.Editor.Utils.Loader.unloadAllObjects();

		//Enter in currentSlide (this will cause that objects will be shown)
		V.Slides.triggerEnterEventById($(V.Slides.getCurrentSlide()).attr("id"));

		//Try to win focus
		window.focus();
	};
	
  

	////////////
	// UI EVENTS
	////////////
  
	/**
	 * function called when user clicks on template
	 * Includes a new slide following the template selected
	 */
	var onTemplateThumbClicked = function(event){
		_onAddSlide(event,V.Constant.STANDARD);
	};

	/**
	 * function called when user clicks on new flashcard
	 * create a new flashcard
	 */
	var onFlashcardThumbClicked = function(event){
		_onAddSlide(event,V.Constant.FLASHCARD);	
	};

	var _onAddSlide = function(event,type){

		//Get slideMode before close fancybox!
		var slideMode = contentAddModeForSlides;

		if(slideMode===V.Constant.STANDARD){
			//Add a new slide to the presentation

			switch(type){
				case V.Constant.STANDARD:
					var template = $($(event.target).parent()).attr('template');
					var slide = $(V.Editor.Dummies.getDummy(template, V.Slides.getSlidesQuantity()+1));
					break;
				case V.Constant.FLASHCARD:
					var slide = $(V.Editor.Flashcard.Creator.getDummy(V.Slides.getSlidesQuantity()+1));
					break;
				case V.Constant.VTOUR:
					break;
				default:
					break;
			}

			V.Editor.Slides.addSlide(slide);

		} else if(slideMode===V.Constant.SLIDESET){
			//Add a new subslide to a smartcard (flashcard or virtual tour)

			var slideset = V.Slides.getCurrentSlide();

			//Add a subslide (slide[type='standard']) to a slideset
			if((type === V.Constant.STANDARD)&&(V.Editor.Slideset.isSlideset(slideset))){
				var template = $($(event.target).parent()).attr('template');
				var subslide = V.Editor.Dummies.getDummyForSubslide(slideset,template);
				V.Editor.Slides.addSubslide(slideset,subslide);
			}

		}

		$.fancybox.close();
	}

	/**
	 * Function called when user clicks on an editable element
	 * Event launched when an editable element belonging to the slide is clicked
	 */
	var onEditableClicked = function(event){
		//first remove the "editable" class because we are going to add clickable icons there and we don´t want it to be editable any more
		$(this).removeClass("editable");
		setCurrentArea($(this));
				
		//need to clone it, because we need to show it many times, not only the first one
		//so we need to remove its id
		var content = $("#menuselect").clone();
		$(content).removeAttr("id");

		$(content).find("a").css("display","none");
		$(content).find("a.all").css("display","inline");

		switch($(this).attr("size")){
			case V.Constant.EXTRA_SMALL:
				$(content).find("a.small").css("display","inline");
				$(content).find("a > div").addClass("thumb_extra_small");
				break;
			case V.Constant.SMALL:
				$(content).find("a.small").css("display","inline");
				$(content).find("a > div").addClass("thumb_small");
				break;
			case V.Constant.MEDIUM:
				$(content).find("a.medium").css("display","inline");
				$(content).find("a > div").addClass("thumb_medium");
				break;
			case V.Constant.LARGE:
				$(content).find("a.large").css("display","inline");
				$(content).find("a > div").addClass("thumb_large");
				break;
		}

		$(this).find(".zone_tooltip").hide();
		$(this).append(content);

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
				V.Editor.Image.setAddContentMode(V.Constant.NONE);
				V.Editor.Utils.loadTab('tab_pic_from_url');
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
				V.Editor.Utils.loadTab('tab_object_from_url');
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
				V.Editor.Utils.loadTab('tab_video_from_url');
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
				V.Editor.Utils.loadTab('tab_live_webcam');
			}
		});
		
		$("a.addQuiz").click(function(event){
			$("a#addQuizFancybox").trigger("click");
		});

	}; 

	/**
	* function called when user clicks on the delete icon of the zone
	*/
	var onDeleteItemClicked = function(){
		setCurrentArea($(this).parent());
		$("#image_template_prompt").attr("src", V.ImagesPath + "zonethumbs/" + getCurrentArea().attr("type") + ".png");
		$.fancybox(
			$("#prompt_form").html(),
			{
				'autoDimensions'	: false,
				'scrolling': 'no',
				'width'				: 350,
				'height'			: 150,
				'showCloseButton'	: false,
				'padding'			: 0,
				'onClosed'			: function(){
					//if user has answered "yes"
					if($("#prompt_answer").val() ==="true"){
						$("#prompt_answer").val("false");
						var area = getCurrentArea();
						area.html("");
						area.removeAttr("type");
						area.addClass("editable");
						V.Editor.Tools.addTooltipToZone(area);
						selectArea(null);
					}
				}
			}
		);
	};
  
  /**
   * Function called when user delete a slide
   */
	var onDeleteSlideClicked = function(){
		article_to_delete = $(this).parent()[0];

		var thumb = V.Editor.Thumbnails.getThumbnailURL(article_to_delete);
		$("#image_template_prompt").attr("src", thumb);

		$.fancybox(
			$("#prompt_form").html(),
			{
				'autoDimensions'	: false,
				'width'				: 350,
				'scrolling': 'no',
				'height'			: 150,
				'showCloseButton'	: false,
				'padding'			: 0,
				'onClosed'			: function(){
					//if user has answered "yes"
					if($("#prompt_answer").val() ==="true"){						
						$("#prompt_answer").val("false");
						if(V.Editor.Slides.isSubslide(article_to_delete)){
							V.Editor.Slides.removeSubslide(article_to_delete);
						} else {
							V.Editor.Slides.removeSlide(V.Slides.getCurrentSlideNumber());
						}
					}
				}
			}
		);
	};

	/**
	* function called when user clicks on template zone with class selectable
	*/
	var onSelectableClicked = function(event){
		selectArea($(this));
		event.stopPropagation();
		event.preventDefault();
	};
  
   /**
	* Function called when user clicks on any element without class selectable
	*/
	var onNoSelectableClicked = function(event){
		
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

			//No hide toolbar when we are working in a wysiwyg fancybox
			var isWysiwygFancyboxEnabled = false;
			$(".cke_dialog").each(function(index,cke_dialog){
				if((cke_dialog)&&(jQuery.contains(cke_dialog,event.target))){
					isWysiwygFancyboxEnabled = true;
					return false;
				}
			});
			if(isWysiwygFancyboxEnabled){
				return;
			}

		}

		V.Editor.Tools.cleanZoneTools(getCurrentArea());
		setCurrentArea(null);
		_removeSelectableProperties();
	};
	
	var _addSelectableProperties = function(zone){
		$(zone).removeClass("zoneUnselected");
		$(zone).addClass("zoneSelected");
	};
	
	var _removeSelectableProperties = function(zone){
		if(zone){
			$(zone).removeClass("zoneSelected");
			$(zone).addClass("zoneUnselected");
		} else {
			$(".zoneSelected").addClass("zoneUnselected");
			$(".zoneSelected").removeClass("zoneSelected");
		}
	};

	/**
	* Function to add a delete button to the element
	*/
	var addDeleteButton = function(element){
		element.append("<div class='delete_content'></div>");
	};


	/////////////////
	// CORE methods
	/////////////////

	/**
	* function called when entering slide in editor, we have to show the objects
	*/
	var onSlideEnterEditor = function(e){
		var slide = $(e.target);

		//Prevent parent to trigger onSlideEnterEditor
		//Use to prevent slidesets to be called when enter in one of their subslides
		e.stopPropagation();

		if(V.Editor.Slideset.isSlideset(slide)){
			V.Editor.Slideset.onEnterSlideset(slide);
		} else {
			//Standard slide
			V.Editor.Utils.Loader.loadObjectsInEditorSlide(slide);
			//Show objects
			setTimeout(function(){
				$(slide).find('.object_wrapper').show();
			},500);
		}

		V.Editor.Tools.loadToolsForSlide(slide);
	};
  
	/**
	* Function called when leaving slide in editor, we have to hide the objects
	*/
	var onSlideLeaveEditor = function(e){
		var slide = $(e.target);

		e.stopPropagation();

		if(V.Editor.Slideset.isSlideset(slide)){
			V.Editor.Slideset.onLeaveSlideset(slide);
		} else {
			//Standard slide
			V.Editor.Utils.Loader.unloadObjectsInEditorSlide(slide);
			//Hide objects
			$('.object_wrapper').hide();
		}
	};

	var selectArea = function(area){
		setCurrentArea(area);
		_removeSelectableProperties();
		_addSelectableProperties(area);
		V.Editor.Tools.loadToolsForZone(area);
	};
	
   /**
	* Function to save the presentation
	*/
	var savePresentation = function(options){
		//Load all objects
		V.Editor.Utils.Loader.loadAllObjects();
		$(".object_wrapper, .snapshot_wrapper").show();

		//Now save the presentation
		var presentation = {};
		presentation.VEVersion = V.VERSION;
		if(draftPresentation){
			presentation.id = draftPresentation.id;
		}else{
			presentation.id = '';	
		}

		var saveForPreview = false;
		if((options)&&(options.preview===true)){
			saveForPreview = true;
		}

		presentation.type = V.Constant.PRESENTATION;

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
		var slidesetModule = V.Editor.Slideset.getCreatorModule(presentation.type);
		var isSlideset = (slidesetModule!==null);
		if(isSlideset){
			slide = slidesetModule.getSlideHeader();
			presentation.slides.push(slide);
		}

		slide = {};
		$('.slides > article').each(function(index,s){
			slide.id = $(s).attr('id');
			slide.type = $(s).attr('type');
			
			if(slide.type === V.Constant.FLASHCARD){
				var fc = V.Editor.Flashcard.getFlashcard(slide.id);
				presentation.slides.push(fc);
				slide = {};
				return true; //equivalent to continue in an each loop
			} else if(slide.type === V.Constant.VTOUR){
				var vt = V.Editor.VirtualTour.getVirtualTour(slide.id);
				presentation.slides.push(vt);
				return true; //equivalent to continue in an each loop
			}

			slide.template = $(s).attr('template');
			slide.elements = [];
			var element = {};

			//important show it (the browser does not know the height and width if it is hidden)
			$(s).addClass("temp_shown");

			$(s).find('div').each(function(i,div){
				
				if($(div).attr("areaid") !== undefined){   

					element.id		=	$(div).attr('id');
					element.type	=	$(div).attr('type');
					element.areaid	=	$(div).attr('areaid');					 
						 
					if(element.type==V.Constant.TEXT){
						//CKEditor version	
						var CKEditor = V.Editor.Text.getCKEditorFromZone(div);
						if(CKEditor!==null){
							element.body = CKEditor.getData();
						} else {
							element.body = "";
						}
					} else if(element.type==V.Constant.IMAGE){
						element.body   = $(div).find('img').attr('src');
						element.style  = V.Editor.Utils.getStylesInPercentages($(div), $(div).find('img'));
						if($(div).attr("hyperlink")){
							element.hyperlink = $(div).attr("hyperlink");
						}
					} else if(element.type==V.Constant.VIDEO){
						var video = $(div).find("video");
						element.poster = $(video).attr("poster");
						element.style  = V.Editor.Utils.getStylesInPercentages($(div), $(video));
						//Sources
						var sources= '';				
						$(video).find('source').each(function(index, source) {
							if(index!==0){
								sources = sources + ',';
							}
							var type = (typeof $(source).attr("type") != "undefined")?' "type": "' + $(source).attr("type") + '", ':'';
							sources = sources + '{' + type + '"src": "' + $(source).attr("src") + '"}';
						});
						sources = '[' + sources + ']';
						element.sources = sources;
					} else if(element.type===V.Constant.OBJECT){
						var wrapper = $(div).find(".object_wrapper")[0];
						var object = $(wrapper).children()[0];

						var myObject = $(object).clone();
						$(myObject).removeAttr("style");
						element.body   = V.Utils.getOuterHTML(myObject);
						element.style  = V.Editor.Utils.getStylesInPercentages($(div), $(object).parent());
						var zoom = V.Utils.getZoomFromStyle($(object).attr("style"));
						if(zoom!=1){
							element.zoomInStyle = V.Utils.getZoomInStyle(zoom);
						}
					} else if (element.type === V.Constant.QUIZ) {
						var quizJSON = VISH.Editor.Quiz.save(div);
						element.quiztype = quizJSON.quizType;
						element.selfA = quizJSON.selfA;
						element.question = quizJSON.question;
						element.choices = quizJSON.choices;
						if(quizJSON.extras){
							element.extras = quizJSON.extras;
						}
						slide.containsQuiz = true;
					} else if(element.type === V.Constant.SNAPSHOT){
						var snapshotWrapper = $(div).find(".snapshot_wrapper");
						var snapshotIframe = $(snapshotWrapper).children()[0];
						$(snapshotIframe).removeAttr("style");
						element.body   = V.Utils.getOuterHTML(snapshotIframe);
						element.style  = V.Editor.Utils.getStylesInPercentages($(div), snapshotWrapper);
						//Save scrolls
						var scrollTopAttr = $(snapshotWrapper).attr("scrollTop");
						if(typeof scrollTopAttr !== "undefined"){
							element.scrollTop = scrollTopAttr;
							element.scrollLeft = $(snapshotWrapper).attr("scrollLeft");
						} else {
							//Fallback. Ideally never execute
							//It only works for visible slides, otherwise returns 0,0
							element.scrollTop = $(snapshotWrapper).scrollTop();
							element.scrollLeft = $(snapshotWrapper).scrollLeft();
						}
						
					} else if(typeof element.type == "undefined"){
						//Empty element
					}

					slide.elements.push(element);

					element = {};
				}
			});

			if(slide.containsQuiz){
				//Before save a slide with quiz
				//Add a presentation to answer the quiz in live mode
				var quizSlide = $.extend(true, {}, slide);
				quizSlide.type = V.Constant.QUIZ_SIMPLE;
				//Build a presentation Wrapper
				var quizPresentation = {};
				quizPresentation.title = presentation.title;
				quizPresentation.description = presentation.description;
				quizPresentation.author = presentation.author;
				quizPresentation.type = V.Constant.QUIZ_SIMPLE;
				quizPresentation.slides = [quizSlide];

				for(var k=0; k<slide.elements.length; k++){
					if(slide.elements[k].type===V.Constant.QUIZ){
						slide.elements[k].quiz_simple_json = quizPresentation;
					}
				}
			}
			
			if(isSlideset){
				//If it is a slideset (e.g flashcard or virtual tour) we save 
				//the slide into the slideset slides array
				//(the slideset itself is the first slide by convention)
				slide = V.Editor.Slideset.prepareToNest(slide);
				presentation.slides[0].slides.push(slide);
			} else {
				//Presentation
				presentation.slides.push(slide);
			}

			slide = {};
			$(s).removeClass("temp_shown");					
		});

		savedPresentation = presentation;  

		//Unload all objects
		V.Editor.Utils.Loader.unloadAllObjects();
		//Reload current slide objects
		V.Editor.Utils.Loader.loadObjectsInEditorSlide(V.Slides.getCurrentSlide());

		V.Debugging.log("\n\nVish Editor save the following presentation:\n");
		// V.Debugging.log(JSON.stringify(presentation));
		return savedPresentation;
	};
	

	var afterSavePresentation = function(presentation, order){
		switch(V.Configuration.getConfiguration().mode){
			case V.Constant.NOSERVER:
				//Ignore order param for developping
				if((V.Debugging)&&(V.Debugging.isDevelopping())){
					if(V.Debugging.getActionSave()=="view"){
						V.Debugging.initVishViewer();
					} else if (V.Debugging.getActionSave()=="edit") {
						V.Debugging.initVishEditor();
					}
				}
				break;
			case V.Constant.VISH:
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
					"authenticity_token" : initOptions.token,
					"draft": draft
				};

				$.ajax({
					type    : send_type,
					url     : V.UploadPresentationPath,
					data    : params,
					success : function(data) {
						V.Editor.Events.allowExitWithoutConfirmation();
						window.top.location.href = data.url;
					}     
				});
				break;
			case V.Constant.STANDALONE:
				//Order is always save, ignore order param
				uploadPresentationWithNode(presentation);
				break;
		}
	};
	

	var uploadPresentationWithNode = function(presentation){
		var send_type;
		var url = V.UploadPresentationPath;

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
		};

		$.ajax({
			type    : send_type,
			url     : url,
			data    : params,
			success : function(data) {
				//Redirect
				V.Editor.Events.allowExitWithoutConfirmation();
				window.top.location.href = data.url;
			}
		});
	};
	
	
	//////////////////
	///  Getters and Setters
	//////////////////

	var getOptions = function(){
		return initOptions;
	};

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
	};
	
	var getCurrentArea = function() {
		if(currentZone){
			return currentZone;
		}
		return null;
	};
	
	var setCurrentArea = function(area){
		if($(area).attr("id")!=$(currentZone).attr("id")){
			lastZone = currentZone
			currentZone = area;
		}
	};

	var getLastArea = function() {
		if(lastZone){
			return lastZone;
		}
		return null;
	};

	var getPresentation = function() {
		return draftPresentation;
	};

	var setPresentation = function(presentation) {
		draftPresentation = presentation;
	};

	var getSavedPresentation = function() {
		if(savedPresentation){
			return savedPresentation;
		} else {
			return null;
		}
	};

	var hasInitialPresentation = function(){
		return initialPresentation;
	};

	var isZoneEmpty = function(zone){
		return ((zone)&&($(zone).find(".delete_content").length===0));
	}

	var getContentAddMode = function(){
		return contentAddModeForSlides;
	}

	var setContentAddMode = function(mode){
		contentAddModeForSlides = mode;
	}

	/*
	 * Type can be "presentation" or "quiz_simple"
	 */
	var getPresentationType = function(){
		if((!draftPresentation)||(!draftPresentation.type)){
			return V.Constant.PRESENTATION;
		}
		return draftPresentation.type;
	};

	var setPresentationType  = function(type){
		if(!draftPresentation){
			draftPresentation = {};
		}
		if(type){
			draftPresentation.type = type;
		} else {
			draftPresentation.type = V.Constant.PRESENTATION;
		}
	};

	/*
	 * Returns if the server has checked the presentation has a draft.
	 */
	var isPresentationDraft = function(){
		if(initialPresentation){
			//Look for options["draft"]
			if((initOptions.draft)&&(typeof initOptions.draft === "boolean")){
				return initOptions.draft;
			} else {
				//Server must indicate explicity that this presentation is a draft with the "draft" option.
				return false;
			}
		} else {
			//New presentation created, draft by default.
			return true;
		}
	};

	return {
		init					: init,
		getOptions				: getOptions, 
		getTemplate				: getTemplate,
		getCurrentArea			: getCurrentArea,
		getLastArea				: getLastArea,
		getPresentationType		: getPresentationType,
		getPresentation			: getPresentation,
		getSavedPresentation	: getSavedPresentation,
		setPresentation			: setPresentation,
		setPresentationType		: setPresentationType,
		isPresentationDraft		: isPresentationDraft,
		getContentAddMode		: getContentAddMode,
		setContentAddMode		: setContentAddMode,
		hasInitialPresentation	: hasInitialPresentation,
		isZoneEmpty				: isZoneEmpty,
		savePresentation		: savePresentation,
		afterSavePresentation	: afterSavePresentation,
		setCurrentArea			: setCurrentArea,
		selectArea				: selectArea,
		onSlideEnterEditor 		: onSlideEnterEditor,
		onSlideLeaveEditor		: onSlideLeaveEditor,
		onTemplateThumbClicked	: onTemplateThumbClicked,
		onFlashcardThumbClicked : onFlashcardThumbClicked,
		onEditableClicked		: onEditableClicked,
		onSelectableClicked 	: onSelectableClicked,
		onNoSelectableClicked 	: onNoSelectableClicked,
		onDeleteItemClicked 	: onDeleteItemClicked,
		onDeleteSlideClicked 	: onDeleteSlideClicked,
		addDeleteButton			: addDeleteButton
	};

}) (VISH, jQuery);