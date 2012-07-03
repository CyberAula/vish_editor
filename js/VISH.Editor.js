VISH.Editor = (function(V,$,undefined){
	
	var initOptions;
	var domId = 0;  //number for next doom element id
	

	// hash to store the excursions details like Title, Description, etc.
	var excursionDetails = {}; 
	var excursion_to_edit = null;
	var saved_excursion = null;
	
	// Hash to store: 
	// current_el that will be the zone of the template that the user has clicked
	var params = {
		current_el : null		
	};
	
	
	//Prevent to load events multiple times.
	var eventsLoaded = false;
	
	
	/**
	 * Initializes the VISH editor
	 * Adds the listeners to the click events in the different images and buttons
	 * Call submodule initializers
	 * options is a hash with params and options from the server, example of full options hash:
	 * {"token"; "453452453", "ownerId":"ebarra", "ownerName": "Enrique Barra", "postPath": "/excursions.json", "documentsPath": "/documents.json", "lang": "es"}
	 * excursion is the excursion to edit (in not present, a new excursion is created)
	 */
	var init = function(options, excursion){
		
		//Check minium requirements
		if(!VISH.Utils.checkMiniumRequirements()){
			return;
		}

		//first set VISH.Editing to true
		VISH.Editing = true;
		
		if(options){
			initOptions = options;
			if((options['developping']==true)&&(VISH.Debugging)){
				VISH.Debugging.init(true);
	      if ((VISH.Debugging.getActionInit() == "loadSamples")&&(!excursion)) {
	        excursion = VISH.Debugging.getExcursionSamples();
	      }
			}
			if((options["configuration"])&&(VISH.Configuration)){
        VISH.Configuration.init(options["configuration"]);
				VISH.Configuration.applyConfiguration();
      }
		}	else {
			initOptions = {};
		}
		

		//If we have to edit
		if(excursion){
			excursion_to_edit = excursion;
			excursionDetails.title = excursion.title;
			excursionDetails.description = excursion.description;
			excursionDetails.avatar = excursion.avatar;
			V.Editor.Renderer.init(excursion);
			//remove focus from any zone
			_removeSelectableProperties();			
		}
		
		// fancybox to create a new slide		
		$("a#addSlideFancybox").fancybox({
			'scrolling': 'no',
			'width': 800,
    		'height': 600,
    		'padding': 0
    });
		
		if(!eventsLoaded){
			eventsLoaded = true;
			
			$(document).on('click', '#edit_excursion_details', _onEditExcursionDetailsButtonClicked);
      $(document).on('click', '#save_excursion_details', _onSaveExcursionDetailsButtonClicked);   
      $(document).on('click','.templatethumb', _onTemplateThumbClicked);
      
      $(document).on('click','#save', _onSaveButtonClicked);
      $(document).on('click','.editable', _onEditableClicked);
      $(document).on('click','.selectable', _onSelectableClicked);
			
//			var notSelectable = $(document).find('div').not('.selectable');
//			$(notSelectable).on('click', function(event) {
//        console.log("Not selectable clicked!");
//      });
			
      $(document).on('click','.delete_content', _onDeleteItemClicked);
      $(document).on('click','.delete_slide', _onDeleteSlideClicked);
      //arrows in button panel
      $(document).on('click','#arrow_left_div', _onArrowLeftClicked);
      $(document).on('click','#arrow_right_div', _onArrowRightClicked);
    
      //used directly from SlideManager, if we separate editor from viewer that code would have to be in a common file used by editor and viewer
      _addEditorEnterLeaveEvents();
    
      V.SlidesUtilities.redrawSlides();
      V.Editor.Thumbnails.redrawThumbnails();
    
      addEventListeners(); //comes from slides.js to be called only once
      
			//if click on begginers tutorial->launch it
      _addTutorialEvents();
		}

		
		if(excursion){
			//hide objects (the _onslideenterEditor event will show the objects in the current slide)
			$('.object_wrapper').hide()
		}
		
		//Init submodules
		V.Editor.Text.init();
		V.Editor.Image.init();
		V.Editor.Video.init();
		V.Editor.Object.init();
		V.Editor.Thumbnails.init();
		V.Editor.AvatarPicker.init();
		V.Editor.I18n.init(options["lang"]);
		V.Editor.Quiz.init();
		V.Editor.Tools.init();

	
		if ((VISH.Configuration.getConfiguration()["presentationSettings"])&&(!excursion_to_edit)){
				$("a#edit_excursion_details").fancybox({
	        'autoDimensions' : false,
	        'scrolling': 'no',
	        'width': 800,
	        'height': 660,
	        'padding': 0,
	        'hideOnOverlayClick': false,
	        'hideOnContentClick': false,
	        'showCloseButton': false
	      }); 
        $("#edit_excursion_details").trigger('click');
		} else {
				$("a#edit_excursion_details").fancybox({
	        'autoDimensions' : false,
	        'scrolling': 'no',
	        'width': 800,
	        'height': 660,
	        'padding': 0,
	        'hideOnOverlayClick': false,
	        'hideOnContentClick': false,
	        'showCloseButton': true
	      }); 
		}
		
	};
	
	
	
  ////////////////
  /// Helpers 
  ////////////////
  
  
  /**
   * Return a unic id.
   */
  var getId = function(){
    domId = domId +1;
    return "unicID_" + domId;
  }
	
	var getOptions = function(){
		return initOptions;
	}
	
  /**
   * function to dinamically add a css
   */
  var _loadCSS = function(path){
    $("head").append("<link>");
    css = $("head").children(":last");
    css.attr({
      rel:  "stylesheet",
      type: "text/css",
      href: path
    });
  };

  /**
   * Function to add a delete button to the element
   */
  var addDeleteButton = function(element){
  	element.append("<div class='delete_content'></div>");
  };
  

  /////////////////////////
  /// Fancy Box Functions
  /////////////////////////

	/**
	 * function to load a tab and its content in the fancybox
	 * also changes the help button to show the correct help
	 */
	var loadTab = function (tab_id){
	  // first remove the walkthrough if open
  	$('.joyride-close-tip').click();
  	  
	  //deselect all of them
	  $(".fancy_tab").removeClass("fancy_selected");
	  //select the correct one
	  $("#" + tab_id).addClass("fancy_selected");
	    
	  //hide previous tab
	  $(".fancy_tab_content").hide();
	  //show content
	  $("#" + tab_id + "_content").show();

		//hide previous help button
		$(".help_in_fancybox").hide();
		//show correct one
		$("#"+ tab_id + "_help").show();
		
        //Submodule callbacks	
		switch (tab_id) {
			//Image
			case "tab_pic_from_url":
				V.Editor.Image.onLoadTab("url");
				break;
			case "tab_pic_upload":
				V.Editor.Image.onLoadTab("upload");
				break;
			case "tab_pic_repo":
				V.Editor.Image.Repository.onLoadTab();
				break;
			case "tab_pic_flikr":
				V.Editor.Image.Flikr.onLoadTab();
				break;
				
			//Video
			case "tab_video_from_url":
				VISH.Editor.Video.onLoadTab();
				break;
			case "tab_video_repo":
				VISH.Editor.Video.Repository.onLoadTab();
				break;
			case "tab_video_youtube":
				VISH.Editor.Video.Youtube.onLoadTab();
				break;
			case "tab_video_vimeo":
				VISH.Editor.Video.Vimeo.onLoadTab();
				break;
				
				
			//Objects
			case "tab_object_from_url":
				VISH.Editor.Object.onLoadTab("url");
				break;
			case "tab_object_from_web":
        VISH.Editor.Object.Web.onLoadTab();
        break;
			case "tab_object_snapshot":
			  VISH.Editor.Object.Snapshot.onLoadTab();
				break;
			case "tab_object_upload":
				VISH.Editor.Object.onLoadTab("upload");
				break;
			case "tab_object_repo":
				VISH.Editor.Object.Repository.onLoadTab();
				break;
				
				
			//Live
			case "tab_live_webcam":
				VISH.Editor.Object.Live.onLoadTab("webcam");
				break;
			case "tab_live_micro":
				VISH.Editor.Object.Live.onLoadTab("micro");
				break;
				
				
			//Default
			default:
				break;
	  }
	};

  /**
   * Removes the lightbox
   */
  var _closeFancybox = function(){
    $.fancybox.close();
  };


  //////////////////
  ///    Events
  //////////////////
  
	
	var _onInitialTagsReceived = function(data){
		 var tagList = $(".tagBoxIntro .tagList");
		 
     if ($(tagList).children().length == 0){

				if(!excursion_to_edit){
          //Insert the two first tags.
	        $.each(data, function(index, tag) {
	          if(index==2){
	            return false; //break the bucle
	          }
	          $(tagList).append("<li>" + tag + "</li>")
	        });
        } else {
					
					if(excursion_to_edit.tags){
						//Insert excursion_to_edit tags
	          $.each(excursion_to_edit.tags, function(index, tag) {
	            $(tagList).append("<li>" + tag + "</li>")
	          });
					}
				}
				
				$(tagList).tagit({tagSource:data, sortable:true, maxLength:15, maxTags:6 , 
				watermarkAllowMessage: "Add tags", watermarkDenyMessage: "limit reached" });
     }
	}
	
  /**
   * function to add the events to the help buttons to launch joy ride bubbles
   */
  var _addTutorialEvents = function(){
  	$(document).on('click','#start_tutorial', function(){
			V.Editor.Tour.startTourWithId('initial_screen_help', 'top');
	});
	$(document).on('click','#help_right', function(){
			V.Editor.Tour.startTourWithId('menubar_help', 'top');
	});
	
	//template
	$(document).on('click','#help_template_image', function(){			
			V.Editor.Tour.startTourWithId('template_help', 'bottom');
	});
	
	//template selection fancybox	
	$(document).on('click','#help_template_selection', function(){
			V.Editor.Tour.startTourWithId('help_template_selection_help', 'bottom');
	});	
	
	//image fancybox, one help button in each tab
	$(document).on('click','#tab_pic_from_url_help', function(){
			V.Editor.Tour.startTourWithId('images_fancy_tabs_id_help', 'top');
	});	
	$(document).on('click','#tab_pic_upload_help', function(){
			V.Editor.Tour.startTourWithId('upload_picture_form_help', 'top');
	});
	$(document).on('click','#tab_pic_repo_help', function(){
			V.Editor.Tour.startTourWithId('search_picture_help', 'bottom');
	});
	$(document).on('click','#tab_pic_flikr_help', function(){
			V.Editor.Tour.startTourWithId('search_flickr_fancy_help', 'bottom');
	});
	
	//object fancybox, one help button in each tab
	$(document).on('click','#tab_object_from_url_help', function(){
			V.Editor.Tour.startTourWithId('object_fancy_tabs_id_help', 'top');
	});	
	$(document).on('click','#tab_object_upload_help', function(){
			V.Editor.Tour.startTourWithId('upload_object_form_help', 'top');
	});
	$(document).on('click','#tab_object_repo_help', function(){
			V.Editor.Tour.startTourWithId('search_object_help', 'bottom');
	});
	
	//video fancybox, one help button in each tab
	$(document).on('click','#tab_video_from_url_help', function(){
			V.Editor.Tour.startTourWithId('video_fancy_tabs_id_help', 'top');
	});	
	$(document).on('click','#tab_video_repo_help', function(){
			V.Editor.Tour.startTourWithId('search_video_help', 'top');
	});
	$(document).on('click','#tab_video_youtube_help', function(){
			V.Editor.Tour.startTourWithId('search_youtube_fancy_help', 'bottom');
	});
	$(document).on('click','#tab_video_vimeo_help', function(){
			V.Editor.Tour.startTourWithId('search_vimeo_fancy_help', 'bottom');
	});
	
	// live fancybox, one help button in each tab
	$(document).on('click','#tab_live_webcam_help', function(){
			V.Editor.Tour.startTourWithId('tab_live_webcam_id', 'bottom');
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
  };
  
  /**
   * function called when leaving slide in editor, we have to hide the objects
   */
  var _onslideleaveEditor = function(){
  	//radical way
  	$('.object_wrapper').hide();
  };
  
   
	/**
	 * function callen when the user clicks on the edit
	 * excursion details button
	 */
	
  var firstCall = true;
	
	var _onEditExcursionDetailsButtonClicked = function(event){
		
		if((VISH.Configuration.getConfiguration()["presentationTags"])&&(firstCall)){
      VISH.Editor.API.requestTags(_onInitialTagsReceived);
			
			if((excursionDetails)&&(excursionDetails.avatar)){
				VISH.Editor.AvatarPicker.onLoadExcursionDetails(excursionDetails.avatar);
			} else {
				VISH.Editor.AvatarPicker.onLoadExcursionDetails(null);
			}
    }
		
		if(firstCall){
			 firstCall = false;
      
       $("a#edit_excursion_details").fancybox({
          'autoDimensions' : false,
          'scrolling': 'no',
          'width': 800,
          'height': 660,
          'padding': 0,
          'hideOnOverlayClick': false,
          'hideOnContentClick': false,
          'showCloseButton': true
       }); 
		}
	};
  
	/**
	 * function callen when the user clicks on the save button
	 * in the initial excursion details fancybox to save
	 * the data in order to be stored at the end in the JSON file   
	 */
	var _onSaveExcursionDetailsButtonClicked = function(event){
		if($('#excursion_title').val().length < 1) {
			$('#excursion_details_error').slideDown("slow");
			$('#excursion_details_error').show();
			return false;
		}
		// save the details in a hash object
		excursionDetails.title = $('#excursion_title').val();
		excursionDetails.description = $('#excursion_description').val();
		excursionDetails.avatar = $('#excursion_avatar').val();
		excursionDetails.tags = VISH.Utils.convertToTagsArray($("#tagindex").tagit("tags"));
		$('#excursion_details_error').hide();
		$.fancybox.close();
	};

	/**
	 * function called when user clicks on template
	 * Includes a new slide following the template selected
	 */
	var _onTemplateThumbClicked = function(event){
		
	VISH.Debugging.log(" attrib template vale:  " + $(this).attr('template') );
		var slide = V.Dummies.getDummy($(this).attr('template'));
		
		//VISH.Debugging.log("slide es: " + slide );
				
		V.SlidesUtilities.addSlide(slide);
		
		$.fancybox.close();
		
		V.SlidesUtilities.redrawSlides();		
		V.Editor.Thumbnails.redrawThumbnails();
		
		setTimeout("VISH.SlidesUtilities.lastSlide()", 300);		
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
		var content = null;
		
		if($(this).attr("areaid")==="header" || $(this).attr("areaid")==="subheader"){
			content = $("#menuselect_for_header").clone().attr('id','');
		}	else {
			content = $("#menuselect").clone().attr('id','');
		}
				
		//add zone attr to the a elements to remember where to add the content
		content.find("a").each(function(index, domElem) {
			$(domElem).attr("zone", getCurrentArea().attr("id"));
		});
		
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
				loadTab('tab_pic_from_url');
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
				loadTab('tab_object_from_url');
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
				loadTab('tab_video_from_url');
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
        loadTab('tab_live_webcam');
      }
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
						$(".theslider").hide();	
						getCurrentArea().removeAttr("type");
						getCurrentArea().addClass("editable");
					}
				}
			}
	  );
  };
  
  /**
   * function called when user clicks on the delete icon of the zone
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
						$(".theslider").hide();	
						article_to_delete.remove();
						//set curSlide to the preious one if this was the last one
						if(curSlide == slideEls.length-1 && curSlide != 0){  //if we are in the first slide do not do -1
							curSlide -=1;
						}					
						V.SlidesUtilities.redrawSlides();						
		  			V.Editor.Thumbnails.redrawThumbnails();			
					}
				}
		  }
	  );
  };

  /**
   * function called when user clicks on template zone with class selectable
   * we change the border to indicate this zone has been selected and show the slider if the type is an image
   */
  var _onSelectableClicked = function(){
		setCurrentArea($(this));	
		_removeSelectableProperties($(this));
		_addSelectableProperties($(this));
		VISH.Editor.Tools.loadZoneTools($(this));
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
   * function called when user clicks on save
   * Generates the json for the current slides
   * covers the section element and every article inside
   * finally calls SlideManager with the generated json
   */
  var _onSaveButtonClicked = function(){
    if(slideEls.length === 0){
    	$.fancybox(
			  $("#message1_form").html(),
			  {
		      'autoDimensions'	: false,
		      'scrolling': 'no',
					'width'         	: 350,
					'height'        	: 200,
					'showCloseButton'	: false,
					'padding' 			: 5		
			  }
		  );
    } else {    
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
							//if user has answered "yes"
							if($("#save_answer").val() ==="true"){
								$("#save_answer").val("false");	
								var excursion = saveExcursion();	
								_afterSaveExcursion(excursion);			
							}	else {
								return false;
							}
					}
			  }
		  );
	  }
  };
    
    
  /**
   * function to save the excursion 
   */
  var saveExcursion = function(){
  	//first of all show all objects that have been hidden because they are in previous and next slides
  	//so they are not saved with style hidden
  	$('.object_wrapper').show();
  	//now save the excursion
    var excursion = {};
    //TODO decide this params
    excursion.id = '';
    excursion.title = excursionDetails.title;
    excursion.description = excursionDetails.description;
    excursion.avatar = excursionDetails.avatar;
		excursion.tags = excursionDetails.tags;
    excursion.author = '';
    excursion.slides = [];
    var slide = {};
    $('article').each(function(index,s){
      slide.id = $(s).attr('id'); //TODO what if saved before!
      slide.template = $(s).attr('template');
      slide.elements = [];
      var element = {};
      //important show it (the browser does not know the height and width if it is hidden)
      $(s).show();
      $(s).find('div').each(function(i,div){
        //to remove all the divs of the sliders, only consider the final boxes
        if($(div).attr("areaid") !== undefined){   
					
          element.id     = $(div).attr('id');
          element.type   = $(div).attr('type');
          element.areaid = $(div).attr('areaid');	 				 
									 
          if(element.type=="text"){
            element.body   = V.Editor.Text.changeFontPropertiesToSpan($(div).find(".wysiwygInstance"));
          } else if(element.type=="image"){
            element.body   = $(div).find('img').attr('src');
            element.style  = _getStylesInPercentages($(div), $(div).find('img'));
          } else if(element.type=="video"){
		          var video = $(div).find("video");
							element.poster = $(video).attr("poster");
							element.style  = _getStylesInPercentages($(div), $(video));
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
							$(object).removeAttr("style");
		    	    element.body   = VISH.Utils.getOuterHTML(object);
		    	    element.style  = _getStylesInPercentages($(div), $(object).parent());
		      } else if (element.type=="openquestion") {	   
		      		element.title   = $(div).find(".title_openquestion").val();
		        	element.question   = $(div).find(".value_openquestion").val();
		      } else if (element.type=="mcquestion") {     		      	
		      		element.question   = $(div).find(".value_multiplechoice_question").val();
		        	element.options = [];  	
		        	$(div).find('.multiplechoice_text').each(function(i, input_text){
				    element.options[i] = input_text.value;
	          		}); 
			  } else if(element.type === "snapshot"){
						  var snapshotWrapper = $(div).find(".snapshot_wrapper");
						  var snapshotIframe = $(snapshotWrapper).children()[0];
              $(snapshotIframe).removeAttr("style");
              element.body   = VISH.Utils.getOuterHTML(snapshotIframe);
              element.style  = _getStylesInPercentages($(div), snapshotWrapper);
							element.scrollTop = $(snapshotWrapper).scrollTop();
							element.scrollLeft = $(snapshotWrapper).scrollLeft();
		      } else if(typeof element.type == "undefined"){
						//Empty element, we don't save as empty text because if we do that when we edit everything is text
						//element.type = "empty";
						VISH.Debugging.log("Empty element");
					}
          slide.elements.push(element);
          element = {};
        }
      });
      excursion.slides.push(slide);
      slide = {};
    });
    
		saved_excursion = excursion;  
		VISH.Debugging.log(JSON.stringify(excursion));    
		return saved_excursion;     
  };
	
	var _afterSaveExcursion = function(excursion){
		if((VISH.Debugging)&&(VISH.Debugging.isDevelopping())){
      //Vish: OnSave Debug actions
      
      if(VISH.Debugging.getActionSave()=="view"){
        $('article').remove();
        $('#menubar').hide();
        $('#menubar_helpsection').hide();
        $('#joyride_help_button').hide();
        $('.theslider').hide();
        $(".nicEdit-panelContain").hide();
        $("#menubar-viewer").show();
        VISH.SlideManager.init(excursion);
      } else if (VISH.Debugging.getActionSave()=="edit") {
        $('article').remove();
        var options = {};
        options["developping"] = true;
        options["configuration"] = configuration;
        VISH.Editor.init(options, excursion);  //to edit the excursion
      }
      
    } else {
      //Vish: OnSave Production actions
      
      if(VISH.Configuration.getConfiguration()["VishIntegration"]){
        var send_type;
        if(excursion_to_edit){
          send_type = 'PUT'; //if we are editing
        } else {
          send_type = 'POST'; //if it is a new
        } 
        
        //POST to http://server/excursions/
        var jsonexcursion = JSON.stringify(excursion);
    	VISH.Debugging.log(jsonexcursion);   
        var params = {
          "excursion[json]": jsonexcursion,
          "authenticity_token" : initOptions["token"]
        }
        
        $.ajax({
          type    : send_type,
          url     : initOptions["postPath"],
          data    : params,
          success : function(data) {
              /*if we redirect the parent frame*/
              window.top.location.href = data.url;
          }     
        }); 
      } else {
				//Vish Standalone actions
        //Save to file its not possible... upload to another server? [...]
        
      }
    } 
	}
	
	/**
	 * function to get the styles in percentages
	 */
	var _getStylesInPercentages = function(parent, element){
		var WidthPercent = element.width()*100/parent.width();
		var HeightPercent = element.height()*100/parent.height();
    var TopPercent = element.position().top*100/parent.height();
    var LeftPercent = element.position().left*100/parent.width();
    return "position: relative; width:" + WidthPercent + "%; height:" + HeightPercent + "%; top:" + TopPercent + "%; left:" + LeftPercent + "%;" ;
	};
	
	var _getAspectRatio = function(element){
		return element.width()/element.height();
	}
	
	/**
	 * Function to move the slides left one item
	 * curSlide is set by slides.js and it is between 0 and the number of slides, so we use it to move one to the left
	 */
	var _onArrowLeftClicked = function(){
		V.SlidesUtilities.goToSlide(curSlide);
	};
	
	/**
	 * Function to move the slides right one item
	 * curSlide is set by slides.js and it is between 0 and the number of slides, so we use +2 to move one to the right
	 */
	var _onArrowRightClicked = function(){
		V.SlidesUtilities.goToSlide(curSlide+2);
	};
	
	
  //////////////////
  ///    Getters
  //////////////////
	
	var getParams = function(){
		return params;
	}
	
	/**
	 * function to get the template of the slide of current_el
	 * param area: optional param indicating the area to get the template, used for editing excursions
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
    if(params['current_el']){
      return params['current_el'];
    }
    return null;
  }
	
	var setCurrentArea = function(area){
		params['current_el'] = area;
	}
  
	var getSavedExcursion = function() {
		if(saved_excursion){
			return saved_excursion;
		} else {
			return null;
		}
	}
	
	
  /*
   Load the initial fancybox
   */
  
  var loadFancyBox = function(fancy) {
  	/* TODO: can we get all the tabs with JQuery and use it for construct the fancyBoxes hash? */ 
  	
        var fancyBoxes = {1: "templates", 2: "quizes"}	
				
		for( tab in fancyBoxes) {
		
			$('#'+fancyBoxes[tab]+'_content').hide();
			
			$('#tab_'+fancyBoxes[tab]).attr("class", "");
			$('#tab_'+fancyBoxes[tab]).attr("class", "fancy_tab");
			
		} 
		//just show the fancybox selected 
		$('#'+fancy+'_content').show();
		$('#tab_'+fancy).attr("class", "fancy_tab fancy_selected");
  }


	return {
		init					         	  : init,
		addDeleteButton						: addDeleteButton,
		loadTab 				        	: loadTab,
		getId                  		: getId,
		getTemplate            		: getTemplate,
		getCurrentArea        		: getCurrentArea,
		getParams            			: getParams,
		getOptions                : getOptions, 
		loadFancyBox			        : loadFancyBox,
		getSavedExcursion         : getSavedExcursion,
		saveExcursion             : saveExcursion
	};

}) (VISH, jQuery);
