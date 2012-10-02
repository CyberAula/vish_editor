VISH.Editor.Image.Flikr = (function(V,$,undefined){
	
	var carrouselDivId = "tab_flikr_content_carrousel";
	var queryMaxNumberFlikrImages= 80; //maximum video query for youtube API's (999 max)
	
	//add events to inputs
	var init = function(){
		var myInput = $("#tab_pic_flikr_content").find("input[type='search']");
		$(myInput).watermark(VISH.Editor.I18n.getTrans("i.SearchContent"));
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
		$("#" + carrouselDivId).hide();

		//clean search field
		$("#tab_pic_flikr_content").find("input[type='search']").attr("value","");	
	};

	var listImages = function(text){
		//clean carrousel
		VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);    
		$("#" + carrouselDivId).hide();

		var url_flikr = "http://api.flickr.com/services/feeds/photos_public.gne?tags="+text+"&tagmode=any&format=json&jsoncallback=?";

		var carrouselImages = [];

		$.getJSON(url_flikr, function(data){
			if(! data.items.length > 0){
				$("#" + carrouselDivId).show();
				$("#" + carrouselDivId).html("<p class='carrouselNoResults'> No results found </p>");
				return;
			}

			$.each(data.items, function(i,item){
				//add every image in the carrousel
				var myImg = $("<img id=img_flkr" + i + " src=" + item.media.m + " imageFlikrId=" + i + "/>")
				carrouselImages.push(myImg);
			});
			VISH.Utils.loader.loadImagesOnCarrousel(carrouselImages,_onImagesLoaded,carrouselDivId);
		});
	};


	var addImage = function(event){
		var image_url = $(event.target).attr("src");
		V.Editor.Image.addContent(image_url);
	};
	
	var _onImagesLoaded = function(){
		$("#" + carrouselDivId).show();
		var options = new Array();
		options['rows'] = 2;
		options['callback'] = VISH.Editor.Image.Flikr.addImage;
		options['rowItems'] = 4;
		options['scrollItems'] = 4;
		VISH.Editor.Carrousel.createCarrousel(carrouselDivId, options);
	}
	
	return {
		init        : init,
		onLoadTab	: onLoadTab,
		listImages	: listImages,
		addImage	: addImage	
	};

}) (VISH, jQuery);
