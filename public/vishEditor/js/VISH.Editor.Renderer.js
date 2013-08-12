VISH.Editor.Renderer = (function(V,$,undefined){
	
	var slides = null;
	
	/**
	 * Function to initialize the renderer 
	 */
	var init = function(presentation){
		$('#presentation_title').val(presentation.title);
		$('#presentation_description').val(presentation.description);
		$('#presentation_avatar').val(presentation.avatar);
	
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

		if(presentation.type===V.Constant.PRESENTATION){
			renderPresentation(presentation);
		} else if(presentation.type===V.Constant.QUIZ_SIMPLE){
			// Presentation stored in the quiz_simple_json field of quizzes;
			// Edit this kind of presentations makes no sense, just for testing
			//Edit as standard presentation
			presentation.type = V.Constant.PRESENTATION;
			renderPresentation(presentation);
		}
	};

	var renderPresentation = function(presentation){
		slides = presentation.slides;
		for(var i=0;i<slides.length;i++){
			var type = slides[i].type;
			
			if(type===V.Constant.STANDARD){
				_renderSlide(slides[i], i+1);
			} else {
				var isSlideset = V.Editor.Slideset.isSlideset(type);
				if(isSlideset){
					_renderSlideset(slides[i], i+1);
				}
			}
		}
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

		V.Editor.Slides.appendSlide(scaffold);
		V.Slides.updateSlides();
		V.Slides.lastSlide();  //important to get the browser to draw everything

		for(el in slide.elements){
			var areaId = slide.elements[el].id;
			var area = $("div#" + areaId + "[areaid='" + slide.elements[el].areaid +"']");		
			
			if(area.length === 0){
				continue; //with first version presentations we had different template names and some fails, this condition avoid that
			}

			if(slide.elements[el].type === V.Constant.TEXT){
				V.Editor.Text.launchTextEditor({}, area, slide.elements[el].body);  //in this case there is no event, so we pass a new empty object
			} else if(slide.elements[el].type === V.Constant.IMAGE){
				V.Editor.Image.drawImage(slide.elements[el].body, area, slide.elements[el].style, slide.elements[el].hyperlink);
			} else if(slide.elements[el].type === V.Constant.VIDEO){
				var options = [];
				options['poster'] = slide.elements[el].poster;
				options['autoplay'] = slide.elements[el].autoplay;
				var sourcesArray = [];
				$.each(JSON.parse(slide.elements[el].sources), function(index, source) {
					sourcesArray.push([source.src, source.type]);
				});
				V.Editor.Video.HTML5.drawVideo(sourcesArray, options, area);
			} else if(slide.elements[el].type === V.Constant.OBJECT){				
				V.Editor.Object.drawObject(slide.elements[el].body, area, slide.elements[el].style,slide.elements[el].zoomInStyle);
			} else if(slide.elements[el].type === V.Constant.SNAPSHOT){
				V.Editor.Object.Snapshot.drawSnapShot(slide.elements[el].body, area, slide.elements[el].style,slide.elements[el].scrollTop,slide.elements[el].scrollLeft);
			} else if(slide.elements[el].type === V.Constant.QUIZ){
				V.Editor.Quiz.draw(area,slide.elements[el]);
			}

			//Add tooltips to area
			var hideTooltip = true;
			if(V.Editor.isZoneEmpty(area)){
				hideTooltip = false;
				//Give class "editable" to the empty areas
				$(area).addClass("editable");
			}
			V.Editor.Tools.addTooltipToZone(area,hideTooltip);
		}
	};
	
	/**
	 * Function to render slidesets
	 */
	var _renderSlideset = function(slideset, slideNumber){
		//TODO
		console.log("_renderSlideset");
		console.log(slideset);
		console.log(slideNumber);

		// var scaffold = V.Editor.Dummies.getScaffoldForSlide(template, slideNumber, slide);

		// V.Editor.Slides.appendSlide(scaffold);
		// V.Slides.updateSlides();
		// V.Slides.lastSlide();  //important to get the browser to draw everything
	}


	return {
		init				: init,
		renderPresentation	: renderPresentation
	};

}) (VISH, jQuery);