VISH.Editor.Flash.Repository = (function(V,$,undefined){
	
  var carrouselDivId = "tab_flash_repo_content_carrousel";
  var previewDivId = "tab_flash_repo_content_preview";
  var currentFlash = new Array();
  var selectedFlash = null;
  
  var init = function(){
    var myInput = $("#tab_flash_repo_content").find("input[type='search']");
	$(myInput).watermark('Search content');
	$(myInput).keydown(function(event) {
	  if(event.keyCode == 13) {
        VISH.Editor.Flash.Repository.requestData($(myInput).val());
        $(myInput).blur();
	  }
    });
  }
	
  var onLoadTab = function(){
    var previousSearch = ($("#tab_flash_repo_content").find("input[type='search']").val()!="");
	if(! previousSearch){
	  _renderFlashPreview(null);
      _requestInicialData();
	}
  }
	
  /*
   * Request inicial data to the server.
   */
  var _requestInicialData = function(){
    VISH.Editor.API.requestRecomendedFlash(VISH.Editor.Flash.Repository.onDataReceived,VISH.Editor.Flash.Repository.onAPIError);
  }
	
  /*
   * Request data to the server.
   */
  var requestData = function(text){
    VISH.Editor.API.requestFlashes(text,VISH.Editor.Flash.Repository.onDataReceived,VISH.Editor.Flash.Repository.onAPIError);
  }
	
  /*
   * Fill tab_flash_repo_content_carrousel div with server data.
   */
  var onDataReceived = function(data){
	  
    //Clean previous content
    VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
  
    //Clean previous flash
    currentFlash = new Array();  
	
    var content = "";
    
    $.each(data, function(index, flash) {
      //Flash preview... [flashid]
      content = content + "<div style='width:150px' flashid='" + flash.id + "' class='carrousel_object_wrapper'>" +  flash.content + "</div>"
      currentFlash[flash.id]=flash;
    });

    $("#" + carrouselDivId).html(content);
    
    $(".carrousel_object_wrapper").children().addClass("carrousel_object");
    _autoResizeObjects();
    VISH.Editor.Carrousel.createCarrousel(carrouselDivId,1,VISH.Editor.Flash.Repository.onClickCarrouselElement);
  }
	
  var onAPIError = function(){
	console.log("API error");
//    VISH.Editor.Carrousel.cleanCarrousel(carrouselDivId);
  }
	 
  
  var onClickCarrouselElement = function(event){
	var flashId = $(event.target).attr("flashid");
//	var renderedFlash = VISH.Renderer.renderFlash(currentFlash[flashId],"preview");
//	_renderFlashPreview(renderedFlash,currentFlash[flashId]);
	selectedFlash = currentFlash[flashId];
	addSelectedFlash();
  }
  
  
  var _renderFlashPreview = function(renderedFlash,flash){
//    var flashArea = $("#" + previewDivId).find("#tab_flash_repo_content_preview_flash");
//	var metadataArea = $("#" + previewDivId).find("#tab_flash_repo_content_preview_metadata");
//	$(flashArea).html("");
//	$(metadataArea).html("");
//	if((renderedFlash)&&(flash)){
//	  $(flashArea).append(renderedFlash);
//	  var table = _generateTable(flash.author,flash.title,flash.description);
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
	
  
  var addSelectedFlash = function(){
    if(selectedFlash!=null){
      var content = $(selectedFlash.content)
      var src = _getSourceFromObject(content)
      if(src){
        VISH.Editor.Flash.drawFlashObject(src);
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
	requestData             : requestData,
	onDataReceived  		: onDataReceived,
	onAPIError				: onAPIError,
	addSelectedFlash        : addSelectedFlash,
	onClickCarrouselElement : onClickCarrouselElement
  };

}) (VISH, jQuery);
