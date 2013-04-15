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
	var renderSlide = function(slide, extra_classes, extra_buttons){
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
				article = _renderStandardSlide(slide, extra_classes, extra_buttons);
				break;
			case V.Constant.FLASHCARD:
				article = _renderFlashcardSlide(slide, extra_classes, extra_buttons);
				break;
			case V.Constant.VTOUR:
				article = _renderVirtualTourSlide(slide, extra_classes, extra_buttons);
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
		for(el in slide.elements){
			if(!V.Renderer.Filter.allowElement(slide.elements[el])){
				content += V.Renderer.Filter.renderContentFiltered(slide.elements[el],slide.template);
			} else if(slide.elements[el].type === V.Constant.TEXT){
				content += _renderText(slide.elements[el],slide.template);
			} else if(slide.elements[el].type === V.Constant.IMAGE){
				content += _renderImage(slide.elements[el],slide.template);
			} else if(slide.elements[el].type === V.Constant.VIDEO){
				content += renderVideo(slide.elements[el],slide.template);
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

		//When render a simple_quiz for voting
		//if(slide.type==V.Constant.QUIZ) {
		// if(slide.type==V.Constant.QUIZ_SIMPLE) {
		// 	content += V.Quiz.Renderer.renderQuiz(slide.quiztype , slide ,slide.template +"_"+slide.areaid, null, slide.id);
		// 	classes += V.Constant.QUIZ;
		// }

		return "<article class='"+ extra_classes + " " +classes+"' id='"+slide.id+"'>"+ extra_buttons + content+"</article>";
	};

	var _renderFlashcardSlide = function(slide, extra_classes, extra_buttons){
		var all_slides = "";
		//The flashcard has its own slides
		for(index in slide.slides){
			//Subslide id its a composition of parent id and its own id.
			var subslide = slide.slides[index];
			all_slides += _renderStandardSlide(subslide, "subslide", "<div class='close_subslide' id='close"+subslide.id+"'></div>");
		}
		var div_for_slides_hidden = "<div class='subslides' >"+all_slides+"</div>";
		return $("<article class='"+ extra_classes + " flashcard_slide' type='flashcard' avatar='"+slide.background+"' id='"+slide.id+"'>"+ extra_buttons + div_for_slides_hidden + "</article>");
	};

	var _renderVirtualTourSlide = function(slide, extra_classes, extra_buttons){
		var all_slides = "";
		for(index in slide.slides){
			var subslide = slide.slides[index];
			all_slides += _renderStandardSlide(subslide, "subslide", "<div class='close_subslide' id='close"+subslide.id+"'></div>");
		}
		var div_for_slides_hidden = "<div class='subslides' >"+all_slides+"</div>";
		return $("<article class='"+ extra_classes + " virtualTour_slide' type='virtualTour' id='"+slide.id+"'>"+ extra_buttons + div_for_slides_hidden + "</article>");
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
		        	V.Flashcard.addArrow(slide.id, poi, true);
		  		}
				break;
			case V.Constant.VTOUR:
					V.VirtualTour.drawMap(slide);
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
		var div = $("<div id='"+element['id']+"' class='"+template+"_"+element['areaid']+"'></div>");
		var img = $("<img class='"+template+"_image' src='"+element['body']+"' style='"+element['style']+"' />");

		if(element['hyperlink']){
			var a = $("<a href='" + element['hyperlink'] + "' target='blank_'></a>");
			$(a).append(img);
			$(div).append(a);
		} else {
			$(div).append(img);
		}
		
		return V.Utils.getOuterHTML(div);
	};
	
	/**
	 * Function to render a video inside an article (a slide)
	 */
	var renderVideo = function(element, template){
		var rendered = "<div id='"+element['id']+"' class='"+template+"_"+element['areaid']+"'>";
		var style = (element['style'])?"style='" + element['style'] + "'":"";
		var controls= (element['controls'])?"controls='" + element['controls'] + "' ":"controls='controls' ";
		var autoplay= (element['autoplay'])?"autoplayonslideenter='" + element['autoplay'] + "' ":"";
		var poster=(element['poster'])?"poster='" + element['poster'] + "' ":"";
		var loop=(element['loop'])?"loop='loop' ":"";
		var sources = element['sources'];
		var videoId = V.Utils.getId();

		if(typeof sources == "string"){
			sources = JSON.parse(sources)
		}
		
		rendered = rendered + "<video id='" + videoId + "' class='" + template + "_video' preload='metadata' " + style + controls + autoplay + poster + loop + ">";
		
		$.each(sources, function(index, source) {
			var type = (source.type)?"type='" + source.type + "' ":"";
			rendered = rendered + "<source src='" + source.src + "' " + type + ">";
		});
		
		if(sources.length>0){
			rendered = rendered + "<p>Your browser does not support HTML5 video.</p>";
		}
		
		rendered = rendered + "</video>";
		
		return rendered;
	};

	
	/**
	 * Function to render an object inside an article (a slide)
	 */
	var _renderObject = function(element, template){
		var objectInfo = V.Object.getObjectInfo(element.body);
		switch(objectInfo.type){
			case "youtube":
				return _renderYoutubeVideo(element,template,objectInfo.source);
				break;
			default:
				var style = (element['style'])? element['style'] : "";
				var body = element['body'];
				var zoomInStyle = (element['zoomInStyle'])? element['zoomInStyle'] : "";
				return "<div id='"+element['id']+"' class='objectelement "+template+"_"+ element['areaid'] + "' objectStyle='" + style + "' zoomInStyle='" + zoomInStyle + "' objectWrapper='" + body + "'>" + "" + "</div>";
				break;
		}
	};

	var _renderYoutubeVideo = function(element,template,source){
		var ytContainerId = V.Utils.getId();
		var style = (element['style'])? element['style'] : "";
		var body = element['body'];
		var zoomInStyle = (element['zoomInStyle'])? element['zoomInStyle'] : "";
		return "<div id='"+element['id']+"' class='objectelement youtubeelement "+template+"_"+ element['areaid'] + "' objectStyle='" + style + "' zoomInStyle='" + zoomInStyle + "' source='" + source + "' ytContainerId='" + ytContainerId + "'>" + "</div>";
	}
	
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
	 * when entering a slide with an applet class we call V.AppletPlayer.loadSWF (see V.SlideManager._onslideenter) and it will add the params inside the div
	 */
	var _renderApplet = function(element, template){
		return "<div id='"+element['id']+"' class='appletelement "+template+"_"+element['areaid']+"' code='"+element['code']+"' width='"+element['width']+"' height='"+element['height']+"' archive='"+element['archive']+"' params='"+element['params']+"' ></div>";
	};
	
	/**
	 * Function to render a flashcard inside an article (a slide)
	 * we only add canvas inside the div element
	 * the flashcard will be drawn inside the canvas element
	 */
	var _renderFlashcard = function(element, template){
		return "<div id='"+element['id']+"' class='template_flashcard'><canvas id='"+element['canvasid']+"'>Your browser does not support canvas</canvas></div>";
	};

	return {
		init        : init,
		renderVideo : renderVideo,
		renderSlide : renderSlide
	};

}) (VISH,jQuery);

