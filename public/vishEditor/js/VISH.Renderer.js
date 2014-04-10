VISH.Renderer = (function(V,$,undefined){
	
	var init  = function(){
		V.Renderer.Filter.init();
	}

	var renderSlide = function(slide){
		var article;

		if(!extra_classes){
			var extra_classes = "";
		}
		if(!extra_buttons){
			var extra_buttons = "";
		}

		var isSlideset = V.Slideset.isSlideset(slide.type);

		if(isSlideset){
			article = _renderSlideset(slide);
		} else {
			article = _renderStandardSlide(slide);
		}

		if(article){
			$('section.slides').append($(article));

			//For slidesets, we have to draw it after render its scaffolding
			if(isSlideset){
				V.Slideset.draw(slide);
			}
		}
	};

	var _renderStandardSlide = function(slide,options){
		var content = "";
		var classes = "";
		var extraClasses = "";
		var extraButtons = "";

		if(typeof options != "undefined"){
			if(typeof options.extraClasses == "string"){
				extraClasses = options.extraClasses;
			}
			if(typeof options.extraButtons == "string"){
				extraButtons = options.extraButtons;
			}
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
			} else if(slide.elements[el].type === V.Constant.AUDIO){
				content += _renderHTML5Audio(slide.elements[el],slide.template);
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

		return "<article class='"+ extraClasses + " " +classes+"' type='"+V.Constant.STANDARD+"' template='" + slide.template + "' id='"+slide.id+"'>"+ extraButtons + content+"</article>";
	};

	var _renderSlideset = function(slidesetJSON){
		var allSubslides = "";
		for(index in slidesetJSON.slides){
			var subslide = slidesetJSON.slides[index];
			allSubslides += _renderStandardSlide(subslide, {extraClasses: "hide_in_smartcard", extraButtons: "<div class='close_subslide' id='close"+subslide.id+"'></div>"});
		}
		return $("<article type='"+slidesetJSON.type+"' id='"+slidesetJSON.id+"'>"+allSubslides+"</article>");
	};


	/*
	 * Render elements
	 */

	var _renderEmpty = function(element, template){
		return "<div id='"+element['id']+"' class='"+template+"_"+element['areaid']+" "+template+"_text"+"'></div>";
	};

	var _renderText = function(element, template){
		return "<div id='"+element['id']+"' class='VEtextArea "+template+"_"+element['areaid']+" "+template+"_text"+"'>"+element['body']+"</div>";
	};
	
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
		var video = V.Video.HTML5.renderVideoFromJSON(videoJSON,{id: V.Utils.getId(videoJSON['id'] + "_video"),extraClasses: [template + "_video"], timestamp: true});
		rendered = rendered + video + "</div>";
		return rendered;
	};

	var _renderHTML5Audio = function(audioJSON, template){
		var rendered = "<div id='"+audioJSON['id']+"' class='"+template+"_"+audioJSON['areaid']+"'>";
		var audio = V.Audio.HTML5.renderAudioFromJSON(audioJSON,{id: V.Utils.getId(audioJSON['id'] + "_audio"),extraClasses: [template + "_audio"], timestamp: true});
		rendered = rendered + audio + "</div>";
		return rendered;
	};
	
	var _renderObject = function(element,template){
		var objectInfo = V.Object.getObjectInfo(element.body);
		switch(objectInfo.type){
			case V.Constant.MEDIA.YOUTUBE_VIDEO:
				return V.Video.Youtube.renderVideoFromJSON(element,{extraClasses: "objectelement youtubeelement " + template+"_"+ element['areaid']});
				break;
			case V.Constant.MEDIA.SCORM_PACKAGE:
				return V.SCORM.renderSCORMFromJSON(element,{extraClasses: "" + template +"_" + element['areaid']});
				break;
			default:
				var style = (element['style'])? element['style'] : "";
				var body = element['body'];
				var zoomInStyle = (element['zoomInStyle'])? element['zoomInStyle'] : "";
				return "<div id='"+element['id']+"' class='objectelement "+template+"_"+ element['areaid'] + "' objectStyle='" + style + "' zoomInStyle='" + zoomInStyle + "' objectWrapper='" + body + "'>" + "" + "</div>";
				break;
		}
	};
	
	var _renderSnapshot = function(element, template){
		var style = (element['style'])? element['style'] : "";
		var body = element['body'];
		var scrollTop = (element['scrollTop'])? element['scrollTop'] : 0;
		var scrollLeft = (element['scrollLeft'])? element['scrollLeft'] : 0;
		return "<div id='"+element['id']+"' class='snapshotelement "+template+"_"+element['areaid']+ "' template='" + template + "' objectStyle='" + style + "' scrollTop='" + scrollTop + "' scrollTopOrigin='" + scrollTop + "' scrollLeft='" + scrollLeft + "' scrollLeftOrigin='" + scrollLeft + "' objectWrapper='" + body + "'>" + "" + "</div>";
	};
	
	var _renderApplet = function(element, template){
		return "<div id='"+element['id']+"' class='appletelement "+template+"_"+element['areaid']+"' code='"+element['code']+"' width='"+element['width']+"' height='"+element['height']+"' archive='"+element['archive']+"' params='"+element['params']+"' ></div>";
	};

	return {
		init        		: init,
		renderSlide 		: renderSlide
	};

}) (VISH,jQuery);

