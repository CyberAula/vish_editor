VISH.Editor.Utils = (function(V,$,undefined){

  /**
   * function to dispatch the event that redraws the slides
   * also redraws the thumbnails
   */
  var redrawSlides = function(){
		$(document).trigger('OURDOMContentLoaded');
  };
    

    var hideSlides = function(){
    	$(".slides > article").addClass("temp_hidden");
    };

    var showSlides = function(){
    	$(".slides > article").removeClass("temp_hidden");
    };

	/*
	 * function to draw elements in an area, try to fit in the drawable area 
	 * 
	 */
	var dimentionToDraw = function (w_zone, h_zone, w_content, h_content) {
		var element_type;
		
		
		var dimentions_for_drawing = {width:  350, height: 195};
		
		var aspect_ratio_zone = w_zone/h_zone;
		var aspect_ratio_content = w_content/h_content;
		
		if (aspect_ratio_zone>aspect_ratio_content) {
			
				dimentions_for_drawing.width = aspect_ratio_content*h_zone;
				dimentions_for_drawing.height = h_zone;
			return dimentions_for_drawing;
			
		}
		else {
			
				dimentions_for_drawing.width = w_zone;
				dimentions_for_drawing.height = w_zone/aspect_ratio_content;
				
			return  dimentions_for_drawing;
			
			
		}	
	};

  /**
   * function to add a new slide
   */
  var addSlide = function(slide){
  	//VISH.Debugging.log("slide es " + slide);
  	//VISH.Debugging.log(".slides es " + $('.slides'));
  	$('.slides').append(slide);
  };

	
  
	
	/**
   * Function to get width in pixels from a style attribute.
   * If width attribute is given by percent, area (parent container) attribute is needed.
   */
  var getWidthFromStyle = function(style,area){
    return getPixelDimensionsFromStyle(style,area)[0];
  };
	
	 /**
   * Function to get width in pixels from a style attribute.
   * If width attribute is given by percent, area (parent container) attribute is needed.
   */
  var getHeightFromStyle = function(style,area){
    return getPixelDimensionsFromStyle(style,area)[1];
  };
	
 /**
  * Function to get width and height in pixels from a style attribute.
  * If widht or height attribute is given by percent, area (parent container) attribute is needed to convert to pixels.
  */
  var getPixelDimensionsFromStyle = function(style,area){
	var dimensions = [];
	var width=null;
	var height=null;
	var width_percent_pattern = /width:\s?([0-9]+(\.[0-9]+)?)%/g
	var width_px_pattern = /width:\s?([0-9]+(\.?[0-9]+)?)px/g
	var height_percent_pattern = /height:\s?([0-9]+(\.[0-9]+)?)%/g
	var height_px_pattern = /height:\s?([0-9]+(\.?[0-9]+)?)px/g
    
    $.each(style.split(";"), function(index, property){
        //Look for property starting by width
        if(property.indexOf("width") !== -1){
          
          if(property.match(width_px_pattern)){
            //Width defined in px.
            var result = width_px_pattern.exec(property);
            if(result[1]){
              width = result[1];
            }
          } else if(property.match(width_percent_pattern)){
            //Width defined in %.
            var result = width_percent_pattern.exec(property);
            if(result[1]){
              var percent = result[1];
              if(area){
                width = $(area).width()*percent/100;
              }
            }
          }
        } else  if(property.indexOf("height") !== -1){
					
          if(property.match(height_px_pattern)){
            //height defined in px.
            var result = height_px_pattern.exec(property);
            if(result[1]){
              height = result[1];

            }
          } else if(property.match(height_percent_pattern)){
            //Width defined in %.
            var result = height_percent_pattern.exec(property);
            if(result[1]){
              var percent = result[1];
              if(area){
                height = $(area).height()*percent/100;
              }
            }
          }
        }
    });
		
	dimensions.push(width);
	dimensions.push(height);
	return dimensions;
  };
	
	
	var setStyleInPixels = function(style,area){
		var filterStyle = "";
		$.each(style.split(";"), function(index, property){
       if ((property.indexOf("width") === -1)&&(property.indexOf("height")) === -1) {
			   filterStyle = filterStyle + property + "; ";
	     }
    });
		var dimensions = getPixelDimensionsFromStyle(style,area);
		
		if((dimensions)&&(dimensions[0])){
			filterStyle = filterStyle + "width: " + dimensions[0] + "px; ";
			if(dimensions[1]){
				filterStyle = filterStyle + "height: " + dimensions[1] + "px; ";
			}
		}
		return filterStyle;
	}
	
	
	 
	var addZoomToStyle = function(style,zoom){
		if(!style){
			return null;
		}

		var filterStyle = "";
		$.each(style.split(";"), function(index, property){
			if ((property.indexOf("-ms-transform") === -1)&&(property.indexOf("-moz-transform") === -1)
			 &&(property.indexOf("-o-transform") === -1)&&(property.indexOf("-webkit-transform") === -1)
			 &&(property.indexOf("-moz-transform-origin") === -1)&&(property.indexOf("-webkit-transform-origin") === -1)
			 &&(property.indexOf("-o-transform-origin") === -1)&&(property.indexOf("-ms-transform-origin") === -1)) {
				filterStyle = filterStyle + property + "; ";
			}
		});
			
	//  -moz-transform: scale(1.0);
	//  -moz-transform-origin: 0 0;
	//  -o-transform: scale(1.0);
	//  -o-transform-origin: 0 0;
	//  -webkit-transform: scale(1.0);
	//  -webkit-transform-origin: 0 0;
	//  -ms-transform: scale(1.0);
	//  -ms-transform-origin: 0 0;
			
		if(zoom){
			filterStyle = filterStyle + "-ms-transform: scale(" + zoom + "); ";
			filterStyle = filterStyle + "-ms-transform-origin: 0 0; ";
			filterStyle = filterStyle + "-moz-transform: scale(" + zoom + "); ";
			filterStyle = filterStyle + "-moz-transform-origin: 0 0; ";
			filterStyle = filterStyle + "-o-transform: scale(" + zoom + "); ";
			filterStyle = filterStyle + "-o-transform-origin: 0 0; ";
			filterStyle = filterStyle + "-webkit-transform: scale(" + zoom + "); ";
			filterStyle = filterStyle + "-webkit-transform-origin: 0 0; ";
		}

	    return filterStyle;
   }
	 
	/**
	 * function to get the styles in percentages
	 */
	var getStylesInPercentages = function(parent, element){
		var WidthPercent = element.width()*100/parent.width();
		var HeightPercent = element.height()*100/parent.height();
		var TopPercent = element.position().top*100/parent.height();
		var LeftPercent = element.position().left*100/parent.width();
		return "position: relative; width:" + WidthPercent + "%; height:" + HeightPercent + "%; top:" + TopPercent + "%; left:" + LeftPercent + "%;" ;
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

			//Quiz
			case "tab_quiz":
				VISH.Editor.Object.Live.onLoadTab("quiz");
				break;
				

			//Default
			default:
				break;
	  }
	};

	
	
	return {
		getWidthFromStyle   : getWidthFromStyle,
		getHeightFromStyle  : getHeightFromStyle,
		getPixelDimensionsFromStyle : getPixelDimensionsFromStyle,
		hideSlides			: hideSlides,
		setStyleInPixels  : setStyleInPixels,		
		addZoomToStyle  : addZoomToStyle,	
		getStylesInPercentages : 	getStylesInPercentages,	
		addSlide		    : addSlide,
		redrawSlides	    : redrawSlides,
		dimentionToDraw     : dimentionToDraw,
		loadTab 			: loadTab,
		showSlides			: showSlides
	};

}) (VISH, jQuery);