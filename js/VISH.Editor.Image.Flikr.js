VISH.Editor.Image.Flikr = (function(V,$,undefined){
	
	var carrouselDivId = "tab_flikr_content_carrousel";
	var queryMaxNumberFlikrImages= 20; //maximum video query for youtube API's (999 max)
	var onLoadTab = function(){
			
		console.log("entra en onLoadTab");
			
		var myInput = $("#tab_pic_flikr_content").find("input[type='search']");
		console.log("myImput vale:" +myInput);
		console.log("lo que voy a buscar vale: " + $(myInput).val());
	  	$(myInput).watermark('Search content');
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
		        	VISH.Editor.Image.Flikr.listImages($(myInput).val());
		          	$(myInput).blur();
			
			}
	
		});
	};

	var listImages = function(text){
		console.log("entra en listImages");
		console.log("lo que voy a buscar vale: " + text);
	  	
	    //clean carrousel
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);    

 
		
		var template = VISH.Editor.getParams()['current_el'].parent().attr('template');
    	var url_flikr = "http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&tagmode=any&format=json&jsoncallback=?";
	console.log("url vale: " + url_flikr);
$.getJSON(url_flikr, function(data){
          $.each(data.items, function(i,item){
		
	console.log("dato de flikr vale: "+ item.media.m);
            $("#" + carrouselDivId).append('<img id="img_flkr'+i+'" src="'+ item.media.m +'" imageFlikrId="'+i+'"/>');
		
          });
      //call createCarrousel ( div_Carrousel_id, 1 , callbackFunction)
	VISH.Editor.Carrousel.createCarrousel (carrouselDivId, 2, VISH.Editor.Image.Flikr.addImage);

	});
	

		


	


	


};

var addImage = function(event){
var ImageId = $(event.target).attr("imageFlikrId");
console.log("Image id vale" +ImageId);

};
	
	return {
		onLoadTab	  : onLoadTab,
		listImages	: listImages,
		addImage	: addImage
		
	};

}) (VISH, jQuery);
