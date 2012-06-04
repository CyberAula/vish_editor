VISH.Editor.Object.Repository = (function(V,$,undefined){
	
  var carrouselDivId = "tab_flash_repo_content_carrousel";
  var previewDivId = "tab_flash_repo_content_preview";
	var footId = "tab_flash_repo_content_preview_foot";
  var currentObject = new Array();
  var selectedObject = null;
  
  var init = function(){
    var myInput = $("#tab_flash_repo_content").find("input[type='search']");
	  $(myInput).watermark('Search content');
	  $(myInput).keydown(function(event) {
	    if(event.keyCode == 13) {
        _requestData($(myInput).val());
        $(myInput).blur();
	    }
    });
  }
	
  var onLoadTab = function(){
    var previousSearch = ($("#tab_flash_repo_content").find("input[type='search']").val()!="");
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
    VISH.Editor.API.requestRecomendedFlash(_onDataReceived, _onAPIError);
  }
	
  /*
   * Request data to the server.
   */
  var _requestData = function(text){
    VISH.Editor.API.requestFlashes(text, _onDataReceived, _onAPIError);
  }
	
  /*
   * Fill tab_flash_repo_content_carrousel div with server data.
   */
  var _onDataReceived = function(data){
	  
    //Clean previous content
    VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
		$("#" + carrouselDivId).hide();
		_cleanObjectPreview();
  
    //Clean previous object
    currentObject = new Array();  
		var carrouselImages = [];
		var carrouselImagesTitles = [];
	
    var content = "";
    
		if((!data.flashes)||(data.flashes.length==0)){
      $("#" + carrouselDivId).html("<p class='carrouselNoResults'> No results found </p>");
      $("#" + carrouselDivId).show();
			return;
    } 
		
    $.each(data.flashes, function(index, object) {
      var objectInfo = VISH.Editor.Object.getObjectInfo(object.content)
      var imageSource = null;        
      
      switch (objectInfo.type){
        case "swf":
          imageSource = VISH.ImagesPath + "carrousel/swf.png"
	      break;
	    case "youtube":
	        imageSource = VISH.ImagesPath + "carrousel/youtube.png"
	      break;
	    case "web":
	      if(objectInfo.wrapper=="IFRAME"){
	        imageSource = VISH.ImagesPath + "carrousel/iframe.png"
	      } else {
	    	  imageSource = VISH.ImagesPath + "carrousel/object.jpeg"
	      }
	      break;
	    default:
	      imageSource = VISH.ImagesPath + "carrousel/object.jpeg"
	      break;
      }
			
      var myImg = $("<img src='" + imageSource + "' objectId='" + object.id + "'>")
			carrouselImages.push(myImg)
			carrouselImagesTitles.push(object.title)
      currentObject[object.id]=object;
    });

    VISH.Utils.loader.loadImagesOnCarrousel(carrouselImages,_onImagesLoaded,carrouselDivId,carrouselImagesTitles);
    
  }
	
	 var _onImagesLoaded = function(){
    $("#" + carrouselDivId).show();
		
		var options = new Array();
    options['rows'] = 1;
    options['callback'] = _onClickCarrouselElement;
    options['rowItems'] = 5;
    options['styleClass'] = "title";
    VISH.Editor.Carrousel.createCarrousel(carrouselDivId, options);
  }
	
  var _onAPIError = function(){
	    VISH.Debugging.log("Error")
  }
	 
  
  var _onClickCarrouselElement = function(event){
		var objectId = $(event.target).attr("objectid");
		var renderedObject = VISH.Editor.Object.renderObjectPreview(currentObject[objectId].content)
		_renderObjectPreview(renderedObject,currentObject[objectId]);
		selectedObject = currentObject[objectId];	
  }
  
  
  var _renderObjectPreview = function(renderedObject,object){
    var objectArea = $("#" + previewDivId).find("#tab_flash_repo_content_preview_flash");
	  var metadataArea = $("#" + previewDivId).find("#tab_flash_repo_content_preview_metadata");
	  $(objectArea).html("");
	  $(metadataArea).html("");
	  if((renderedObject)&&(object)){
	    $(objectArea).append(renderedObject);
	    var table = VISH.Utils.generateTable(object.author,object.title,object.description);
	    $(metadataArea).html(table);
			$("#" + footId).find(".okButton").show();
	  }
  }
	
	var _cleanObjectPreview = function(){
		var objectArea = $("#" + previewDivId).find("#tab_flash_repo_content_preview_flash");
    var metadataArea = $("#" + previewDivId).find("#tab_flash_repo_content_preview_metadata");
    $(objectArea).html("");
    $(metadataArea).html("");
    $("#" + footId).find(".okButton").hide();
	}
	
  
  var addSelectedObject = function(){
    if(selectedObject!=null){
      VISH.Editor.Object.drawObject($(selectedObject.content));
      $.fancybox.close();
    }
  }
	
  return {
    init                : init,
		onLoadTab				    : onLoadTab,
		addSelectedObject   : addSelectedObject
  };

}) (VISH, jQuery);
