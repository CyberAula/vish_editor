VISH.Renderer = (function(V,$,undefined){
	
	var SLIDE_CONTAINER = null;
	

	/**
	 * Function to initialize the renderer
	 * Only gets the section element from the html page
	 */
	var init  = function(){
		SLIDE_CONTAINER = $('.slides');
		V.Renderer.Filter.init();
	}

	/**
	 * slides.html only have a section element and in this function we add an article element
	 * with the proper content for the slide
	 */	
	var renderSlide = function(slide, extra_classes, extra_buttons, slidenumber){
		var article;

		if(!extra_classes){
			var extra_classes = "";
		}
		if(!extra_buttons){
			var extra_buttons = "";
		}

		switch(slide.type){
			case undefined:
			case V.Constant.STANDARD:
			case V.Constant.QUIZ_SIMPLE:
				article = _renderStandardSlide(slide, extra_classes, extra_buttons,slidenumber);
				break;
			case V.Constant.FLASHCARD:
				article = _renderFlashcardSlide(slide, extra_classes, extra_buttons,slidenumber);
				break;
			case V.Constant.VTOUR:
				article = _renderVirtualTourSlide(slide, extra_classes, extra_buttons,slidenumber);
				break;
			case V.Constant.EVIDEO:
				article = _renderEVideoSlide(slide, extra_classes, extra_buttons,slidenumber);
				break;
			default:
				article = null;
				break;
		}

		if(article){
			SLIDE_CONTAINER.append($(article));
			_afterDrawSlide(slide);
		}
	};


	//////////
	/// RENDERERS
	//////////

	var _renderStandardSlide = function(slide, extra_classes, extra_buttons){
		var content = "";
		var classes = "";
		if((typeof extra_classes == "undefined")||(extra_classes===null)){
			extra_classes = "";
		}

		for(el in slide.elements){
			if(!V.Renderer.Filter.allowElement(slide.elements[el])){
				content += V.Renderer.Filter.renderContentFiltered(slide.elements[el],slide.template);
			} else if(slide.elements[el].type === V.Constant.TEXT){
				content += _renderText(slide.elements[el],slide.template);
			} else if(slide.elements[el].type === V.Constant.IMAGE){
				content += _renderImage(slide.elements[el],slide.template);
			} else if(slide.elements[el].type === V.Constant.VIDEO){
				content += _renderHTML5Video(slide.elements[el],slide.template);
			} else if(slide.elements[el].type === V.Constant.MEDIA.AUDIO){
				content += renderAudio(slide.elements[el],slide.template);
			} else if(slide.elements[el].type === V.Constant.OBJECT){
				content += _renderObject(slide.elements[el],slide.template);
				classes += "object ";
			} else if(slide.elements[el].type === V.Constant.SNAPSHOT){
        		content += _renderSnapshot(slide.elements[el],slide.template);
        		classes += "snapshot ";
      		} else if(slide.elements[el].type === V.Constant.APPLET){
				content += _renderApplet(slide.elements[el],slide.template);
				classes += "applet ";
			} else if(slide.elements[el].type === V.Constant.QUIZ){
				content += V.Quiz.render(slide.elements[el],slide.template);
				classes += V.Constant.QUIZ;
			} else {
				content += _renderEmpty(slide.elements[el], slide.template);
			}
		}

		return "<article class='"+ extra_classes + " " +classes+"' type='"+V.Constant.STANDARD+"' id='"+slide.id+"'>"+ extra_buttons + content+"</article>";
	};

	var _renderFlashcardSlide = function(slide, extra_classes, extra_buttons, slidenumber){
		var all_slides = "";
		//The flashcard has its own slides
		for(index in slide.slides){
			//Subslide id its a composition of parent id and its own id.
			var subslide = slide.slides[index];
			all_slides += _renderStandardSlide(subslide, "hide_in_smartcard", "<div class='close_subslide' id='close"+subslide.id+"'></div>");
		}
		return $("<article class='"+ extra_classes + "' slidenumber='"+slidenumber+"' type='"+V.Constant.FLASHCARD+"' avatar='"+slide.background+"' id='"+slide.id+"'>"+ extra_buttons + all_slides + "</article>");
	};

	var _renderVirtualTourSlide = function(slide, extra_classes, extra_buttons, slidenumber){
		var all_slides = "";
		for(index in slide.slides){
			var subslide = slide.slides[index];
			all_slides += _renderStandardSlide(subslide, "hide_in_smartcard", "<div class='close_subslide' id='close"+subslide.id+"'></div>");
		}
		return $("<article class='"+ extra_classes + "' slidenumber='"+slidenumber+"' type='"+V.Constant.VTOUR+"' id='"+slide.id+"'>"+ extra_buttons + all_slides + "</article>");
	};

	var _renderEVideoSlide = function(slide, extra_classes, extra_buttons, slidenumber){
		var all_slides = "";
		for(index in slide.slides){
			var subslide = slide.slides[index];
			all_slides += _renderStandardSlide(subslide, "hide_in_smartcard", "<div class='close_subslide' id='close"+subslide.id+"'></div>");
		}
		return $("<article class='"+ extra_classes + "' slidenumber='"+slidenumber+"' type='"+V.Constant.EVIDEO+"' id='"+slide.id+"'>"+ extra_buttons + all_slides + "</article>");
	};


	////////////
	//After Render Slide Actions
	////////////
	var _afterDrawSlide = function(slide){
		switch(slide.type){
			case undefined:
			case V.Constant.STANDARD:
				break;
			case V.Constant.FLASHCARD:
				//Add the background and pois
				$("#"+ slide.id).css("background-image", slide.background);
				
				//And now we add the points of interest with their click events to show the slides
		  		for(index in slide.pois){
		  			var poi = slide.pois[index];
		        	V.Flashcard.addArrow(slide.id, poi);
		  		}
				break;
			case V.Constant.VTOUR:
				V.VirtualTour.drawMap(slide);
				break;
			case V.Constant.EVIDEO:
				V.EVideo.drawEVideo(slide);
				break;
			default:
				break;
		}
	}

	/**
	 * Function to render text inside an article (a slide)
	 */
	var _renderText = function(element, template){
		return "<div id='"+element['id']+"' class='VEtextArea "+template+"_"+element['areaid']+" "+template+"_text"+"'>"+element['body']+"</div>";
	};
	
	/**
	 * Function to render empty inside an article (a slide)
	 */
	var _renderEmpty = function(element, template){
		return "<div id='"+element['id']+"' class='"+template+"_"+element['areaid']+" "+template+"_text"+"'></div>";
	};

	/**
	 * Function to render an image inside an article (a slide)
	 */
	var _renderImage = function(element, template){
		if(typeof element['style'] == "undefined"){
			style = "max-height: 100%; max-width: 100%;";
		} else {
			style = element['style'];
		}

		var div = $("<div id='"+element['id']+"' class='"+template+"_"+element['areaid']+"'></div>");
		var img = $("<img class='"+template+"_image' src='"+element['body']+"' style='"+style+"' />");

		if(element['hyperlink']){
			var a = $("<a href='" + element['hyperlink'] + "' target='blank_'></a>");
			$(a).append(img);
			$(div).append(a);
		} else {
			$(div).append(img);
		}
		
		return V.Utils.getOuterHTML(div);
	};
	
	var _renderHTML5Video = function(videoJSON, template){
		var rendered = "<div id='"+videoJSON['id']+"' class='"+template+"_"+videoJSON['areaid']+"'>";
		var video = V.Video.HTML5.renderVideoFromJSON(videoJSON,{videoClass: template + "_video"});
		rendered = rendered + video + "</div>";
		return rendered;
	};

	var renderAudio = function(element, template){
		var rendered = "<div id='"+element['id']+"' class='"+template+"_"+element['areaid']+"'>";
			var style = (element['style'])?"style='" + element['style'] + "'":"";
		var controls= (element['controls'])?"controls='" + element['controls'] + "' ":"controls='controls' ";
		var sources = element['sources'];
		console.log(sources);

		if(typeof sources == "string"){
			sources = JSON.parse(sources)
		}
		
		rendered = rendered + "<audio class='" + template + "_audio' preload='metadata' "  + controls  + ">";
		
		$.each(sources, function(index, source) {
			var type = (source.type)?"type='" + source.type + "' ":"";
			rendered = rendered + "<source src='" + source.src + "' " + type + ">";
		});
		
		if(sources.length>0){
			rendered = rendered + "<p>Your browser does not support HTML5 video.</p>";
		}
		
		rendered = rendered + "</audio>";
		
		return rendered;
	};
	
	/**
	 * Function to render an object inside an article (a slide)
	 */
	var _renderObject = function(element,template){
		var objectInfo = V.Object.getObjectInfo(element.body);
		switch(objectInfo.type){
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
				return V.Video.Youtube.renderVideoFromJSON(element,{videoClass: template+"_"+ element['areaid']});
				break;
			default:
				var style = (element['style'])? element['style'] : "";
				var body = element['body'];
				var zoomInStyle = (element['zoomInStyle'])? element['zoomInStyle'] : "";
				return "<div id='"+element['id']+"' class='objectelement "+template+"_"+ element['areaid'] + "' objectStyle='" + style + "' zoomInStyle='" + zoomInStyle + "' objectWrapper='" + body + "'>" + "" + "</div>";
				break;
		}
	};
	
	/**
   * Function to render an snapshot inside an article (a slide)
   */
	var _renderSnapshot = function(element, template){
		var style = (element['style'])? element['style'] : "";
		var body = element['body'];
		var scrollTop = (element['scrollTop'])? element['scrollTop'] : 0;
		var scrollLeft = (element['scrollLeft'])? element['scrollLeft'] : 0;
		return "<div id='"+element['id']+"' class='snapshotelement "+template+"_"+element['areaid']+ "' template='" + template + "' objectStyle='" + style + "' scrollTop='" + scrollTop + "' scrollTopOrigin='" + scrollTop + "' scrollLeft='" + scrollLeft + "' scrollLeftOrigin='" + scrollLeft + "' objectWrapper='" + body + "'>" + "" + "</div>";
	};
	
	/**
	 * Function to render an applet inside an article (a slide)
	 * the applet object and its params are not really inside the article but in the archive attribute, width, height and params of the div
	 * when entering a slide with an applet class we call V.AppletPlayer.loadSWF
	 */
	var _renderApplet = function(element, template){
		return "<div id='"+element['id']+"' class='appletelement "+template+"_"+element['areaid']+"' code='"+element['code']+"' width='"+element['width']+"' height='"+element['height']+"' archive='"+element['archive']+"' params='"+element['params']+"' ></div>";
	};


	return {
		init        		: init,
		renderSlide 		: renderSlide
	};

}) (VISH,jQuery);

