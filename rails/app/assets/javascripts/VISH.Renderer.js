VISH.Renderer = (function(V,$,undefined){
	
	var SLIDE_CONTAINER = null;

	/**
	 * Function to initialize the renderer
	 * Only gets the section element from the html page
	 */
	var init        = function(){
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
			}
			else if(slide.elements[el].type === "image"){
				content += _renderImage(slide.elements[el],slide.template);
			}
			else if(slide.elements[el].type === "video"){
				content += _renderVideo(slide.elements[el],slide.template);
			}
			else if(slide.elements[el].type === "swf"){
				content += _renderSwf(slide.elements[el],slide.template);
				classes += "swf ";
			}
			else if(slide.elements[el].type === "iframe"){  //used for youtube videos
				content += _renderIframe(slide.elements[el],slide.template);
				classes += "iframe ";
			}
			else if(slide.elements[el].type === "applet"){
				content += _renderApplet(slide.elements[el],slide.template);
				classes += "applet ";
			}
			else if(slide.elements[el].type === "flashcard"){
				content = _renderFlashcard(slide.elements[el],slide.template);
				classes += "flashcard";
			}
			else if(slide.elements[el].type === "openquestion"){
				content = _renderOpenquestion(slide.elements[el],slide.template);
			}
			else if(slide.elements[el].type === "mcquestion"){
				content = _renderMcquestion(slide.elements[el],slide.template);
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
	 * Function to render an image inside an article (a slide)
	 */
	var _renderImage = function(element, template){
		return "<div id='"+element['id']+"' class='"+template+"_"+element['areaid']+"'><img class='"+template+"_image' src='"+element['body']+"' style='"+element['style']+"' /></div>";
	};
	
	/**
	 * Function to render a video inside an article (a slide)
	 */
	var _renderVideo = function(element, template){
		var rendered = "<div id='"+element['id']+"' class='"+template+"_"+element['areaid']+"'>"
		var controls=(element['controls'])?"controls='controls' ":""
		var autoplay=(element['autoplay'])?"autoplayonslideenter='true' ":""
		var poster=(element['poster'])?"poster='" + element['poster'] + "' ":""
		var loop=(element['loop'])?"loop='loop' ":""
		var sources = JSON.parse(element['sources'])
		
		rendered = rendered + "<video class='" + template + "_video' preload='metadata' " + controls + autoplay + poster + loop + ">"
		
		$.each(sources, function(index, value) {
			rendered = rendered + "<source src='" + value.src + "' type='" + value.mimetype + "'>"
		});
		
		if(sources.length>0){
			rendered = rendered + "<p>Your browser does not support HTML5 video.</p>"
		}
		
		rendered = rendered + "</video>"
		
		return rendered
	};

	/**
	 * Function to render a flash object inside an article (a slide)
	 * the flash object is not really inside the article but in the src attribute of the div
	 * when entering a slide with a swf class we call V.SWFPlayer.loadSWF (see VISH.SlideManager._onslideenter) and it will add the src inside the div
	 */
	var _renderSwf = function(element, template){
		return "<div id='"+element['id']+"' class='swfelement "+template+"_"+element['areaid']+"' templateclass='"+template+"_swf"+"' src='"+element['body']+"'></div>";
	};
	
	/**
	 * Function to render an iframe inside an article (a slide)	 * 
	 * when entering a slide with an iframe class we call V.SWFPlayer.loadIframe (see VISH.SlideManager._onslideenter) and it will add the src inside the div
	 */
	var _renderIframe = function(element, template){
		return "<div id='"+element['id']+"' class='iframeelement "+template+"_"+element['areaid']+"' templateclass='"+template+"_iframe"+"' src='"+element['body']+"'></div>";
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
	 * Function to render an open question form inside an article (a slide)
	 */
	var _renderOpenquestion = function(element, template){
		var ret = "<div id='"+element['id']+"' class='question_title'>"+element['body']+"</div>";
		ret += "<form action='"+element['posturl']+"' method='post'>";
		ret += "<label class='question_name'>Name: </label>";
		ret += "<input id='pupil_name' class='question_name_input'></input>";
		ret += "<label class='question_answer'>Answer: </label>";
		ret += "<textarea class='question_answer_input'></textarea>";
		ret += "<button type='button' class='question_button'>Send</button>";
		return ret;		
	};
	
	/**
	 * Function to render a multiple choice question form inside an article (a slide)
	 */
	var _renderMcquestion = function(element, template){
		var ret = "<div id='"+element['id']+"' class='question_title'>"+element['body']+"</div>";
		ret += "<form action='"+element['posturl']+"' method='post'>";
		ret += "<label class='question_name'>Name: </label>";
		ret += "<input id='pupil_name' class='question_name_input'></input>";
		
		for(var i = 0; i<element['options'].length; i++){
			ret += "<label class='mc_answer'><input type='radio' name='mc_radio' value='0'>"+element['options'][i]+"</label>";
		}
		
		ret += "<button type='button' class='question_button'>Send</button>";
		return ret;
	};

	return {
		init        : init,
		renderSlide : renderSlide
	};

}) (VISH,jQuery);

