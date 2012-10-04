VISH.Editor.Renderer = (function(V,$,undefined){
	
	var slides = null;
	
	/**
	 * Function to initialize the renderer 
	 */
	var init = function(presentation){
		$('#presentation_title').val(presentation.title);
		$('#presentation_description').val(presentation.description);
		$('#presentation_avatar').val(presentation.avatar);

		VISH.Themes.selectTheme(presentation.theme);	

		slides = presentation.slides;
		for(var i=0;i<slides.length;i++){
				_renderSlide(slides[i], i, presentation.id);			
		}	
	};
	
		
	/**
	 * function to render one slide in editor
	 */
	var _renderSlide = function(slide, position, presentation_id){
		
		var template = slide.template.substring(1); //slide.template is "t10", with this we remove the "t"
		var scaffold = V.Dummies.getDummy(template, position, presentation_id, true);  
		
		V.Editor.Utils.addSlide(scaffold);	
		
		V.Editor.Utils.redrawSlides();
		V.Slides.lastSlide();  //important to get the browser to draw everything
		
		for(el in slide.elements){
			var area = $("#article_" + presentation_id + "_" + position + " div[areaid='" + slide.elements[el].areaid +"']");
			if(area.length === 0){
				continue; //with first version presentations we had different template names and some fails, this condition avoid that
			}

			if(slide.elements[el].type === "text"){
				V.Editor.Text.launchTextEditor({}, area, slide.elements[el].body);  //in this case there is no event, so we pass a new empty object
			} else if(slide.elements[el].type === "image"){
				V.Editor.Image.drawImage(slide.elements[el].body, area, slide.elements[el].style, slide.elements[el].hyperlink);
			}	else if(slide.elements[el].type === "video"){
				var options = [];
				options['poster'] = slide.elements[el].poster;
				options['autoplay'] = slide.elements[el].autoplay;
				var sourcesArray = [];
				$.each(JSON.parse(slide.elements[el].sources), function(index, source) {
					sourcesArray.push([source.src, source.type]);
				});
				V.Editor.Video.HTML5.drawVideo(sourcesArray, options, area);
			}	else if(slide.elements[el].type === "object"){				
				V.Editor.Object.drawObject(slide.elements[el].body, area, slide.elements[el].style,slide.elements[el].zoomInStyle);
			} else if(slide.elements[el].type === "snapshot"){
				V.Editor.Object.Snapshot.drawSnapShot(slide.elements[el].body, area, slide.elements[el].style,slide.elements[el].scrollTop,slide.elements[el].scrollLeft);
			} /* else if(slide.elements[el].type === "mcquestion"){
				V.Editor.Quiz.drawQuiz(slide.elements[el].question, slide.elements[el].options); 
			} */
			 else if(slide.elements[el].type === "quiz"){
				V.Editor.Quiz.addQuiz(slide.elements[el].quiztype, slide.elements[el].id);
				V.Editor.Quiz.drawQuiz(slide.elements[el].quiztype,slide.elements[el].id , slide.elements[el].question, slide.elements[el].options);
			}
		}
	
		//finally give class "editable" to the empty areas
		$("div.selectable:empty").addClass("editable");		
	};
	


return {
		init					: init

	};

}) (VISH, jQuery);