VISH.Renderer = (function(V,$,undefined){
	
	var SLIDE_CONTAINER = null;
	/*var username = "";
	var token = "";
	var quiz_active = ""; */
	var trueFalseAnswers;
	

	/**
	 * Function to initialize the renderer
	 * Only gets the section element from the html page
	 */
	var init  = function(){
		SLIDE_CONTAINER = $('.slides');
		
	}

	/**
	 * slides.html only have a section element and in this function we add an article element
	 * with the proper content for the slide
	 */	
	var renderSlide = function(slide){
		var content = "";
		var classes = "";
		for(el in slide.elements){
			if(slide.elements[el].type === "text"){
				content += _renderText(slide.elements[el],slide.template);
			} else if(slide.elements[el].type === "image"){
				content += _renderImage(slide.elements[el],slide.template);
			} else if(slide.elements[el].type === "video"){
				content += renderVideo(slide.elements[el],slide.template);
			} else if(slide.elements[el].type === "object"){
				content += _renderObject(slide.elements[el],slide.template);
				classes += "object ";
			} else if(slide.elements[el].type === "snapshot"){
        		content += _renderSnapshot(slide.elements[el],slide.template);
        		classes += "snapshot ";
      		} else if(slide.elements[el].type === "applet"){
				content += _renderApplet(slide.elements[el],slide.template);
				classes += "applet ";
			} else if(slide.elements[el].type === "flashcard"){
				content = _renderFlashcard(slide.elements[el],slide.template);
				classes += "flashcard";
			} else if(slide.elements[el].type === "openquestion"){
				content += _renderQuiz("openquestion",slide.elements[el],slide.template);
				classes += "openquestion";
			} else if(slide.elements[el].type === "mcquestion"){				
				//var for activate a votation quiz 
				var quiz_id = slide.quiz_id;
				//V.Debugging.log("quiz id value is:" + quiz_id);
				//this will be call as many times as mcquestions have the excursion
				//before slide.id
				content +=_renderQuiz("mcquestion",slide.elements[el], slide.template, slide.id, slide.quiz_id);
				classes +="mcquestion";
			} else if ( slide.elements[el].type === "truefalsequestion") {
				//content += _renderTrueFalseQuestion(slide.elements[el],slide.template);
				content +=_renderQuiz("truefalsequestion",slide.elements[el], slide.template, slide.id);
				classes +="truefalsequestion";
			} else {
				content += _renderEmpty(slide.elements[el], slide.template);
			}
		}

		SLIDE_CONTAINER.append("<article class='"+classes+"' id='"+slide.id+"'>"+content+"</article>");
	};


	/**
	 * Function to render text inside an article (a slide)
	 */
	var _renderText = function(element, template){
		return "<div id='"+element['id']+"' class='"+template+"_"+element['areaid']+" "+template+"_text"+"'>"+element['body']+"</div>";
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
		return "<div id='"+element['id']+"' class='"+template+"_"+element['areaid']+"'><img class='"+template+"_image' src='"+element['body']+"' style='"+element['style']+"' /></div>";
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
		if(typeof sources == "string"){
			sources = JSON.parse(sources)
		}
		
		rendered = rendered + "<video class='" + template + "_video' preload='metadata' " + style + controls + autoplay + poster + loop + ">";
		
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
		var style = (element['style'])? element['style'] : "";
		var body = element['body'];
		var zoomInStyle = (element['zoomInStyle'])? element['zoomInStyle'] : "";
		return "<div id='"+element['id']+"' class='objectelement "+template+"_"+ element['areaid'] + "' objectStyle='" + style + "' zoomInStyle='" + zoomInStyle + "' objectWrapper='" + body + "'>" + "" + "</div>";
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
	 * when entering a slide with an applet class we call V.AppletPlayer.loadSWF (see VISH.SlideManager._onslideenter) and it will add the params inside the div
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

	/**
	 * Function to render a quiz inside an article (a slide)
	 */
	var _renderQuiz = function(quizType, element, template, slide, quiz_id){
		switch(quizType){
			case "mcquestion":
				return VISH.Quiz.renderMcQuestion(element, template, slide, quiz_id);
				break;
			case "openQuestion":
				return VISH.Quiz.renderOpenquestion(element, template);
				break;
			default:
				break;
		}
	};

	return {
		init        : init,
		renderVideo : renderVideo,
		renderSlide : renderSlide
	};

}) (VISH,jQuery);

