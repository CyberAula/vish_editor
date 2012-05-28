
VISH.Editor = (function(V,$,undefined){
	
	var initOptions;
	var domId = 0;  //number for next doom element id
	

	// hash to store the excursions details like Title, Description, etc.
	var excursionDetails = {}; 
	var excursion_to_edit = null;
	
	// Hash to store: 
	// current_el that will be the zone of the template that the user has clicked
	var params = {
		current_el : null		
	};
	
	
	/**
	 * Initializes the VISH editor
	 * Adds the listeners to the click events in the different images and buttons
	 * Call submodule initializers
	 * options is a hash with params and options from the server, example of full options hash:
	 * {"token"; "453452453", "ownerId":"ebarra", "ownerName": "Enrique Barra", "postPath": "/excursions.json", "documentsPath": "/documents.json", "lang": "es"}
	 * excursion is the excursion to edit (in not present, a new excursion is created)
	 */
	var init = function(options, excursion){
		//first set VISH.Editing to true
		VISH.Editing = true;
		if(options){
			initOptions = options;
			if(options['developping']){
				VISH.Debugging.enableDevelopingMode();
			}
		}
		else{
			initOptions = {};
		}
		
		//if we have to edit
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
			'width': 800,
    		'height': 600,
    		'padding': 0
    	});
    	$(document).on('click', '#edit_excursion_details', _onEditExcursionDetailsButtonClicked);
    	$(document).on('click', '#save_excursion_details', _onSaveExcursionDetailsButtonClicked);		
		$(document).on('click','.templatethumb', _onTemplateThumbClicked);
		$(document).on('click','#save', _onSaveButtonClicked);
		$(document).on('click','.editable', _onEditableClicked);
		$(document).on('click','.selectable', _onSelectableClicked);
		$(document).on('click','.delete_content', _onDeleteItemClicked);
		$(document).on('click','.delete_slide', _onDeleteSlideClicked);
		//arrows in button panel
		$(document).on('click','#arrow_left_div', _onArrowLeftClicked);
		$(document).on('click','#arrow_right_div', _onArrowRightClicked);
		
		//used directly from SlideManager, if we separate editor from viewer that code would have to be in a common file used by editor and viewer
		_addEditorEnterLeaveEvents();
		
		V.SlidesUtilities.redrawSlides();
		
		addEventListeners(); //comes from slides.js to be called only once
		
		if(excursion){
			//hide objects (the _onslideenterEditor event will show the objects in the current slide)
			$('.object_wrapper').hide()
		}
		
		//Init submodules
		V.Debugging.init(true);
		V.Editor.Text.init();
		V.Editor.Image.init();
		V.Editor.Video.init();
		V.Editor.Object.init();
		V.Editor.AvatarPicker.init();
		V.Editor.I18n.init(options["lang"]);
		V.Editor.Quiz.init();
		// Intial box to input the details related to the excursion
		$("a#edit_excursion_details").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'height': 600,
			'padding': 0,
			'hideOnOverlayClick': false,
      		'hideOnContentClick': false,
			'showCloseButton': false
		});
		
		// The box is launched when the page is loaded
		if(excursion === undefined){
			$("#edit_excursion_details").trigger('click');
		}
		//Remove overflow from fancybox
//		$($("#fancybox-content").children()[0]).css('overflow','hidden')
		//if click on begginers tutorial->launch it
		$(document).on('click','#start_tutorial', _startTutorial);

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
	 */
	var loadTab = function (tab_id){
	    //deselect all of them
	    $(".fancy_tab").removeClass("fancy_selected");
	    //select the correct one
	    $("#" + tab_id).addClass("fancy_selected");
	    
	    //hide previous tab
	    $(".fancy_tab_content").hide();
	    //show content
	    $("#" + tab_id + "_content").show();

      //Submodule callbacks
			
		switch(tab_id) {
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
				

			//Flash
			case "tab_flash_from_url":
				VISH.Editor.Object.onLoadTab("url");
				break;
			case "tab_flash_upload":
				VISH.Editor.Object.onLoadTab("upload");
				break;
			case "tab_flash_repo":
				VISH.Editor.Object.Repository.onLoadTab();
				break;
				
				
			default:
				break;
		}

	};


  /**
   * Function to get the value from the input identified by the id param and draw it in the zone in params['current_el']
   */
  var getValueFromFancybox = function(id_to_get){
    $.fancybox.close();
    
	//Call the draw function of the submodule
    switch(id_to_get)  {
      case "picture_url":
        V.Editor.Image.drawImage($("#"+id_to_get).val());
        break;
      case "flash_embed_code":
    	V.Editor.Object.drawObject($("#"+id_to_get).val())
        break;
      case "video_url":
        //V.Editor.Video.HTML5.drawVideoWithUrl($("#"+id_to_get).val())
				V.Editor.Object.drawObject($("#"+id_to_get).val())
        break;
      //case "add_your_input_id_here":
        //VISH.Editor.Resource.Module.function($("#"+id_to_get).val())
      // break;
      default:
        break;
    }
    
    //delete the value
    $("#"+id_to_get).val("");
    
    //finally set focus to current_area
    var current_area = VISH.Editor.getCurrentArea();
    current_area.trigger("focus");   
    
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
   * function to start the walkthrough
   */
  var _startTutorial = function(){
   	WalkMeAPI.startWalkthruById(5033, 0);
  }
  
	/**
	 * function callen when the user clicks on the edit
	 * excursion details button
	 */
	var _onEditExcursionDetailsButtonClicked = function(event){
		// Intial box to input the details related to the excursion
		$("a#edit_excursion_details").fancybox({
			'autoDimensions' : false,
			'width': 800,
			'height': 600,
			'padding': 0
		})
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
		$('#excursion_details_error').hide();
		$.fancybox.close();
	};

	/**
	 * function called when user clicks on template
	 * Includes a new slide following the template selected
	 */
	var _onTemplateThumbClicked = function(event){
		var slide = V.Dummies.getDummy($(this).attr('template'));
		
		//VISH.Debugging.log("slide es: " + slide );
				
		V.SlidesUtilities.addSlide(slide);	//undefined 
		//V.Editor.Thumbnails.addThumbnail("t" + $(this).attr('template'), slideEls.length + 1); //it is slideEls.length +1 because we have recently added a slide and it is not in this array
		
		$.fancybox.close();
		
		V.SlidesUtilities.redrawSlides();
		setTimeout("VISH.SlidesUtilities.lastSlide()", 300);
		
	};

	/**
	 * function called when user clicks on an editable element
	 * Event launched when an editable element belonging to the slide is clicked
	 */
	var _onEditableClicked = function(event){
		//first remove the "editable" class because we are going to add clickable icons there and we don´t want it to be editable any more
		$(this).removeClass("editable");
		params['current_el'] = $(this);
				
		//need to clone it, because we need to show it many times, not only the first one
		//so we need to remove its id		
		var content = null;
		
		if($(this).attr("areaid")==="header"){
			content = $("#menuselect_for_header").clone().attr('id','');
		}
		else{
			content = $("#menuselect").clone().attr('id','');
		}
				
		//add zone attr to the a elements to remember where to add the content
		content.find("a").each(function(index, domElem) {
			$(domElem).attr("zone", params['current_el'].attr("id"));
		});
		
		$(this).html(content);
		
		$("a.addpicture").fancybox({
			'autoDimensions' : false,
			'width': 800,
    		'height': 600,
			'padding' : 0,
			"onStart"  : function(data) {
				//re-set the params['current_el'] to the clicked zone, because maybe the user have clicked in another editable zone before this one
				var clickedZoneId = $(data).attr("zone");
				params['current_el'] = $("#" + clickedZoneId);
				loadTab('tab_pic_from_url');
			}
		});
		$("a.addflash").fancybox({
			'autoDimensions' : false,
			'width': 800,
    		'height': 600,
			'padding' : 0,
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				params['current_el'] = $("#" + clickedZoneId);
				loadTab('tab_flash_from_url');
			}
		});
		$("a.addvideo").fancybox({
			'autoDimensions' : false,
			'width': 800,
    		'height': 600,
			'padding' : 0,
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				params['current_el'] = $("#" + clickedZoneId);
				loadTab('tab_video_from_url');
			}
		});
	};


  /**
   * function called when user clicks on the delete icon of the zone
   */
  var _onDeleteItemClicked = function(){
  	params['current_el'] = $(this).parent();
  	$("#image_template_prompt").attr("src", VISH.ImagesPath + params['current_el'].attr("type") + ".png");
  	$.fancybox(
		$("#prompt_form").html(),
		{
        	'autoDimensions'	: false,
			'width'         	: 350,
			'height'        	: 150,
			'showCloseButton'	: false,
			'padding' 			: 0,
			'onClosed'			: function(){
				//if user has answered "yes"
				if($("#prompt_answer").val() ==="true"){
					$("#prompt_answer").val("false");
					params['current_el'].html("");					
					$(".theslider").hide();	
					params['current_el'].removeAttr("type");
					params['current_el'].addClass("editable");
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
  	_removeSelectableProperties();		
  	$(this).css("cursor", "auto");
  	//add menuselect and delete content button
  	$(this).find(".menuselect_hide").show();
  	$(this).find(".delete_content").show();
  		
  	//show sliders  	
  	if($(this).attr("type")==="image" || $(this).attr("type")==="object" || $(this).attr("type")==="video"){
  		var the_id;
  		switch($(this).attr("type")){
  			case "image":
  				the_id = $(this).find("img").attr("id");
  				break;
  			case "object":
  				the_id = $(this).find(".object_wrapper").attr("id");
  				break;
  			case "video":
  				the_id = $(this).find("video").attr("id");
  				break;
  		}
  		
  		//the id is "draggableunicID_1" we want to remove "draggable"
  		the_id = the_id.substring(9);
  		
  		$("#sliderId" + the_id).show();  		
  	}
  	
  	//add css
  	$(this).css("border-color", "rgb(255, 2, 94)");
	$(this).css("-webkit-box-shadow", "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 100, 100, 0.6)");
	$(this).css("-moz-box-shadow", "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 100, 100, 0.6)");
	$(this).css("box-shadow", "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 100, 100, 0.6)");
	$(this).css("outline", "0");
	$(this).css("outline", "thin dotted \9");
  };
  
  var _removeSelectableProperties = function(){  	
  	$(".theslider").hide();
  	$(".menuselect_hide").hide();
  	$(".delete_content").hide();
  	
  	//remove css
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
				'width'         	: 350,
				'height'        	: 200,
				'showCloseButton'	: false,
				'padding' 			: 5		
			}
		);
    }
    else{    
	    $.fancybox(
			$("#save_form").html(),
			{
	        	'autoDimensions'	: false,
				'width'         	: 350,
				'height'        	: 150,
				'showCloseButton'	: false,
				'padding' 			: 0,
				'onClosed'			: function(){
					//if user has answered "yes"
					if($("#save_answer").val() ==="true"){
						$("#save_answer").val("false");	
						_saveExcursion();				
					}
					else{
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
  var _saveExcursion = function(){
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
    excursion.author = '';
    excursion.slides = [];
    var slide = {};
    $('article').each(function(index,s){
      slide.id = $(s).attr('id'); //TODO what if saved before!
      slide.template = $(s).attr('template');
      slide.elements = [];
      var element = {};
      $(s).find('div').each(function(i,div){
        //to remove all the divs of the sliders, only consider the final boxes
        if($(div).attr("areaid") !== undefined){
          element.id     = $(div).attr('id');
          element.type   = $(div).attr('type');
          element.areaid = $(div).attr('areaid');
                   
          if(element.type=="text"){
            //TODO make this text json safe
            element.body   = $(div).find(".wysiwygInstance").html();
          } else if(element.type=="image"){
            element.body   = $(div).find('img').attr('src');
            element.style  = $(div).find('img').attr('style');
          } else if(element.type=="video"){
		          var video = $(div).find("video");
							element.poster = $(video).attr("poster");
							element.style  = $(video).attr('style');
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
		    	    element.body   = VISH.Utils.getOuterHTML(object);
		    	    element.style  = $(object).parent().attr('style');
		      } else if (element.type=="openquestion") {	   
		      	element.title   = $(div).find(".title_openquestion").val();
		        element.question   = $(div).find(".value_openquestion").val();
		      } else if (element.type=="mcquestion") {     		      	
		      	element.question   = $(div).find(".value_multiplechoice_question").val();
		        element.options = [];  	
		        var array_options = $(div).find(".multiplechoice_text");
		        $('.multiplechoice_text').each(function(i, input_text){
				      element.options[i] = input_text.value;
	          }); 		
		      }
          slide.elements.push(element);
          element = {};
        }
      });
      excursion.slides.push(slide);
      slide = {};
    });
    var jsonexcursion = JSON.stringify(excursion);
    VISH.Debugging.log(jsonexcursion);
    
    /*
    $('article').remove();
    $('#menubar').remove();
    $('.theslider').remove();
    $(".nicEdit-panelContain").remove();  
    V.SlideManager.init(excursion);
    */
    
    
    //POST to http://server/excursions/
    var params = {
      "excursion[json]": jsonexcursion,
      "authenticity_token" : initOptions["token"]
    }
    
    var send_type;
    if(excursion_to_edit){
     	send_type = 'PUT'; //if we are editing
    }
    else{
    	send_type = 'POST'; //if it is a new
    }    
    
    $.ajax({
    	type    : send_type,
    	url     : initOptions["postPath"],
    	data    : params,
    	success : function(data) {
    		$('article').remove();
    		$('#menubar').remove();
    		$('.theslider').remove();
    		$(".nicEdit-panelContain").remove();  
        
        	$('#excursion_iframe', window.parent.document).height("680"); //to resize the iframe
        	
        	V.SlideManager.init(data); 
    	}    	
    });
    	          
  };
	
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
		}
		else if(params['current_el']){
			return params['current_el'].parent().attr('template');
		}
		return null;
	}
	
	var getCurrentArea = function() {
	    if(params['current_el']){
	      return params['current_el'];
	    }
	    return null;
  }


	return {
		init					         	  : init,
		addDeleteButton						: addDeleteButton,
		loadTab 				        	: loadTab,
		getValueFromFancybox    	: getValueFromFancybox,
		getId                  		: getId,
		getTemplate            		: getTemplate,
		getCurrentArea        		: getCurrentArea,
		getParams            			: getParams,
		getOptions                : getOptions
	};

}) (VISH, jQuery);
