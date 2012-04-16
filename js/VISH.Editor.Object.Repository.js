VISH.Editor.Object.Repository = (function(V,$,undefined){
	
  var carrouselDivId = "tab_flash_repo_content_carrousel";
  var previewDivId = "tab_flash_repo_content_preview";
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
	  _renderObjectPreview(null);
      _requestInicialData();
	}
  }
	
  /*
   * Request inicial data to the server.
   */
  var _requestInicialData = function(){
    VISH.Editor.API.requestRecomendedFlash(VISH.Editor.Object.Repository.onDataReceived,VISH.Editor.Object.Repository.onAPIError);
  }
	
  /*
   * Request data to the server.
   */
  var _requestData = function(text){
    VISH.Editor.API.requestFlashes(text,VISH.Editor.Object.Repository.onDataReceived,VISH.Editor.Object.Repository.onAPIError);
  }
	
  /*
   * Fill tab_flash_repo_content_carrousel div with server data.
   */
  var onDataReceived = function(data){
	  
    //Clean previous content
    VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
  
    //Clean previous object
    currentObject = new Array();  
	
    var content = "";
    
    $.each(data, function(index, object) {
      var objectInfo = VISH.Editor.Object.getObjectInfo(object.content)
      var imageSource = null;        
      
      switch (objectInfo.type){
        case "swf":
          imageSource = "/images/carrousel/swf.png"
	      break;
	    case "youtube":
	      imageSource = "/images/carrousel/youtube.png"
	      break;
	    case "html":
	      imageSource = "/images/carrousel/iframe.png"
	      break;
	    default:
	      imageSource = "/images/carrousel/object.jpeg"
	      break;
      }
      
      content = content + "<img src='" + imageSource + "' objectId='" + object.id + "'>"
      currentObject[object.id]=object;
    });

    $("#" + carrouselDivId).html(content);
    
    $(".carrousel_object_wrapper").children().addClass("carrousel_object");
    _autoResizeObjects();
    VISH.Editor.Carrousel.createCarrousel(carrouselDivId,1,VISH.Editor.Object.Repository.onClickCarrouselElement);
  }
	
  var onAPIError = function(){
	console.log("API error");
//    VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
  }
	 
  
  var onClickCarrouselElement = function(event){
	var objectId = $(event.target).attr("objectid");
//	var renderedObject = VISH.Renderer.renderObject(currentObject[objectId],"preview");
//	_renderObjectPreview(renderedObject,currentObject[objectId]);
	selectedObject = currentObject[objectId];
	addSelectedObject();
  }
  
  
  var _renderObjectPreview = function(renderedObject,object){
//    var objectArea = $("#" + previewDivId).find("#tab_flash_repo_content_preview_flash");
//	var metadataArea = $("#" + previewDivId).find("#tab_flash_repo_content_preview_metadata");
//	$(objectArea).html("");
//	$(metadataArea).html("");
//	if((renderedObject)&&(object)){
//	  $(objectArea).append(renderedObject);
//	  var table = _generateTable(object.author,object.title,object.description);
//	  $(metadataArea).html(table);
//	}
  }
	
  
  var _autoResizeObjects = function(){
	  $(".carrousel_object_wrapper").children().height($(".carrousel_object_wrapper").height());
	  $(".carrousel_object_wrapper").children().width($(".carrousel_object_wrapper").width());
  }
	
  var _generateTable = function(author,title,description){
	
    if(!author){
	  author = "";
	}
	if(!title){
	  title = "";
	}
	if(!description){
	  description = "";
	}
		
    return "<table class=\"metadata\">"+
		     "<tr class=\"even\">" +
		       "<td class=\"title header_left\">Author</td>" + 
		       "<td class=\"title header_right\"><div class=\"height_wrapper\">" + author + "</div></td>" + 
		     "</tr>" + 
		     "<tr class=\"odd\">" + 
		   	   "<td class=\"title\">Title</td>" + 
		       "<td class=\"info\"><div class=\"height_wrapper\">" + title + "</div></td>" + 
		     "</tr>" + 
		     "<tr class=\"even\">" + 
		       "<td colspan=\"2\" class=\"title_description\">Description</td>" + 
		     "</tr>" + 
		     "<tr class=\"odd\">" + 
		  	   "<td colspan=\"2\" class=\"info_description\"><div class=\"height_wrapper_description\">" + description + "</div></td>" + 
		     "</tr>" + 
		   "</table>";
  }
	
  
  var addSelectedObject = function(){
    if(selectedObject!=null){
      var content = $(selectedObject.content)
      var src = _getSourceFromObject(content)
      if(src){
        VISH.Editor.Object.drawObject(src);
      }
      $.fancybox.close();
    }
  }
  
  var _getSourceFromObject = function(object){
	  if ($(object).attr("src").length > 0){
		  return $(object).attr("src");
	  } else if($(object).attr("data").length > 0){
		  return $(object).attr("data");
	  }
	  return null;
  }
	
	
  return {
    init                    : init,
	onLoadTab				: onLoadTab,
	onDataReceived  		: onDataReceived,
	onAPIError				: onAPIError,
	addSelectedObject        : addSelectedObject,
	onClickCarrouselElement : onClickCarrouselElement
  };

}) (VISH, jQuery);
