VISH.Utils = (function(V,undefined){
	
	var init = function(){
		//Code here...
	}

   /**
	* Return a unic id.
	*/
	var domId = 0; 
	var getId = function(){
		domId = domId +1;
		return "unicID_" + domId;
	};

	var getOuterHTML = function(tag){
		//In some old browsers (before firefox 11 for example) outerHTML does not work
		//Trick to provide full browser support
		if (typeof($(tag)[0].outerHTML)=='undefined'){
			return $(tag).clone().wrap('<div></div>').parent().html();
		} else {
			return $(tag)[0].outerHTML;
		}
	}



	var loadDeviceCSS = function(){
		//Set device CSS
		if(VISH.Status.getDevice().desktop){
			loadCSS("device/desktop.css");
		} else if(VISH.Status.getDevice().mobile){
			loadCSS("device/mobile.css");
		} else if(VISH.Status.getDevice().tablet){
			loadCSS("device/tablet.css");
		}

		//Set browser CSS
		switch(VISH.Status.getDevice().browser.name){
			case VISH.Constant.FIREFOX:
				loadCSS("browser/firefox.css");
				break;
			case VISH.Constant.IE:
				loadCSS("browser/ie.css");
				break;
			case VISH.Constant.CHROME:
				loadCSS("browser/chrome.css");
				break;
		}
	}

   /**
	* Function to dinamically add a css
	*/
	var loadCSS = function(path){
		$("head").append('<link rel="stylesheet" href="' + VISH.StylesheetsPath + path + '" type="text/css" />');
	};

    var generateTable = function(author,title,description){
        
	    if(!author){
	     author = "";
	    }
	    if(!title){
	      title = "";
	    }
	    if(!description){
	      description = "";
	    }
    
      return "<table class=\"metadata\">"+
         "<tr class=\"even\">" +
           "<td class=\"title header_left\">" + VISH.Editor.I18n.getTrans("i.Author") + "</td>" + 
           "<td class=\"title header_right\"><div class=\"height_wrapper\">" + author + "</div></td>" + 
         "</tr>" + 
         "<tr class=\"odd\">" + 
           "<td class=\"title\">" + VISH.Editor.I18n.getTrans("i.Title") + "</td>" + 
           "<td class=\"info\"><div class=\"height_wrapper\">" + title + "</div></td>" + 
         "</tr>" + 
         "<tr class=\"even\">" + 
           "<td colspan=\"2\" class=\"title_description\">" + VISH.Editor.I18n.getTrans("i.Description") + "</td>" + 
         "</tr>" + 
         "<tr class=\"odd\">" + 
           "<td colspan=\"2\" class=\"info_description\"><div class=\"height_wrapper_description\">" + description + "</div></td>" + 
         "</tr>" + 
       "</table>";
    }
			
	//Check minium requirements to init vish editor
	var checkMiniumRequirements = function(){
		var browserRequirements = true;
		var device = VISH.Status.getDevice();

		switch(device.browser.name){
			case VISH.Constant.IE:
				if(VISH.Editing){
					if(device.browser.version < 9){
						browserRequirements = false;
					}
				} else {
					if(device.browser.version < 8){
						browserRequirements = false;
					}
				}
				break;
			case VISH.Constant.FIREFOX:
				break;
			case VISH.Constant.CHROME:
				break;
			default:
				//Allow...
			break;
		}
				
		if(!browserRequirements){
			$.fancybox(
				$("#requirements_form_wrapper").html(),
				{
					'autoDimensions'  : false,
					'width'           : 650,
					'height'          : 400,
					'showCloseButton' : false,
					'padding'       : 0,
					'onClosed'      : function(){
						//Do nothing!
					}
				}
			);
			return false;
		}

		return true;
	}
		
    var convertToTagsArray = function(tags){
	    var tagsArray = [];
	    
	    if((!tags)||(tags.length==0)){
	      return tagsArray;
	    }
	    
	    $.each(tags, function(index, tag) {
	      tagsArray.push(tag.value)
	    });
	    
	    return tagsArray;
    }
		
		var getURLParameter = function(name){
			return decodeURIComponent((location.search.match(RegExp("[?|&]"+name+'=(.+?)(&|$)'))||[,null])[1]);
		}
		
		//Help function to autocomplete user inputs.
		//Add HTTP if is not present.
		var autocompleteUrls = function(input){
			var http_urls_pattern=/(^http(s)?:\/\/)/g
			var objectInfo = VISH.Object.getObjectInfo();
			
			if((objectInfo.wrapper==null)&&(input.match(http_urls_pattern)==null)){
        return "http://" + input;
      } else {
				return input;
			}
		}


   var filterFilePath = function(path){
	 	 return path.replace("C:\\fakepath\\","");
	 }

var getZoomInStyle = function(zoom){
    var style = "";
    style = style + "-ms-transform: scale(" + zoom + "); ";
		style = style + "-ms-transform-origin: 0 0; ";
    style = style + "-moz-transform: scale(" + zoom + "); ";
		style = style + "-moz-transform-origin: 0 0; ";
    style = style + "-o-transform: scale(" + zoom + "); ";
		style = style + "-o-transform-origin: 0 0; ";
    style = style + "-webkit-transform: scale(" + zoom + "); ";
		style = style + "-webkit-transform-origin: 0 0; ";
    return style;
   }

var getZoomFromStyle = function(style){
    
		var zoom = 1; //Initial or default zoom
		
		if(!style){
			return zoom;
		}
		
		//Patterns
		var moz_zoom_pattern = /-moz-transform: ?scale\(([0-9]+.[0-9]+)\)/g
		var webkit_zoom_pattern = /-webkit-transform: ?scale\(([0-9]+.[0-9]+)\)/g
		var opera_zoom_pattern = /-o-transform: ?scale\(([0-9]+.[0-9]+)\)/g
		var ie_zoom_pattern = /-ms-transform: ?scale\(([0-9]+.[0-9]+)\)/g

		
    $.each(style.split(";"), function(index, property){
			 
	     if (property.match(moz_zoom_pattern) != null) {
			 	//Mozilla Firefox
		   	var result = moz_zoom_pattern.exec(property);
		   	if (result[1]) {
		   		zoom = parseFloat(result[1]);
		   		return false;
		   	}
		   } else if (property.match(webkit_zoom_pattern)!=null) {
			 	  //Google Chrome
          var result = webkit_zoom_pattern.exec(property);
          if(result[1]){
            zoom = parseFloat(result[1]);
            return false;
          }
	     } else if (property.match(opera_zoom_pattern)!=null) {
			 	  //Opera
          var result = opera_zoom_pattern.exec(property);
          if(result[1]){
            zoom = parseFloat(result[1]);
            return false;
          }
			 } else if (property.match(ie_zoom_pattern)!=null) {
			 	  //Iexplorer
          var result = ie_zoom_pattern.exec(property);
          if(result[1]){
            zoom = parseFloat(result[1]);
            return false;
          }
       }
    });
		
    return zoom;
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
		//hide previous tab
		$(".fancy_tab_content").hide();
		//show content
		$("#" + tab_id + "_content").show();
		//deselect all of them
		$(".fancy_tab").removeClass("fancy_selected");
		//select the correct one
		$("#" + tab_id).addClass("fancy_selected");
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





   return {
		init 					: init,
		getId					: getId,
		getOuterHTML 			: getOuterHTML,
		generateTable 			: generateTable,
		loadDeviceCSS			: loadDeviceCSS,
		loadCSS					: loadCSS,
		checkMiniumRequirements : checkMiniumRequirements,
		convertToTagsArray 		: convertToTagsArray,
		getURLParameter 		: getURLParameter,
		getZoomFromStyle 		: getZoomFromStyle,
		getZoomInStyle    		: getZoomInStyle,
		autocompleteUrls 		: autocompleteUrls,
		filterFilePath 			: filterFilePath, 
		loadTab 				: loadTab
   };

}) (VISH);