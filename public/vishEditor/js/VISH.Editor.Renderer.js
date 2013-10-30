VISH.Editor.Renderer = (function(V,$,undefined){
	
	var slides = null;
	
	/**
	 * Function to initialize the renderer 
	 */
	var init = function(presentation){
		V.Editor.Themes.selectTheme(presentation.theme);
		V.Editor.Animations.setCurrentAnimation(presentation.animation);
		
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
			var slideNumber = V.Slides.getSlidesQuantity()+1;
			var type = slides[i].type;
			
			if(type===V.Constant.STANDARD){
				_renderSlide(slides[i], {slideNumber: slideNumber });
			} else {
				var isSlideset = V.Editor.Slideset.isSlideset(type);
				if(isSlideset){
					_renderSlideset(slides[i], slideNumber);
				}
			}
		}
	}

	
	/**
	 * function to render one slide in editor
	 */
	var _renderSlide = function(slide, renderOptions){
		var options = {};

		options.template = "1";
		if(slide.template){
			options.template = slide.template.substring(1); //slide.template is "t10", with this we remove the "t"
		}

		options.slideNumber = renderOptions.slideNumber;
		var scaffold = V.Editor.Dummies.getScaffoldForSlide(slide,options);

		if(!renderOptions.subslide){
			V.Editor.Slides.appendSlide(scaffold);
			V.Slides.updateSlides();
			V.Slides.lastSlide();  //important to get the browser to draw everything
		} else {
			//Render subslide
			V.Editor.Slides.appendSubslide(renderOptions.slidesetDOM,scaffold);
			var scaffoldDOM = $("#"+$(scaffold).attr("id"));
			//Show subslide
			$(scaffoldDOM).addClass("temp_shown");
		}

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
				$.each(JSON.parse(slide.elements[el].sources), function(index, source){
					sourcesArray.push([source.src, source.type]);
				});
				V.Editor.Video.HTML5.drawVideo(sourcesArray, options, area);
			} else if(slide.elements[el].type === V.Constant.OBJECT){
				V.Editor.Object.drawObject(slide.elements[el].body, {area:area, style:slide.elements[el].style, zoomInStyle:slide.elements[el].zoomInStyle});
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

		if(renderOptions.subslide){
			$(scaffoldDOM).removeClass("temp_shown");
		}
	};
	
	/**
	 * Function to render slidesets
	 */
	var _renderSlideset = function(slidesetJSON, slideNumber){
		var options = {};
		options.slideNumber = slideNumber;
		options.slidesetId = (slidesetJSON.id).toString();
		var scaffold = V.Editor.Dummies.getScaffoldForSlide(slidesetJSON,options);

		if(scaffold){
			V.Editor.Slides.appendSlide(scaffold);
			V.Slides.updateSlides();
			V.Slides.lastSlide();  //important to get the browser to draw everything

			//Get slideset in DOM
			var slidesetId = $(scaffold).attr("id");
			var scaffoldDOM = $("#"+slidesetId);

			//Draw subslides
			var subslides = slidesetJSON.slides;
			if(subslides){
				var ssL = subslides.length;
				for(var i=0; i<ssL; i++){
					var subslideJSON = subslides[i];
					_renderSlide(subslideJSON, {slidesetDOM: scaffoldDOM, slideNumber: i+1, subslide: true});
				}
			}

			//Complete scaffold
			var slidesetCreator = V.Editor.Slideset.getCreatorModule(slidesetJSON.type);
			slidesetCreator.draw(slidesetJSON,scaffoldDOM);
		}
	};


	return {
		init				: init,
		renderPresentation	: renderPresentation
	};

}) (VISH, jQuery);