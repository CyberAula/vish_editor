VISH.Editor.Renderer = (function(V,$,undefined){
	
	var slides = null;
	
	/**
	 * Function to initialize the renderer 
	 */
	var init = function(presentation){
		$('#presentation_title').val(presentation.title);
		$('#presentation_description').val(presentation.description);
		$('#presentation_avatar').val(presentation.avatar);

		//also the pedagogical fields if any
		
		if(presentation.age_range){
			var start_range = presentation.age_range.substring(0, presentation.age_range.indexOf("-")-1);
			var end_range = presentation.age_range.substring(presentation.age_range.indexOf("-")+2);
			$("#slider-range" ).slider( "values", [start_range, end_range] );
			$("#age_range").val(start_range + " - " + end_range);
			$("#age_range").val(presentation.age_range);
		} else {
			$("#age_range").val(VISH.Constant.AGE_RANGE);
		}
		$("#subject_tag").val(presentation.subject);
		$("#language_tag").val(presentation.language);
		$("#educational_objectives_tag").val(presentation.educational_objectives);
		$("#acquired_competencies_tag").val(presentation.adquired_competencies);

		VISH.Themes.selectTheme(presentation.theme);

		switch(presentation.type){
			case V.Constant.FLASHCARD:
				var flashcard = VISH.Editor.Flashcard.undoNestedSlidesInFlashcard(presentation.slides[0]);
				slides = flashcard.slides;
				for(var i=0;i<slides.length;i++){
					_renderSlide(slides[i], i+1);
				}
				VISH.Editor.Flashcard.loadFlashcard(presentation);
				break;
			case V.Constant.VTOUR:
				break;
			case VISH.Constant.PRESENTATION:
			default:
				slides = presentation.slides;
				for(var i=0;i<slides.length;i++){
						if(slides[i].type === V.Constant.FLASHCARD){
							_renderFlashcard(slides[i], i+1);
						} else {
							_renderSlide(slides[i], i+1);			
						}
				}
				break;
		}
	};
	
		
	/**
	 * function to render one slide in editor
	 */
	var _renderSlide = function(slide, slideNumber){
		var template = slide.template.substring(1); //slide.template is "t10", with this we remove the "t"
		var scaffold = V.Editor.Dummies.getScaffoldForSlide(template, slideNumber, slide);

		V.Slides.addSlide(scaffold);
		V.Editor.Utils.redrawSlides();
		V.Slides.lastSlide();  //important to get the browser to draw everything

		for(el in slide.elements){
			var areaId = slide.elements[el].id;
			var area = $("div#" + areaId + "[areaid='" + slide.elements[el].areaid +"']");
			
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
			}
			 else if(slide.elements[el].type === "quiz"){
			 	var received = JSON.stringify(slide.elements[el]);
				V.Editor.Quiz.addQuiz(slide.elements[el].quiztype, $("#"+slide.elements[el].id), slide.elements[el].options.choices.length);
				V.Editor.Quiz.drawQuiz(slide.elements[el].quiztype, $("#"+slide.elements[el].id) , slide.elements[el].question, slide.elements[el].options['choices'], slide.elements[el].quiz_id);
			}
		}
	
		//finally give class "editable" to the empty areas
		$("div.selectable:empty").addClass("editable");		
	};
	
	/**
	 * function to render one flashcard inside a presentation
	 */
	var _renderFlashcard = function(slide, slideNumber){
		VISH.Editor.Flashcard.addFlashcard(slide);
		V.Renderer.renderSlide(slide, "", "<div class='delete_slide'></div>");
	};


	return {
		init	: init
	};

}) (VISH, jQuery);