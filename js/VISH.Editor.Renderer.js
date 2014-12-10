VISH.Editor.Renderer = (function(V,$,undefined){
	
	var _isRendering;

	/**
	 * Function to initialize the renderer 
	 */
	var init = function(presentation){
		_isRendering = false;
		V.Editor.Animations.setCurrentAnimation(presentation.animation);
		
		if(presentation.type===V.Constant.PRESENTATION){
			renderPresentation(presentation);
		} else if(presentation.type===V.Constant.QUIZ_SIMPLE){
			// Presentation stored in the quiz_simple_json field of quizzes;
			// Edit this kind of presentations makes no sense, just for testing
			// Edit as standard presentation
			presentation.type = V.Constant.PRESENTATION;
			renderPresentation(presentation);
		}
	};

	var renderPresentation = function(presentation){
		_isRendering = true;

		var slides = presentation.slides;
		for(var i=0;i<slides.length;i++){
			var slideNumber = V.Slides.getSlidesQuantity()+1;
			var type = slides[i].type;
			
			if(type===V.Constant.STANDARD){
				_renderSlide(slides[i], {slideNumber: slideNumber });
			} else {
				var isSlideset = V.Slideset.isSlideset(type);
				if(isSlideset){
					_renderSlideset(slides[i], slideNumber);
				}
			}
		}

		_isRendering = false;
	};

	
	/**
	 * function to render one slide in editor
	 */
	var _renderSlide = function(slide,renderOptions){
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
			V.Utils.addTempShown(scaffoldDOM);
		}

		var slideElementsLength = slide.elements.length;
		for(var i=0; i<slideElementsLength; i++){
			var element = slide.elements[i];
			var zoneId = element.id;
			var area = $("div#" + zoneId + "[areaid='" + element.areaid +"']");

			if(area.length === 0){
				continue; //with first version presentations we had different template names and some fails, this condition avoid that
			}

			//Save element settings
			if(element.settings){
				var serializedSettings = JSON.stringify(element.settings);
				$(area).attr("elSettings",serializedSettings);
			}

			if(element.type === V.Constant.TEXT){
				V.Editor.Text.launchTextEditor({}, area, element.body);  //in this case there is no event, so we pass a new empty object
			} else if(element.type === V.Constant.IMAGE){
				V.Editor.Image.drawImage(element.body, area, element.style, element.hyperlink, element.options);
			} else if(element.type === V.Constant.VIDEO){
				var options = [];
				options['poster'] = element.poster;
				options['autoplay'] = element.autoplay;
				V.Editor.Video.HTML5.drawVideo(V.Video.HTML5.getSourcesFromJSON(element), options, area, element.style);
			} else if(element.type === V.Constant.AUDIO){
				var options = [];
				options['autoplay'] = element.autoplay;
				V.Editor.Audio.HTML5.drawAudio(V.Audio.HTML5.getSourcesFromJSON(element), options, area, element.style);
			} else if(element.type === V.Constant.OBJECT){
				V.Editor.Object.drawObject(element.body, {area:area, style:element.style, zoomInStyle:element.zoomInStyle});
			} else if(element.type === V.Constant.SNAPSHOT){
				V.Editor.Object.Snapshot.drawSnapShot(element.body, area, element.style,element.scrollTop,element.scrollLeft);
			} else if(element.type === V.Constant.QUIZ){
				V.Editor.Quiz.draw(area,element);
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
			V.Utils.removeTempShown(scaffoldDOM);
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

	var isRendering = function(){
		return _isRendering;
	};


	return {
		init				: init,
		renderPresentation	: renderPresentation,
		isRendering			: isRendering
	};

}) (VISH, jQuery);