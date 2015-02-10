/**
 * ViSH Editor
 * @namespace VISH
 * @class Editor
 */
VISH.Editor = (function(V,$,undefined){
	
	//Store the initialOptions
	var initOptions;

	//boolean to indicate if we are editing a previous presentation.
	var initialPresentation = false;
	//drafPresentation stores the initial presentation
	var draftPresentation;
	//isDraft indicate if the presentation is a draft
	var _isDraft;

	//last presentation stored in the server
	var lastStoredPresentationStringify;

	//Pointers to the current and last zone
	var currentZone;
	var lastZone;

	//Pointer to the current draw container (it can not be an area)
	var currentContainer;

	//Content mode to add slides
	var contentAddModeForSlides = V.Constant.NONE;

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
	var init = function(options,presentation){
		$("#waiting_overlay").show();

		V.Editing = true;
		$("body").addClass("ViSHEditorBody");

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

		if(V.Debugging.isDevelopping()){
			if ((options.configuration.mode==V.Constant.NOSERVER)&&(V.Debugging.getActionInit() == "loadSamples")&&(!presentation)) {
				presentation = V.Debugging.getPresentationSamples();
			}
		}
		
		if(presentation){
			initialPresentation = true;
		}

		_isDraft = _initPresentationDraft();

		// V.Storage.setTestingMode(true);
		
		V.Utils.init();
		V.Status.init(function(){
			//Status loading finishes
			_initAferStatusLoaded(options,presentation);
		});
	}

	var _initAferStatusLoaded = function(options,presentation){
		if(!V.Utils.checkMiniumRequirements()){
			$("#waiting_overlay").hide();
			return;
		}

		V.Utils.Loader.loadDeviceCSS();
		V.I18n.init(options.lang);
		V.Utils.Loader.loadLanguageCSS();
		V.Editor.ViewerAdapter.init();
		V.Object.init();
		V.Editor.IMSQTI.init();
		V.Editor.Dummies.init();
		V.Editor.API.init();
		V.EventsNotifier.init();
		V.Editor.Animations.init();
		V.Editor.Themes.init();
		V.Flashcard.init();
		V.VirtualTour.init();
		V.Editor.Slideset.init();
		V.Editor.Presentation.init();
		V.Renderer.init();
		V.Slides.init();
		V.User.init(options);
		V.Video.init();
		V.Audio.init();
		V.Editor.LRE.init(options.lang);
		V.Editor.Settings.init(); //Settings must be initialize before V.Editor.Renderer.init(presentation);
		V.SCORM.init();

		//If we have to edit
		if(initialPresentation){
			presentation = V.Utils.fixPresentation(presentation);
			if(presentation===null){
				$("#waiting_overlay").hide();
				V.Utils.showPNotValidDialog();
				return;
			}
			initialPresentation = true;
			draftPresentation = presentation;
			V.Editor.Settings.loadPresentationSettings(presentation);
			if(!isPresentationDraft()){
				// V.Editor.Tools.changePublishButtonStatus("disabled");
				V.Editor.Tools.changePublishButtonStatus("unpublish");
			}
			V.Editor.Themes.selectTheme(presentation.theme,false,function(){
				//Theme loaded
				V.Editor.Renderer.init(presentation);
				//remove focus from any zone
				_removeSelectableProperties();
				_initAferPresentationLoaded(options,presentation);
			});
		} else {
			initialPresentation = false;
			V.Editor.Settings.loadPresentationSettings();
			_initAferPresentationLoaded(options,presentation);
		}
	};
	
	var _initAferPresentationLoaded = function(options,presentation){
		if(initialPresentation){
			V.Editor.Slides.updateCurrentSlideFromHash();
		}
		V.Slides.updateSlides();
		V.Editor.Thumbnails.redrawThumbnails(function(){
			V.Editor.Thumbnails.selectThumbnail(V.Slides.getCurrentSlideNumber());
			V.Editor.Thumbnails.moveThumbnailsToSlide(V.Slides.getCurrentSlideNumber());
		});
		
		if(initialPresentation){
			//hide objects (the onSlideEnterEditor event will show the objects in the current slide)
			$('.object_wrapper').hide();
		}
		
		//Init submodules
		V.Editor.Text.init();
		V.Editor.Image.init();
		V.Editor.Video.init();
		V.Editor.Audio.init();
		V.Editor.Object.init();
		V.Editor.PDFex.init();
		V.Editor.EPackage.init();
		V.Editor.Presentation.Repository.init();
		V.Editor.Thumbnails.init();
		V.Editor.Quiz.init();
		V.Editor.Preview.init();
		V.Editor.Tools.init();
		V.Editor.Filter.init();
		V.Storage.init();
		V.Editor.Clipboard.init();
		V.Editor.Events.init();
		
		//Init ViSH Editor Addons
		if(options.addons){
			V.Addons.init(options.addons);
		}

		//Clean hash
		// V.Utils.cleanHash();

		//Unload all objects
		V.Editor.Utils.Loader.unloadAllObjects();

		//Enter in currentSlide (this will cause that objects will be shown)
		if(V.Slides.getCurrentSlideNumber()>0){
			V.Slides.triggerEnterEventById($(V.Slides.getCurrentSlide()).attr("id"));
		}

		//Add the first slide
		if(!initialPresentation){
			var slide = V.Editor.Dummies.getDummy(V.Constant.STANDARD, {template:"1", slideNumber:1});
			V.Editor.Slides.addSlide(slide);
			V.Slides.goToSlide(1);
		}

		//Init settings
		if((V.Configuration.getConfiguration().presentationSettings) && (!initialPresentation)){
			V.Editor.Settings.displaySettings();
		}

		//Fill About screen
		$("#VEversion").html(V.VERSION);

		//Try to win focus
		window.focus();

		$("#waiting_overlay").hide();
	}
  

	////////////
	// UI EVENTS
	////////////

	/**
	 * function called when user clicks on template
	 * Includes a new slide following the template selected
	 */
	var onSlideThumbClicked = function(event){
		var slideThumb;
		if(event.currentTarget.tagName === "P"){
			slideThumb = $(event.currentTarget).parent().find(".stthumb");
		} else {
			slideThumb = event.currentTarget;
		}

		var type = $(slideThumb).attr('type');
		if(!type){
			type = V.Constant.STANDARD;
		}

		//Get slideMode before close fancybox!
		var slideMode = contentAddModeForSlides;

		if(slideMode===V.Constant.STANDARD){
			//Add a new slide to the presentation

			var options = {};
			if(type===V.Constant.STANDARD){
				options.template = $(slideThumb).attr('template');
			}
			options.slideNumber = V.Slides.getSlidesQuantity()+1;
			var slide = V.Editor.Dummies.getDummy(type, options);
			V.Editor.Slides.addSlide(slide);

		} else if(slideMode===V.Constant.SLIDESET){
			//Add a new subslide to a slideset (flashcard or virtual tour)

			var slideset = V.Slides.getCurrentSlide();

			//Add a subslide (slide[type='standard']) to a slideset
			if((type === V.Constant.STANDARD)&&(V.Slideset.isSlideset(slideset))){
				var options = {};
				options.subslide = true;
				options.template = $(slideThumb).attr('template');
				options.slideset = slideset;
				var subslide = V.Editor.Dummies.getDummy(type, options);
				V.Editor.Slides.addSubslide(slideset,subslide);
			}

		}

		$.fancybox.close();
	};

	var onAnimationThumbClicked = function(){
		$.fancybox.close();
	};

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
		$(content).find("a.all").addClass("thumb_shown");

		var zoneSize = $(this).attr("size");
		var sizeClass = (zoneSize == V.Constant.EXTRA_SMALL) ? V.Constant.SMALL : zoneSize;

		$(content).find("a."+sizeClass).addClass("thumb_shown");
		$(content).find("a > div").addClass("thumb_" + zoneSize);
		
		$(content).find("a.thumb_shown.uniq").each(function(index,uthumb){
			var shouldBeShown = false;
			switch($(uthumb).attr("id")){
				case "add_quiz_thumb":
					if($(V.Slides.getCurrentSlide()).children("div.vezone[type='quiz']").length < 1){
						shouldBeShown = true;
					}	
					break;
				default:
					break;
			};
			if(shouldBeShown===false){
				$(uthumb).removeClass("thumb_shown");
			}
		});

		V.Editor.Tools.hideZoneToolTip($(this).find(".zone_tooltip"));

		$(this).append(content);

		V.Editor.Events.addZoneThumbsEvents(this);
	}; 

	/**
	* function called when user clicks on the delete icon of the zone
	*/
	var onDeleteItemClicked = function(){
		setCurrentArea($(this).parent());

		var options = {};
		options.width = 375;
		options.height = 135;
		options.notificationIconSrc = V.ImagesPath + "zonethumbs/" + getCurrentArea().attr("type") + ".png";
		options.text = V.I18n.getTrans("i.areyousureNotification");
		var button1 = {};
		button1.text = V.I18n.getTrans("i.no");
		button1.callback = function(){
			$.fancybox.close();
		}
		var button2 = {};
		button2.text = V.I18n.getTrans("i.delete");
		button2.callback = function(){
			var area = getCurrentArea();
			area.html("");
			area.removeAttr("type");
			area.addClass("editable");
			V.Editor.Tools.addTooltipToZone(area);
			selectArea(null);
			V.Editor.Slides.updateThumbnail(V.Slides.getTargetSlide());
			$.fancybox.close();
		}
		options.buttons = [button1,button2];
		V.Utils.showDialog(options);
	};
  
  /**
   * Function called when user delete a slide
   */
	var onDeleteSlideClicked = function(){
		var article_to_delete = $(this).parent()[0];

		var options = {};
		options.width = 375;
		options.height = 130;
		options.notificationIconSrc = V.Editor.Thumbnails.getThumbnailURL(article_to_delete);
		options.notificationIconClass = "notificationIconDelete";
		options.text = V.I18n.getTrans("i.areyousureNotification");
		var button1 = {};
		button1.text = V.I18n.getTrans("i.no");
		button1.callback = function(){
			$.fancybox.close();
		}
		var button2 = {};
		button2.text = V.I18n.getTrans("i.delete");
		button2.callback = function(){
			if(V.Slides.isSubslide(article_to_delete)){
				V.Editor.Slides.removeSubslide(article_to_delete);
			} else {
				V.Editor.Slides.removeSlide(V.Slides.getCurrentSlide());
			}
			$.fancybox.close();
		}
		options.buttons = [button1,button2];
		V.Utils.showDialog(options);
	};


	/*
	 * Selectable elements are zones which can be selected.
	 * Add class 'noSelectableElement' to a element to call _onNoSelectableClicked without restrictions
	 * Add class 'preventNoselectable' to a element to never call _onNoSelectableClicked
	 * Add class 'selectable' to a element to call onSelectableClicked and never call _onNoSelectableClicked
	*/

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
		var target = $(event.target);
		var targetParent = $(target).parent();

		if(!$(target).hasClass("noSelectableElement")){

			//No hide toolbar when we are working in a fancybox
			if($("#fancybox-content").is(":visible")){
				return;
			}

			//No hide toolbar for selectable or preventNoselectable childrens
			if($(targetParent).hasClass("selectable") || $(targetParent).hasClass("preventNoselectable")){
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

		cleanArea();
	};

	var cleanArea = function(){
		V.Editor.Tools.cleanZoneTool(getCurrentArea());
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
	* Function called when entering slide in editor, we have to show the objects
	*/
	var onSlideEnterEditor = function(e){
		var slide = $(e.target);

		//Prevent parent to trigger onSlideEnterEditor
		//Use to prevent slidesets to be called when enter in one of their subslides
		e.stopPropagation();

		if(V.Slideset.isSlideset(slide)){
			V.Editor.Slideset.onEnterSlideset(slide);
		} else {
			//Standard slide
			V.Editor.Utils.Loader.loadObjectsInEditorSlide(slide);
			//Show objects
			setTimeout(function(){
				$(slide).find('.object_wrapper').show();
			},500);
		}

		V.Editor.Thumbnails.selectThumbnail(V.Slides.getCurrentSlideNumber());
		cleanArea();
		V.Editor.Tools.loadToolsForSlide(slide);
	};
  
	/**
	* Function called when leaving slide in editor, we have to hide the objects
	*/
	var onSlideLeaveEditor = function(e){
		var slide = $(e.target);

		e.stopPropagation();

		if(V.Slideset.isSlideset(slide)){
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
	var savePresentation = function(){
		//Save the presentation in JSON
		var presentation = {};

		//Save settings (metadata, theme, animation, ...)
		presentation = V.Editor.Settings.saveSettings();

		presentation = _saveLORData(presentation);

		//Slides of the presentation
		presentation.slides = [];

		//Load and show all objects
		V.Editor.Utils.Loader.loadAllObjects();
		$(".object_wrapper, .snapshot_wrapper").show();

		$('section.slides > article').each(function(index,slideDOM){
			var slide = {};

			if(!V.Slideset.isSlideset(slideDOM)){
				slide = _saveStandardSlide(slideDOM,presentation,false);
			} else {
				var slidesetModule = V.Editor.Slideset.getCreatorModule(slideDOM);
				V.Utils.addTempShown(slideDOM);
				slide = slidesetModule.getSlideHeader(slideDOM);
				//Save subslides
				$(slideDOM).find("article").each(function(index,subslideDOM){
					var subslide = _saveStandardSlide(subslideDOM,presentation,true);
					slide.slides.push(subslide);
				});
				V.Utils.removeTempShown(slideDOM);
			}

			presentation.slides.push(slide);	
		});

		//Unload all objects
		V.Editor.Utils.Loader.unloadAllObjects();
		//Reload current slide objects
		V.Editor.Utils.Loader.loadObjectsInEditorSlide(V.Slides.getCurrentSlide());

		// V.Debugging.log("\n\nViSH Editor save the following presentation:\n");
		// V.Debugging.log(JSON.stringify(presentation));

		return presentation;
	};

	var _saveLORData = function(presentation){
		var LORPresentation = getDraftPresentation();
		var LORMetadata;
		
		if(LORPresentation && LORPresentation["vishMetadata"]){
			LORMetadata = LORPresentation["vishMetadata"];
		} else {
			LORMetadata = {};
		}
		
		LORMetadata["draft"] = isPresentationDraft().toString();

		presentation["vishMetadata"] = LORMetadata;

		return presentation;
	};
	
	var _saveStandardSlide = function(slideDOM,presentation,isSubslide){
		slide = {};
		slide.id = $(slideDOM).attr('id');
		slide.type = $(slideDOM).attr('type');
		slide.template = $(slideDOM).attr('template');
		slide.elements = [];

		//important show it (the browser does not know the height and width if it is hidden)
		V.Utils.addTempShown(slideDOM);

		$(slideDOM).find('div').each(function(i,div){
			var element = {};

			if($(div).attr("areaid") !== undefined){
				element.id		=	$(div).attr('id');
				element.type	=	$(div).attr('type');
				element.areaid	=	$(div).attr('areaid');

				//Save element settings
				var elSettings = $(div).attr("elSettings");
				if(typeof elSettings == "string"){
					try {
						element.settings = JSON.parse(elSettings);
					} catch(e){}
				}

				if(element.type==V.Constant.TEXT){
					var CKEditor = V.Editor.Text.getCKEditorFromZone(div);
					if(CKEditor!==null){
						element.body = CKEditor.getData();
					} else {
						element.body = "";
					}
				} else if(element.type==V.Constant.IMAGE){
					element.body   = $(div).find('img').attr('src');
					element.style  = V.Editor.Utils.getStylesInPercentages($(div),$(div).find('img'));
					if($(div).attr("hyperlink")){
						element.hyperlink = $(div).attr("hyperlink");
					}
					if($(div).attr("vishubpdfexid")){
						element.options = {};
						element.options["vishubPdfexId"] = $(div).attr("vishubpdfexid");
					}
				} else if(element.type==V.Constant.VIDEO){
					var video = $(div).find("video");
					element.poster = $(video).attr("poster");
					element.style  = V.Editor.Utils.getStylesInPercentages($(div),$(video));
					//Sources
					var sources= '';		
					$(video).find('source').each(function(index, source) {
						if(index!==0){
							sources = sources + ',';
						}
						var sourceSrc = V.Utils.removeParamFromUrl($(source).attr("src"),"timestamp");
						var sourceMimeType = (typeof $(source).attr("type") != "undefined")?', "type": "' + $(source).attr("type") + '"':'';
						sources = sources + '{"src":"' + sourceSrc + '"' + sourceMimeType + '}';
					});
					sources = '[' + sources + ']';
					element.sources = sources;
				} else if(element.type==V.Constant.AUDIO){
					var audio = $(div).find("audio");
					element.style  = V.Editor.Utils.getStylesInPercentages($(div),$(audio));
					//Sources
					var sources= '';				
					$(audio).find('source').each(function(index, source) {
						if(index!==0){
							sources = sources + ',';
						}
						var sourceSrc = V.Utils.removeParamFromUrl($(source).attr("src"),"timestamp");
						var sourceMimeType = (typeof $(source).attr("type") != "undefined")?', "type": "' + $(source).attr("type") + '"':'';
						sources = sources + '{"src":"' + sourceSrc + '"' + sourceMimeType + '}';
					});
					sources = '[' + sources + ']';
					element.sources = sources;
				} else if(element.type===V.Constant.OBJECT){
					var wrapper = $(div).find(".object_wrapper")[0];
					var object = $(wrapper).children()[0];

					var myObject = $(object).clone();
					$(myObject).removeAttr("style");
					element.body   = V.Utils.getOuterHTML(myObject);
					element.style  = V.Editor.Utils.getStylesInPercentages($(div),$(object).parent());
					var zoom = V.Utils.getZoomFromStyle($(object).attr("style"));
					if(zoom!=1){
						element.zoomInStyle = V.Utils.getZoomInStyle(zoom);
					}
					//Save subtype
					element.subtype = V.Object.getObjectInfo(myObject).type;
				} else if (element.type === V.Constant.QUIZ) {
					var quizJSON = VISH.Editor.Quiz.save(div);
					element.quiztype = quizJSON.quizType;
					element.selfA = quizJSON.selfA;
					element.question = quizJSON.question;
					if(typeof quizJSON.choices != "undefined"){
						element.choices = quizJSON.choices;
					}
					if(typeof quizJSON.answer != "undefined"){
						element.answer = quizJSON.answer;
					}
					if(quizJSON.extras){
						element.extras = quizJSON.extras;
					}
					slide.containsQuiz = true;
				} else if(element.type === V.Constant.SNAPSHOT){
					var snapshotWrapper = $(div).find(".snapshot_wrapper");
					var snapshotIframe = $(snapshotWrapper).children()[0];
					$(snapshotIframe).removeAttr("style");
					element.body   = V.Utils.getOuterHTML(snapshotIframe);
					element.style  = V.Editor.Utils.getStylesInPercentages($(div),snapshotWrapper);

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
					element.subtype = V.Constant.MEDIA.WEB;
				} else if(typeof element.type == "undefined"){
					//Empty element
				}

				slide.elements.push(element);
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
			quizPresentation.theme = presentation.theme;
			quizPresentation.slides = [quizSlide];

			for(var k=0; k<slide.elements.length; k++){
				if(slide.elements[k].type===V.Constant.QUIZ){
					slide.elements[k].quiz_simple_json = quizPresentation;
				}
			}
		}

		V.Utils.removeTempShown(slideDOM);
		
		return slide;
	};

	var sendPresentation = function(presentation,order,successCallback,failCallback){
		switch(V.Configuration.getConfiguration().mode){
			case V.Constant.VISH:
				var createNewPresentation = ((typeof lastStoredPresentationStringify == "undefined")&&(!initialPresentation));
				
				var send_type;
				if(createNewPresentation){
					send_type = 'POST'; //if it is a new presentation
				} else {
					send_type = 'PUT';  //if we are editing an existing prsesentation or resaving a new presentation
				}

				var params = {
					"authenticity_token" : V.User.getToken()
				};

				if(order!="unpublish"){
					var jsonPresentation = JSON.stringify(presentation);
					params["excursion[json]"] = jsonPresentation;
				}

				if(order==="publish"){
					params.draft = false;
				} else if(order==="unpublish"){
					params.draft = true;
				} else if(order==="save"){
					if(createNewPresentation){
						params.draft = true;
					}
				}

				//POST to http://server/excursions/ or PUT to http://server/excursions/id
				$.ajax({
					type    : send_type,
					url     : V.UploadPresentationPath,
					data    : params,
					success : function(data) {
						if(order != "unpublish"){
							lastStoredPresentationStringify = jsonPresentation;
							if((createNewPresentation)&&(typeof data != "undefined")&&(data.uploadPath)){
								//Update V.UploadPresentationPath because the presentation exists now
								//Future saves will update the existing presentation
								V.UploadPresentationPath = data.uploadPath;
								if(V.Status.getDevice().features.historypushState){
									if(data.editPath){
										window.top.history.replaceState("","",data.editPath);
									}
								}
							}
							if(order=="publish"){
								_isDraft = false;
							}
						} else {
							//Order == "unpublish"
							_isDraft = true;
							if((typeof data != "undefined")&&(data.exitPath)){
								//Update exit path
								V.exitPath = data.exitPath;
							}
						}
						if(typeof successCallback == "function"){
							successCallback(data);
						}
					},
					error: function(xhr, error){
        				if(typeof failCallback == "function"){
							failCallback();
						}
 					}
				});
				break;
			case V.Constant.NOSERVER:
				if(order != "unpublish"){
					lastStoredPresentationStringify = JSON.stringify(presentation);
					if(order=="publish"){
						_isDraft = false;
					}
				} else {
					//Order == "unpublish"
					_isDraft = true;
				}

				setTimeout(function(){
					successCallback();
				},5000);
				
				break;
		}
	};

	var _uploadPresentationWithNode = function(presentation){
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
		} else if(getCurrentArea()){
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
			lastZone = currentZone;
			currentZone = area;
		}
	};

	var getLastArea = function(){
		if(lastZone){
			return lastZone;
		}
		return null;
	};

	var getCurrentContainer = function(){
		return currentContainer;
	};

	var setCurrentContainer = function(container){
		currentContainer = container;
	};

	var getDraftPresentation = function(){
		return draftPresentation;
	};

	var hasInitialPresentation = function(){
		// return (typeof draftPresentation != "undefined");
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


	/*
	 * Returns if the server has checked the presentation has a draft.
	 */
	var isPresentationDraft = function(){
		return _isDraft;
	};

	var _initPresentationDraft = function(){
		if(initialPresentation){
			if(typeof initOptions.draft === "boolean"){
				return initOptions.draft;
			} else if(typeof initOptions.draft === "string"){
				return !(initOptions.draft=="false");
			} else {
				//Server must indicate explicity that this presentation is not a draft with the "draft" option.
				return true;
			}
		} else {
			//New presentation created, draft by default.
			return true;
		}
	};

	var hasPresentationChanged = function(){
		try {
			var objectToCompare;
			if(typeof lastStoredPresentationStringify != "undefined"){
				objectToCompare = lastStoredPresentationStringify;
			} else if(typeof draftPresentation != "undefined"){
				objectToCompare = JSON.stringify(draftPresentation);
			} else {
				return true;
			}

			var currentPresentation = V.Editor.savePresentation();
			return !(objectToCompare === JSON.stringify(currentPresentation));
		} catch (e){
			return true;
		}
	};


	return {
		init					: init,
		getOptions				: getOptions, 
		getTemplate				: getTemplate,
		getCurrentArea			: getCurrentArea,
		getLastArea				: getLastArea,
		cleanArea				: cleanArea,
		getCurrentContainer		: getCurrentContainer,
		setCurrentContainer		: setCurrentContainer,
		getPresentationType		: getPresentationType,
		getDraftPresentation	: getDraftPresentation,
		isPresentationDraft		: isPresentationDraft,
		getContentAddMode		: getContentAddMode,
		setContentAddMode		: setContentAddMode,
		hasInitialPresentation	: hasInitialPresentation,
		isZoneEmpty				: isZoneEmpty,
		savePresentation		: savePresentation,
		sendPresentation		: sendPresentation,
		setCurrentArea			: setCurrentArea,
		selectArea				: selectArea,
		onSlideEnterEditor 		: onSlideEnterEditor,
		onSlideLeaveEditor		: onSlideLeaveEditor,
		onSlideThumbClicked		: onSlideThumbClicked,
		onAnimationThumbClicked	: onAnimationThumbClicked,
		onEditableClicked		: onEditableClicked,
		onSelectableClicked 	: onSelectableClicked,
		onNoSelectableClicked 	: onNoSelectableClicked,
		onDeleteItemClicked 	: onDeleteItemClicked,
		onDeleteSlideClicked 	: onDeleteSlideClicked,
		addDeleteButton			: addDeleteButton,
		hasPresentationChanged	: hasPresentationChanged
	};

}) (VISH, jQuery);