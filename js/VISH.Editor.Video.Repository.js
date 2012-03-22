VISH.Editor.Video.Repository = (function(V,$,undefined){
	
	var carrouselDivId = "tab_video_repo_content_carrousel";
	
	var onLoadTab = function(){
		loadData();
		VISH.Editor.Carrousel.createCarrousel(carrouselDivId,1,VISH.Editor.Video.Repository.onClickCarrouselElement);
	}
	
	var onClickCarrouselElement = function(){
		console.log("onClickCarrouselElement! in VISH.Editor.Video.Repository!")
	}
	
	/*
	 * Fill tab_video_repo_content_carrousel div with server data.
	 */
	var loadData = function(){
		//Clean previous content
    VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId)
		
		
		var json = getJson();
		
		//Parse JSON
		//[...]
		
    //Fill data
		$("#" + carrouselDivId).html(
		        "<img src='http://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Sasso_lungo_da_passo_pordoi.jpg/250px-Sasso_lungo_da_passo_pordoi.jpg' />" +
            "<img src='http://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Sasso_lungo_da_passo_pordoi.jpg/250px-Sasso_lungo_da_passo_pordoi.jpg' />" +
            "<img src='http://1.bp.blogspot.com/-DFj9INluj80/TfiNl7q3DbI/AAAAAAAAAws/hVJu13VbKEY/s1600/paisaje.jpg' />" +
            "<img src='http://www.forodefotos.com/attachments/naturaleza/12983d1281113830-fotos-de-paisaje-fotos-de-paisaje.jpg' />" +
            "<img src='http://ro18.blogspot.es/img/paisaje.jpg' />" +
            "<img src='http://walpaper.es/images/wallpapers/Paisaje-fotografia-HDR-656343.jpeg' />" +
            "<img src='http://3.bp.blogspot.com/-a-WrZZf0WJo/TsEBPXjUQXI/AAAAAAAAFBg/kh0aS9Kemag/s1600/PAISAJE+JUANMA.jpg' />" +
            "<img src='http://images.artelista.com/artelista/obras/fichas/8/3/3/8619208014133041.JPG' />" +
            "<img src='http://4.bp.blogspot.com/-CfZKEdXcXtg/TijG57sIFWI/AAAAAAAAARQ/O8FP1OQ0a0w/s1600/delfines-saltando.jpg' />"
						);
	}
	
	var getJson = function(){
    return VISH.Editor.API.requestVideos("any");
  }
	
	
	return {
		onLoadTab					      : onLoadTab,
		onClickCarrouselElement : onClickCarrouselElement
	};

}) (VISH, jQuery);
