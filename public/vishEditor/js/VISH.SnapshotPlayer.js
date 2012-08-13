VISH.SnapshotPlayer = (function(){

    /**
     * Function to add an object to the slide
     * the object is in the wrapper attribute of the div
     */
    var loadSnapshot = function(element){
        $.each(element.children('.snapshotelement'), function(index, value){
            var wrapper_class = "snapshot_wrapper" + "_viewer";
            var content_class = "snapshot_content" + "_viewer";
            var content = $(value).attr("objectWrapper");
						var iframe = $(VISH.Utils.getOuterHTML($(content)));
						$(iframe).removeClass();
            $(iframe).addClass(content_class);
            var scrollTop = $(value).attr("scrollTop");
            var scrollLeft = $(value).attr("scrollLeft");
            $(value).html("<div class='" + wrapper_class + "' style='" + $(value).attr("objectStyle") + "'>" + VISH.Utils.getOuterHTML(iframe) + "</div>");
						if($(value).attr("zoom")){
							$(value).find("." + content_class).attr("style",VISH.Utils.getZoomInStyle($(value).attr("zoom")));
						}
						$(value).find("." + wrapper_class).scrollTop(scrollTop);
            $(value).find("." + wrapper_class).scrollLeft(scrollLeft);
        });
    };
    
    /**
     * Function to remove the flash objects from the slides
     */
    var unloadSnapshot = function(){
        var element = $('.past, .next')
        $.each(element.children('.snapshotelement'), function(index, value){
            $(value).html("");
        });
    }
		
		
		//Change zoom after setup size
		var aftersetupSize = function(increase){

			$.each($(".snapshot_content_viewer"), function(index, iframe) {
					var area = $(iframe).parent().parent();
					var iframe_wrapper = $(iframe).parent();
					
					$(area).attr("zoom",increase);
          $(iframe).attr("style",VISH.Utils.getZoomInStyle(increase));
					
          var scrollLeft = $(area).attr("scrollLeftOrigin");
          var newScrollLeft = scrollLeft * increase;
					
//          Width differente between original size and new size.
//          var widthDelta = $(iframe_wrapper).width()*(1-(1/increase));
//          var newScrollLeft = scrollLeft * increase + widthDelta;
					
					var scrollTop = $(area).attr("scrollTopOrigin");
					var newScrollTop = scrollTop * increase;
					
					$(area).attr("scrollLeft",newScrollLeft);
					$(area).attr("scrollTop",newScrollTop);
          $(iframe_wrapper).scrollLeft(newScrollLeft);
					$(iframe_wrapper).scrollTop(newScrollTop);
      });

		}
    
    return {
        loadSnapshot: loadSnapshot,
        unloadSnapshot: unloadSnapshot,
				aftersetupSize : aftersetupSize
    };
    
})(VISH, jQuery);