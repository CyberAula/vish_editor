VISH.Editor.Object.Live = (function(V,$,undefined){
	
  var carrouselDivId = "tab_live_webcam_content_carrousel";
  var previewDivId = "tab_live_webcam_content_preview";
	var footId = "tab_live_webcam_content_preview_foot";
  var currentObject = new Array();
  var selectedObject = null;
  
  var init = function(){
    var myInput = $("#tab_live_webcam_content").find("input[type='search']");
	  $(myInput).watermark(V.Editor.I18n.getTrans("i.SearchContent"));
	  $(myInput).keydown(function(event) {
	    if(event.keyCode == 13) {
        _requestData($(myInput).val());
        $(myInput).blur();
	    }
    });
  }
	
  var onLoadTab = function(tab){
		
		if(tab!="webcam"){
			return;
		}
		
    var previousSearch = ($("#tab_live_webcam_content").find("input[type='search']").val()!="");
		if(! previousSearch){
		  _cleanObjectPreview();
	    _requestInicialData();
		}
		$("#" + footId).find(".okButton").hide();
  }
	
  /*
   * Request inicial data to the server.
   */
  var _requestInicialData = function(){
    V.Editor.API.requestRecomendedLives(_onDataReceived, _onAPIError);
  }
	
  /*
   * Request data to the server.
   */
  var _requestData = function(text){
    V.Editor.API.requestLives(text, _onDataReceived, _onAPIError);
  }
	
  /*
   * Fill tab_live_webcam_content_carrousel div with server data.
   */
  var _onDataReceived = function(data){
		
    //Clean previous content
    V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();
		_cleanObjectPreview();
  
    //Clean previous object
    currentObject = new Array();  
		var carrouselImages = [];
		var carrouselImagesTitles = [];
	
    var content = "";
    
		if((!data)||(data.length==0)){
      $("#" + carrouselDivId).html("<p class='carrouselNoResults'> No results found </p>");
      $("#" + carrouselDivId).show();
			return;
    } 
		
    $.each(data, function(index, object) {
      var objectInfo = V.Object.getObjectInfo(object.fulltext)
      var imageSource = null;
      
      switch (objectInfo.type){
        case "swf":
          imageSource = V.ImagesPath + "carrousel/swf.png"
	      break;
	    case "youtube":
	        imageSource = V.ImagesPath + "carrousel/youtube.png"
	      break;
	    case "web":
	      if(objectInfo.wrapper=="IFRAME"){
	        imageSource = V.ImagesPath + "carrousel/iframe.png"
	      } else {
	    	  imageSource = V.ImagesPath + "carrousel/object.png"
	      }
	      break;
	    default:
	      imageSource = V.ImagesPath + "carrousel/object.png"
	      break;
      }
			
      var myImg = $("<img src='" + imageSource + "' objectId='" + object.id + "'>")
			carrouselImages.push(myImg)
			carrouselImagesTitles.push(object.title)
      currentObject[object.id]=object;
    });

    V.Utils.Loader.loadImagesOnCarrousel(carrouselImages,_onImagesLoaded,carrouselDivId,carrouselImagesTitles);
    
  }
	
	 var _onImagesLoaded = function(){
    $("#" + carrouselDivId).show();
		
		var options = new Array();
    options['rows'] = 1;
    options['callback'] = _onClickCarrouselElement;
    options['rowItems'] = 5;
    options['styleClass'] = "title";
    V.Editor.Carrousel.createCarrousel(carrouselDivId, options);
  }
	
  var _onAPIError = function(){
	    V.Debugging.log("Error")
  }
	 
  
  var _onClickCarrouselElement = function(event){
		var objectId = $(event.target).attr("objectid");
		if (typeof objectId != "undefined") {
			var renderedObject = V.Editor.Object.renderObjectPreview(currentObject[objectId].fulltext)
      _renderObjectPreview(renderedObject,currentObject[objectId]);
      selectedObject = currentObject[objectId];
	  }
  }
  
  
  var _renderObjectPreview = function(renderedObject,object){
    var objectArea = $("#" + previewDivId).find("#tab_live_webcam_content_preview_live");
	  var metadataArea = $("#" + previewDivId).find("#tab_live_webcam_content_preview_metadata");
	  $(objectArea).html("");
	  $(metadataArea).html("");
	  if((renderedObject)&&(object)){
	    $(objectArea).append(renderedObject);
	    var table = V.Editor.Utils.generateTable(object.author,object.title,object.description);
	    $(metadataArea).html(table);
			$("#" + footId).find(".okButton").show();
	  }
  }
	
	var _cleanObjectPreview = function(){
		var objectArea = $("#" + previewDivId).find("#tab_live_webcam_content_preview_live");
    var metadataArea = $("#" + previewDivId).find("#tab_live_webcam_content_preview_metadata");
    $(objectArea).html("");
    $(metadataArea).html("");
    $("#" + footId).find(".okButton").hide();
	}
	
  
  var addSelectedObject = function(){
    if(selectedObject!=null){
      V.Editor.Object.drawObject(selectedObject.fulltext);
      $.fancybox.close();
    }
  }
	
  return {
    init                : init,
		onLoadTab				    : onLoadTab,
		addSelectedObject   : addSelectedObject
  };

}) (VISH, jQuery);
