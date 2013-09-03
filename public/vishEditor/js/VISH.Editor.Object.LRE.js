VISH.Editor.Object.LRE = (function(V,$,undefined){

  var carrouselDivId = "tab_object_lre_content_carrousel";
  var previewDivId = "tab_object_lre_content_preview";
  var footId = "tab_object_lre_content_preview_foot";
  var currentObject = new Array();
  var selectedObject = null;

  //add events to inputs
  var init = function(){
		var myInput = $("#tab_object_lre_content").find("input[type='search']");
		$(myInput).watermark(V.Editor.I18n.getTrans("i.SearchContent"));
		$(myInput).keydown(function(event) {
			if(event.keyCode == 13) {
				_requestData($(myInput).val());
				$(myInput).blur();
			}
		});
	};

	var beforeLoadTab = function(){
	};

	var onLoadTab = function(){
	//clean always, as happen in the other tabs
	//var previousSearch = ($("#tab_object_lre_content").find("input[type='search']").val()!="");
	//	if(! previousSearch){
		  _cleanObjectPreview();
		  $("#" + footId).find(".okButton").hide();
	//	}		
  }

  /*
   * Request data to the server.
   */
  var _requestData = function(text){
	_prepareRequest();
	V.Editor.LRE.requestObjects(text, _onDataReceived, _onAPIError);
  }

  var _prepareRequest = function(){
	//Clean previous content
	V.Editor.Carrousel.cleanCarrousel(carrouselDivId);
	$("#" + carrouselDivId).hide();
	_cleanObjectPreview();
	V.Utils.Loader.startLoadingInContainer($("#"+carrouselDivId));
  }
	
  /*
   * Fill tab_object_lre_content_carrousel div with server data.
   */
  var _onDataReceived = function(data){

	//Clean previous object
	currentObject = new Array();  
		var carrouselImages = [];
		var carrouselImagesTitles = [];
	
	var content = "";
	
	if((!data)||(!data.length || data.length==0)){
	  $("#" + carrouselDivId).html("<p class='carrouselNoResults'> No results found </p>");
	  $("#" + carrouselDivId).show();
			return;
	} 
		
	$.each(data, function(index, objectItem) {
	  var objectInfo = V.Object.getObjectInfo(objectItem.object);
				
	  var myImg = $("<img src='" + objectItem.thumbnail + "' objectId='" + objectItem.id + "' title='"+objectItem.title+"'>");
	  carrouselImages.push(myImg);
	  carrouselImagesTitles.push(objectItem.title);
	  currentObject[objectItem.id]=objectItem;
	});

	var options = {};
	options.titleArray = carrouselImagesTitles;
	options.callback = _onImagesLoaded;
	V.Utils.Loader.loadImagesOnContainer(carrouselImages,carrouselDivId,options);
  }
	
	 var _onImagesLoaded = function(){
	V.Utils.Loader.stopLoadingInContainer($("#"+carrouselDivId));
	$("#" + carrouselDivId).show();
		
		var options = new Array();
	options['rows'] = 1;
	options['callback'] = _onClickCarrouselElement;
	options['rowItems'] = 5;
	options['styleClass'] = "title";
	V.Editor.Carrousel.createCarrousel(carrouselDivId, options);
  }
	
  var _onAPIError = function(){
		V.Debugging.log("Error");
  }
	 
  
  var _onClickCarrouselElement = function(event){
		var objectId = $(event.target).attr("objectid");
		if(typeof objectId != "undefined"){
			var renderedObject = V.Editor.Object.renderObjectPreview(currentObject[objectId].object);
			_renderObjectPreview(renderedObject,currentObject[objectId]);
			selectedObject = currentObject[objectId]; 
		}
  }
  
  
  var _renderObjectPreview = function(renderedObject,object){
	var objectArea = $("#" + previewDivId).find("#tab_object_lre_content_preview_object");
	  var metadataArea = $("#" + previewDivId).find("#tab_object_lre_content_preview_metadata");
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
		var objectArea = $("#" + previewDivId).find("#tab_object_lre_content_preview_object");
		var metadataArea = $("#" + previewDivId).find("#tab_object_lre_content_preview_metadata");
		$(objectArea).html("");
		$(metadataArea).html("");
		$("#" + footId).find(".okButton").hide();
	}
	
  
  var addSelectedObject = function(){
	if(selectedObject!=null){
	  V.Editor.Object.drawObject(selectedObject.object);
	  $.fancybox.close();
	}
  }


	return {
		init 					    : init,
		beforeLoadTab				: beforeLoadTab,
		onLoadTab					: onLoadTab,
		addSelectedObject			: addSelectedObject
	};

}) (VISH, jQuery);