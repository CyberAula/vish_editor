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
			$("#age_range").val(V.Constant.AGE_RANGE);
		}
		$("#subject_tag").val(presentation.subject);
		$("#language_tag").val(presentation.language);
		$("#educational_objectives_tag").val(presentation.educational_objectives);
		$("#acquired_competencies_tag").val(presentation.adquired_competencies);

		V.Editor.Themes.selectTheme(presentation.theme);
		V.Editor.setMode(presentation.type);

		var slidesetModule = V.Editor.Slideset.getCreatorModule(presentation.type);
		var isSlideset = (slidesetModule!==null);

		if(isSlideset){
			_renderSlideset(presentation,slidesetModule);
		} else if(presentation.type===VISH.Constant.PRESENTATION){
			renderPresentation(presentation);
		} else if(presentation.type===VISH.Constant.QUIZ_SIMPLE){
			// Presentation stored in the quiz_simple_json field of quizzes;
			// Edit this kind of presentations makes no sense, just for testing
			//Edit as standard presentation
			presentation.type = VISH.Constant.PRESENTATION;
			renderPresentation(presentation);
		}
	};

	var renderPresentation = function(presentation){
		slides = presentation.slides;
		for(var i=0;i<slides.length;i++){
			if(slides[i].type === V.Constant.FLASHCARD){
				_renderFlashcard(slides[i], i+1);
			} else {
				_renderSlide(slides[i], i+1);			
			}
		}
	}

	var _renderSlideset = function(presentation,slidesetModule){
		var slideset = V.Editor.Slideset.undoNestedSlides(presentation.slides[0]);
		if((slideset)&&(slideset.slides)){
			slides = slideset.slides;
			var sL = slides.length;
			for(var i=0;i<sL;i++){
				_renderSlide(slides[i], i+1);
			}
		}
		slidesetModule.loadSlideset(presentation);
	}
	
	/**
	 * function to render one slide in editor
	 */
	var _renderSlide = function(slide, slideNumber){
		var template = "1";
		if(slide.template){
			template = slide.template.substring(1); //slide.template is "t10", with this we remove the "t"
		}
		var scaffold = V.Editor.Dummies.getScaffoldForSlide(template, slideNumber, slide);

		V.Editor.Slides.addSlide(scaffold);
		V.Editor.Slides.redrawSlides();
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
			} else if(slide.elements[el].type === "quiz"){
				V.Editor.Quiz.draw(area,slide.elements[el]);
			}
		}
	
		//finally give class "editable" to the empty areas
		$("div.selectable:empty").addClass("editable");		
	};
	
	/**
	 * function to render one flashcard inside a presentation
	 */
	var _renderFlashcard = function(slide, slideNumber){
		V.Editor.Flashcard.addFlashcard(slide);
		V.Renderer.renderSlide(slide, "", "<div class='delete_slide'></div>");
	};


	return {
		init	: init,
		renderPresentation	: renderPresentation
	};

}) (VISH, jQuery);