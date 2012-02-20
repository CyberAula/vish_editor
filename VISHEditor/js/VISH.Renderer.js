VISH.Renderer = (function(V,$,undefined){
	
	var SLIDE_CONTAINER = null;

	var init        = function(){
		SLIDE_CONTAINER = $('.slides');
	}

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
			else if(slide.elements[el].type === "swf"){
				content += _renderSwf(slide.elements[el],slide.template);
				classes += "swf ";
			}
			else if(slide.elements[el].type === "applet"){
				content += _renderApplet(slide.elements[el],slide.template);
				classes += "applet ";
			}
			else if(slide.elements[el].type === "flashcard"){
				content += _renderFlashcard(slide.elements[el],slide.template);
				classes += "flashcard";
			}
		}

		SLIDE_CONTAINER.append("<article class='"+classes+"' id='"+slide.id+"'>"+content+"</article>");
	};

	var _renderText = function(element, template){
		return "<div class='"+template+"_"+element['areaid']+" "+template+"_text"+"'>"+element['body']+"</div>";
	};

	var _renderImage = function(element, template){
		return "<div class='"+template+"_"+element['areaid']+"'><img class='"+template+"_image' src='"+element['body']+"' /></div>";
	};

	var _renderSwf = function(element, template){
		return "<div class='swfelement "+template+"_"+element['areaid']+"' templateclass='"+template+"_swf"+"' src='"+element['body']+"'></div>";
	};

	var _renderApplet = function(element, template){
		return "<div class='appletelement "+template+"_"+element['areaid']+"' code='"+element['code']+"' width='"+element['width']+"' height='"+element['height']+"' archive='"+element['archive']+"' params='"+element['params']+"' ></div>";
	};
	
	var _renderFlashcard = function(element, template){
		return "<div class='"+template+"_"+element['areaid']+"'><canvas id='"+element['canvasid']+"'>Your browser does not support canvas</canvas></div>";
	};

	return {
		init        : init,
		renderSlide : renderSlide
	};

}) (VISH,jQuery);

