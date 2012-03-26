VISH.Editor = (function(V,$,undefined){
	
	var initOptions;
	var domId = 0;  //number for next doom element id
	
	// Hash to store: 
	// current_el that will be the zone of the template that the user has clicked
	var params = {
		current_el : null		
	};
	
	
	/**
	 * Initializes the VISH editor
	 * Adds the listeners to the click events in the different images and buttons
	 * Call submodule initializers
	 */
	var init = function(options){
		initOptions = options;
				
		$("a#addslide").fancybox();		
		$(document).on('click','.templatethumb', _onTemplateThumbClicked);
		$(document).on('click','#save', _onSaveButtonClicked);
		$(document).on('click','.editable', _onEditableClicked);
		$(document).on('click','.edit_pencil', _onEditableClicked);
			
		var evt = document.createEvent("Event");
		evt.initEvent("OURDOMContentLoaded", false, true); // event type,bubbling,cancelable
		document.dispatchEvent(evt);
		
		//Init submodules
		VISH.Debugging.init(true);
		VISH.Editor.Text.init();
		VISH.Editor.Video.init();
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
			switch(tab_id)	{		
				//Image
        case "tab_pic_from_url":
          VISH.Editor.Image.onLoadTab("url");
          break;
        case "tab_pic_upload":
          VISH.Editor.Image.onLoadTab("upload");
          break;
        case "tab_pic_repo":
          VISH.Editor.Image.Repository.onLoadTab();
          break;
        case "tab_pic_flikr":
          VISH.Editor.Image.Flikr.onLoadTab();
        break;
				
				//Video
				case "tab_video_from_url":
				  VISH.Editor.Video.HTML5.onLoadTab("url");
				  break;
				case "tab_video_upload":
          VISH.Editor.Video.HTML5.onLoadTab("upload");
          break;
				case "tab_video_repo":
				  VISH.Editor.Video.Repository.onLoadTab();
				  break;
				case "tab_video_youtube":
				  VISH.Editor.Video.Youtube.onLoadTab();
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
        VISH.Editor.Image.drawImage($("#"+id_to_get).val());
        break;
      case "flash_embed_code":
        console.log("Feature not implemented: Flash embed code")
        break;
      case "video_url":
        VISH.Editor.Video.HTML5.drawVideo($("#"+id_to_get).val())
        break;
      //case "add_your_input_id_here":
        //VISH.Editor.Resource.Module.function($("#"+id_to_get).val())
      // break;
      default:
        break;
    }
    
    //delete the value
    $("#"+id_to_get).val("");
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
	 * function called when user clicks on template
	 * Includes a new slide following the template selected
	 */
	var _onTemplateThumbClicked = function(event){
		var slide = V.Dummies.getDummy($(this).attr('template'));
		
		addSlide(slide);		
		
		$.fancybox.close();
		
		var evt = document.createEvent("Event");
		evt.initEvent("OURDOMContentLoaded", false, true); // event type,bubbling,cancelable
		document.dispatchEvent(evt);
		setTimeout("lastSlide()", 300);
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
		var content = $("#menuselect").clone().attr('id','');
		//add zone attr to the a elements to remember where to add the content
		content.find("a").each(function(index, domElem) {
			$(domElem).attr("zone", params['current_el'].attr("id"));
		});
		
		$(this).html(content);
		
		$("a.addpicture").fancybox({
			"onStart"  : function(data) {
				//re-set the params['current_el'] to the clicked zone, because maybe the user have clicked in another editable zone before this one
				var clickedZoneId = $(data).attr("zone");
				params['current_el'] = $("#" + clickedZoneId);
				loadTab('tab_pic_from_url');
			}
		});
		$("a.addflash").fancybox({
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				params['current_el'] = $("#" + clickedZoneId);
				loadTab('tab_flash_from_url');
			}
		});
		$("a.addvideo").fancybox({
			"onStart"  : function(data) {
				var clickedZoneId = $(data).attr("zone");
				params['current_el'] = $("#" + clickedZoneId);
				loadTab('tab_video_from_url');
			}
		});
	};


  /**
   * function called when user clicks on save
   * Generates the json for the current slides
   * covers the section element and every article inside
   * finally calls SlideManager with the generated json
   */
  var _onSaveButtonClicked = function(){
    var excursion = {};
    //TODO decide this params
    excursion.id = '';
    excursion.title = '';
    excursion.description = '';
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
          if(element.type==="text"){
            //TODO make this text json safe
            element.body   = $(div).find("div").html();
          } else if(element.type==="image"){
            element.body   = $(div).find('img').attr('src');
            element.style  = $(div).find('img').attr('style');
          } else if(element.type==="iframe"){
            element.body   = $(div).html();
          }
          slide.elements.push(element);
          element = {};
        }
      });
      excursion.slides.push(slide);
      slide = {};
    });
    var jsonexcursion = JSON.stringify(excursion);
    console.log(jsonexcursion);
    
    $('article').remove();
    $('#menubar').remove();
    $(".nicEdit-panelContain").remove();
    V.SlideManager.init(excursion);
    
    
    /*
    //POST to http://server/excursions/
    var params = {
      "excursion[json]": jsonexcursion,
      "authenticity_token" : initOptions["token"]
    }
    
    $.post(initOptions["postPath"], params, function(data) {
          document.open();
      document.write(data);
      document.close();
      });
      */
    
  };
	
	
	
	
	//////////////////
  ///    Getters
  //////////////////
	
	var getParams = function(){
		return params;
	}
	
	var getTemplate = function() {
		if(params['current_el']){
			return params['current_el'].parent().attr('template');
		}
		return null;
	}
	
	var getCurrentArea = function() {
    if(params['current_el']){
      return params['current_el']
    }
    return null;
  }


	return {
		init					          : init,
		loadTab 				        : loadTab,
		getValueFromFancybox    : getValueFromFancybox,
		getId                   : getId,
		getTemplate             : getTemplate,
		getCurrentArea          : getCurrentArea,
		getParams               : getParams
	};

}) (VISH, jQuery);
