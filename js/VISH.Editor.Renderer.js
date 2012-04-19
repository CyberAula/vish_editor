VISH.Editor.Renderer = (function(V,$,undefined){
	
	var slides = null;
	
	/**
	 * Function to initialize the renderer 
	 */
	var init = function(excursion){
		slides = excursion.slides;
		for(var i=0;i<slides.length;i++){
				_renderSlide(slides[i], i);			
		}	
	};
	
		
	/**
	 * function to render one slide in editor
	 */
	var _renderSlide = function(slide, position){
		
		var template = slide.template.substring(1); //slide.template is "t10", with this we remove the "t"
		var scaffold = V.Dummies.getDummy(template, slide.id);  
		
		V.Editor.SlidesUtilities.addSlide(scaffold);	
		V.Editor.SlidesUtilities.addThumbnail("t" + template, position+1); //it is slideEls.length +1 because we have recently added a slide and it is not in this array
	
		V.Editor.SlidesUtilities.redrawSlides();
		
		for(el in slide.elements){
			var area = $("#article"+slide.id + " div[areaid='" + slide.elements[el].areaid +"']");
			if(slide.elements[el].type === "text"){
				V.Editor.Text.launchTextEditor({}, area, slide.elements[el].body);  //in this case there is no event, so we pass a new empty object
			}
			else if(slide.elements[el].type === "image"){
				V.Editor.Image.drawImage(slide.elements[el].body, area);
			}
			else if(slide.elements[el].type === "video"){
				var options = [];
				options['poster'] = slide.elements[el].poster;
				options['autoplay'] = slide.elements[el].autoplay;
				var sourcesArray = [];
				$.each(JSON.parse(slide.elements[el].sources), function(index, source) {
					sourcesArray.push([source.src, source.type]);
				});
				V.Editor.Video.HTML5.drawVideo(sourcesArray, options, area);
			}
			else if(slide.elements[el].type === "object"){				
				V.Editor.Object.drawObject(slide.elements[el].body, area);
			}
		}
		
	};
	


return {
		init					: init		
	};

}) (VISH, jQuery);