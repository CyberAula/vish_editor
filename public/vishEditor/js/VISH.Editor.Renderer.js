VISH.Editor.Renderer = (function(V,$,undefined){
	
	var slides = null;
	
	/**
	 * Function to initialize the renderer 
	 */
	var init = function(excursion){
		//first set title and description
		$('#excursion_title').val(excursion.title);
		$('#excursion_description').val(excursion.description);
		$('#excursion_avatar').val(excursion.avatar);
		//select the avatar from the carrousel
		$("thumbnails_in_excursion_details .carrousel_element_single_row img").each(function(index, elem) {
				if(elem.attr("src")===excursion.avatar);
				elem.addClass("carrousel_element_selected");
				//TODO move the carrousel to the page with the element
		});
		
		slides = excursion.slides;
		for(var i=0;i<slides.length;i++){
				_renderSlide(slides[i], i, excursion.id);			
		}	
	};
	
		
	/**
	 * function to render one slide in editor
	 */
	var _renderSlide = function(slide, position, excursion_id){
		
		var template = slide.template.substring(1); //slide.template is "t10", with this we remove the "t"
		var scaffold = V.Dummies.getDummy(template, position, excursion_id, true);  
		
		V.Editor.Utils.addSlide(scaffold);	
		
		V.Editor.Utils.redrawSlides();
		V.Slides.lastSlide();  //important to get the browser to draw everything
		
		for(el in slide.elements){
			var area = $("#article_" + excursion_id + "_" + position + " div[areaid='" + slide.elements[el].areaid +"']");
			if(area.length === 0){
				continue; //with first version excursions we had different template names and some fails, this condition avoid that
			}
			if(slide.elements[el].type === "text"){
				V.Editor.Text.launchTextEditor({}, area, slide.elements[el].body);  //in this case there is no event, so we pass a new empty object
			} else if(slide.elements[el].type === "image"){
				V.Editor.Image.drawImage(slide.elements[el].body, area, slide.elements[el].style);
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
			} else if(slide.elements[el].type === "mcquestion"){
				V.Editor.Quiz.drawQuiz(slide.elements[el].question, slide.elements[el].options);
			}
		}
	
		//finally give class "editable" to the empty areas
		$("div.selectable:empty").addClass("editable");		
	};
	


return {
		init					: init		
	};

}) (VISH, jQuery);