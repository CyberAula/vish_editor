VISH.Editor.Thumbnails = (function(V,$,undefined){
	
  /**
   * function to redraw the slides thumbnails
   * used when removing one slide
   */	
   var redrawThumbnails = function(){
   		//first we remove all the thumbnails and the click events to add them again
   		var i = 1;
   		for(i = 1; i < 8; i++){
   			$("#slide_thumb_"+ i).off("click");
			$("#slide_thumb_"+ i).css("cursor", "auto");
			$("#slide_thumb_"+ i + " .slide_number").html("");
			$("#slide_thumb_"+ i + " img").attr("src", VISH.ImagesPath + "templatesthumbs/default.png");
			$("#slide_thumb_"+ i + " img").unbind('mouseenter').unbind('mouseleave');
   		}
   		//unselect all thumbnails
   		$(".barbutton").css("background-color", "transparent");
   		//if we have more than 1 slide, we will highlight the next one to current slide
   		if(slideEls.length > 0){
   			var slide_to_highlight = curSlide + 1;
   			$("#slide_thumb_"+ slide_to_highlight).css("background-color", "#ACACAC");
   		}
   		
   		//now we add them again
   		var template = 0; //template to add as thumbnail
   		var position = 1;  //position to add the thumbnail
   		$('article').each(function(index,s){
      		template = $(s).attr('template');
      		addThumbnail(template, position);
      		position += 1;
     	});
     	
     	//finally add the + button in "position"
     	_addPlusButton(position);
   };
	
	/**
	 * function to add the "addslide" button as thumbnail
	 */
	var _addPlusButton = function(position){
		$("#slide_thumb_"+ position).css("cursor", "pointer");
     	$("#slide_thumb_"+ position + " img").attr("src", VISH.ImagesPath + "templatesthumbs/add_slide.png");
     	
     	$("#slide_thumb_"+ position).click( function() {
  			//call fancybox
  			$("#addSlideFancybox").trigger('click');
		});
		$("#slide_thumb_"+ position+ " img").hover(
		  function () {
		    $(this).attr("src", VISH.ImagesPath + "hover/add_slide.png");
		  },
		  function () {
		    $(this).attr("src", VISH.ImagesPath + "templatesthumbs/add_slide.png");
		  }
		);
	};
	
  /**
   * function to select the thumbnail
   */
  var selectThumbnail = function(no){
  		$(".barbutton").css("background-color", "transparent");
    	$("#slide_thumb_"+ no).css("background-color", "#ACACAC");
  };
    	
  /**
	 * function to add a thumbnail of the added slide and activate the onlicks of the thumbnail
	 */
	var addThumbnail = function(template_number, position){
		//var number_of_slides = slideEls.length + 1;  //it is slideEls.length +1 because we have recently added a slide and it is not in this array
		$("#slide_thumb_"+ position).click( function() {
  			V.SlidesUtilities.goToSlide(position);
		});
		$("#slide_thumb_"+ position).css("cursor", "pointer");
		$("#slide_thumb_"+ position + " .slide_number").html(position);
		$("#slide_thumb_"+ position + " img").attr("src", VISH.ImagesPath + "templatesthumbs/"+template_number + ".png");
	};
  
  
	return {
		addThumbnail	  : addThumbnail,
		redrawThumbnails  : redrawThumbnails,
		selectThumbnail	  : selectThumbnail
	};

}) (VISH, jQuery);