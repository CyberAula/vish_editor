VISH.Editor.Image.Flikr = (function(V,$,undefined){
	
	var carrouselDivId = "tab_flikr_content_carrousel";
	var queryMaxNumberFlikrImages= 20; //maximum video query for youtube API's (999 max)
	
	//add events to inputs
	var init = function(){
		var myInput = $("#tab_pic_flikr_content").find("input[type='search']");
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
		        	VISH.Editor.Image.Flikr.listImages($(myInput).val());
		          	$(myInput).blur();
			
			}
		});
	};
	
	
//function that is called when tab loads
	var onLoadTab = function(){
		//clean carrousel
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId); 
		
		//clean search field
		// $("#tab_pic_flikr_content").find("input[type='search']").attr("value","");
		var myInput = $("#tab_pic_flikr_content").find("input[type='search']");		
	  	$(myInput).watermark('Search content');		
	};

	var listImages = function(text){
	    //clean carrousel
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);    

		var template = VISH.Editor.getParams()['current_el'].parent().attr('template');
	    var url_flikr = "http://api.flickr.com/services/feeds/photos_public.gne?tags="+text+"&tagmode=any&format=json&jsoncallback=?";
		
		$.getJSON(url_flikr, function(data){
	      $.each(data.items, function(i,item){
	        //add every image in the carrousel
	        $("#" + carrouselDivId).append('<div><img id="img_flkr'+i+'" src="'+ item.media.m +'" imageFlikrId="'+i+'" /></div>');
          });
	      
        //call createCarrousel ( div_Carrousel_id, 1 , callbackFunction)
		VISH.Editor.Carrousel.createCarrousel (carrouselDivId, 2, VISH.Editor.Image.Flikr.addImage);
	   });
	};


var previewMetadata = function(event) {


console.log("event" + event);
//add button + pictura table information

};



var addImage = function(event){
	var image_url = $(event.target).attr("src");
	V.Editor.Image.drawImage(image_url);
	$.fancybox.close();
};
	
	return {
		init        : init,
		onLoadTab	: onLoadTab,
		listImages	: listImages,
		addImage	: addImage
		
	};

}) (VISH, jQuery);
