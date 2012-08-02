VISH.Renderer = (function(V,$,undefined){
	
	var SLIDE_CONTAINER = null;
	var username = "";
	var token = "";
	var quiz_active = "";

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
			}
			else if(slide.elements[el].type === "image"){
				content += _renderImage(slide.elements[el],slide.template);
			}
			else if(slide.elements[el].type === "video"){
				content += renderVideo(slide.elements[el],slide.template);
			}
			else if(slide.elements[el].type === "object"){
				content += _renderObject(slide.elements[el],slide.template);
				classes += "object ";
			}
			else if(slide.elements[el].type === "snapshot"){
        content += _renderSnapshot(slide.elements[el],slide.template);
        classes += "snapshot ";
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
				content += _renderOpenquestion(slide.elements[el],slide.template);
				classes += "openquestion";
			}
			else if(slide.elements[el].type === "mcquestion"){
				
				//this will be call as many times as mcquestion have the excursion
				//isn't better to get the role value in the VISH.Quiz? 
				content +=V.Quiz.init(slide.elements[el],slide.template, slide.id);
				classes +="mcquestion";
			} else if ( slide.elements[el].type === "truefalsequestion") {
				
				content += _renderTrueFalseQuestion(slide.elements[el],slide.template);
			}
			else{
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
	 * Function to render an open question form inside an article (a slide)
	 */
	var _renderOpenquestion = function(element, template){
		
		var ret = "<form action='"+element['posturl']+"' method='post' style='text-align:center;'>";
			ret += "<label class='question_name'>Name:  </label>";
			ret += "<textarea id='pupil_name' rows='1' cols='50' class='question_name_input' placeholder='Write your name here'></textarea>";
			ret += "<h2 class='question'> Question: "+element['question']+"? </h2>";				
		
			ret += "<label class='label_question'>Answer: </label>";
			ret += "<textarea id='question_answer' rows='5' cols='50' class='question_answer' placeholder='Write your answer here'></textarea>";
		
		
			ret += "<button type='button' class='question_button'>Send</button>";
		
		
		return ret;		
	};
	
	/**
	 * Function to render a True False Question choice question form inside an article (a slide)
	 */
	
	var _renderTrueFalseQuestion = function(element, template){
		var next_num=0;
		
		var ret = "<div id='"+element['id']+"' class='truefalse_question'>";
		
		ret += "<div class='truefalse_question_container'>";
		//ret += "<div class='mcquestion_left'><h2 class='question'>"+ element['questions']+"?</h2>";
		
		ret += "<form class='truefalse_question_form' action='"+element['posturl']+"' method='post'>";
		//ret += "<label class='question_name'>Name:  </label>";
	     ret+= "<table id='truefalse_quiz_table_1' class='truefalse_quiz_table'><tr><th>True</th><th>False</th><th> Question </th></tr>";
	     
	     
	     //<input type='checkbox' id='1_true'/></td><td id='td_false_1'><input type='checkbox' id='1_false'/></td><td id='td_question_1'><textarea rows='1' cols='50' class='value_multiplechoice_question' placeholder='Write question here'></textarea></td></tr>              </table></div>
		
		
		for(var i = 0; i<element['questions'].length; i++){
		//not used
		var next_num = i;
		//not used
		var nextIndex = String.fromCharCode("a".charCodeAt(0) + (next_num)); 
		
			ret +="<tr id='tr_question_"+(i+1)+"'>";
			ret +="<td id='td_true_"+(i+1)+"'>";
			ret += "<input type='radio' name='tf_radio' value='true' /></td>";
			ret += "<td id='td_false_"+(i+1)+"'><input type='radio' name='tf_radio' value='false'/></td>";
			ret += "<td id='td_question_"+(i+1)+"'><label>"+element['questions'][i]['text_question']+"</label></td>";
			ret += "</tr>";
		
		}
		
		ret += "</table>";
	
	//	ret += "<img class='mch_statistics_icon' src='"+VISH.ImagesPath+"quiz/eye.png'/>";
		//ret += "<input type='submit' class='tfquestion_button' value='Start Quiz'/>";

		ret += "</form>";
		
		
		ret += "</div>";
		return ret;
	};

	return {
		init        : init,
		renderVideo : renderVideo,
		renderSlide : renderSlide
	};

}) (VISH,jQuery);

