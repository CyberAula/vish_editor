VISH.Editor.Image = (function(V,$,undefined){
	
	var contentToAdd = null;
	var uploadDivId = "tab_pic_upload_content";
	var urlDivId = "tab_pic_from_url_content";
	var urlInputId = "picture_url";
	
	var init = function(){
		VISH.Editor.Image.Flikr.init();
		VISH.Editor.Image.Repository.init();
		
		//Load from URL
		$("#" + urlDivId + " .previewButton").click(function(event) {
      if(VISH.Police.validateObject($("#" + urlInputId).val())[0]){
        VISH.Editor.Object.drawPreview(urlDivId, $("#" + urlInputId).val())
				contentToAdd = $("#" + urlInputId).val()
      }
    });
		
		//Upload content
		var options = VISH.Editor.getOptions();
		var tagList = $("#" + uploadDivId + " .tagList")
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
    var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");
		
		$("#" + uploadDivId + " input[name='document[file]']").change(function () {
      $("#" + uploadDivId + " input[name='document[title]']").val($("#" + uploadDivId + " input:file").val());
			_resetUploadFields();
			$(tagList).parent().show();
			$("#" + uploadDivId + ' form' + ' .button').show();
			$("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
    });
      
    $("#" + uploadDivId + " #upload_document_submit").click(function(event) {
			if(!VISH.Police.validateFileUpload($("#" + uploadDivId + " input[name='document[file]']").val())[0]){
        event.preventDefault();
      } else {
        if (options) {
          var description = "Uploaded by " + options["ownerName"] + " via Vish Editor"
          $("#" + uploadDivId + " input[name='document[description]']").val(description);
          $("#" + uploadDivId + " input[name='document[owner_id]']").val(options["ownerId"]);
          $("#" + uploadDivId + " input[name='authenticity_token']").val(options["token"]);
          $("#" + uploadDivId + " .documentsForm").attr("action", options["documentsPath"]);
					$("#" + uploadDivId + " input[name='tags']").val(VISH.Utils.convertToTagsArray($(tagList).tagit("tags")));
					var tagList = $("#" + uploadDivId + " .tagList")
          $(tagList).parent().hide();
					$("#" + uploadDivId + " .upload_progress_bar_wrapper").show();
        }
      }
    });
  
    $("#" + uploadDivId + ' form').ajaxForm({
      beforeSend: function() {
          var percentVal = '0%';
          bar.width(percentVal);
          percent.html(percentVal);
      },
      uploadProgress: function(event, position, total, percentComplete) {
          var percentVal = percentComplete + '%';
          bar.width(percentVal)
          percent.html(percentVal);
      },
      complete: function(xhr) {
          processResponse(xhr.responseText);
          var percentVal = '100%';
          bar.width(percentVal)
          percent.html(percentVal);
      }
    });	
		
	};
	
	var onLoadTab = function(tab){
		if(tab=="upload"){
			_onLoadUploadTab();
		}
		if(tab=="url"){
			_onLoadURLTab();
		}
	};
	
	var _onLoadURLTab = function(){
		contentToAdd = null;
		VISH.Editor.Object.resetPreview(urlDivId);
		$("#" + urlInputId).val("");
  }
	
	var _onLoadUploadTab = function(){
		contentToAdd = null;
		
		//Hide and reset elements
		var tagList = $("#" + uploadDivId + " .tagList")
    $(tagList).parent().hide();
		$("#" + uploadDivId + ' form' + ' .button').hide();
		$("#" + uploadDivId + " .upload_progress_bar_wrapper").hide();
    $("#" + uploadDivId + " input[name='document[file]']").val("");	
		_resetUploadFields();
		
    VISH.Editor.API.requestTags(_onTagsReceived)
	}
	
	var _resetUploadFields = function(){
		var bar = $("#" + uploadDivId + " .upload_progress_bar");
    var percent = $("#" + uploadDivId + " .upload_progress_bar_percent");
    
    bar.width('0%');
    percent.html('0%');
    VISH.Editor.Object.resetPreview(uploadDivId)
    
    var tagList = $("#" + uploadDivId + " .tagList")
    $(tagList).tagit("reset")
	}
	 
  var _onTagsReceived = function(data){
		 var tagList = $("#" + uploadDivId + " .tagList");
		 
		 //Insert the three first tags.
		 if ($(tagList).children().length == 0){
		 	  $.each(data, function(index, tag) {
	        if(index==3){
	          return false; //break the bucle
	        }
	        $(tagList).append("<li>" + tag + "</li>")
        });
				
				$(tagList).tagit({tagSource:data, sortable:true, maxLength:15, maxTags:8 , 
        watermarkAllowMessage: "Add tags", watermarkDenyMessage: "limit reached" });
		 }
  }
	
	
	var processResponse = function(response){
		try  {
	    var jsonResponse = JSON.parse(response)
	    if(jsonResponse.src){
				if (VISH.Police.validateObject(jsonResponse.src)[0]) {
				  VISH.Editor.Object.drawPreview(uploadDivId,jsonResponse.src)
          contentToAdd = jsonResponse.src
		    }
	    }
    } catch(e) {
      //No JSON response
    }
	}
	
	var drawPreviewElement = function(divId){
    VISH.Editor.Object.drawPreviewObject(contentToAdd);
  }
	
  /**
   * Function to draw an image in a zone of the template
   * the zone to draw is the one in current_area (params['current_el'])
   * this function also adds the slider and makes the image draggable
   * param area: optional param indicating the area to add the image, used for editing excursions
   * param style: optional param with the style, used in editing excursion
   */
  var drawImage = function(image_url, area, style){    
	  var current_area;
	  var image_width = 325;  //initial image width
	  var image_style = "";
	
	  if(area){
  		current_area = area;
    }	else {
  		current_area = VISH.Editor.getCurrentArea();
    }
	
  	if(style){
  		image_style = style;
  		image_width = V.SlidesUtilities.getWidthFromStyle(style);
  	}
  	var template = VISH.Editor.getTemplate(); 
    var nextImageId = VISH.Editor.getId();
    var idToDragAndResize = "draggable" + nextImageId;
    current_area.attr('type','image');
    current_area.html("<img class='"+template+"_image' id='"+idToDragAndResize+"' title='Click to drag' src='"+image_url+"' style='"+style+"'/>");
    
    V.Editor.addDeleteButton(current_area);
    
    //the value to set the slider depends on the width if passed in the style, we have saved that value in image_width    
    var thevalue = image_width/325;
    $("#menubar").before("<div id='sliderId"+nextImageId+"' class='theslider'><input id='imageSlider"+nextImageId+"' type='slider' name='size' value='"+thevalue+"' style='display: none; '></div>");      
    
    //double size if header to insert image
    //I HAVE NOT DONE IT BECAUSE WE NEED TO CHANGE ALSO THE SLIDESMANAGER TO DISPLAY DOUBLE SIZE
    //if(current_area.attr('areaid')==="header"){
    //	current_area.css("height", "48px");
    //}
            
    $("#imageSlider"+nextImageId).slider({
      from: 1,
      to: 8,
      step: 0.5,
      round: 1,
      dimension: "x",
      skin: "blue",
      onstatechange: function( value ){
          $("#" + idToDragAndResize).width(325*value);
      }
    });
    $("#" + idToDragAndResize).draggable({
    	cursor: "move",
    	stop: function(){
    		$(this).parent().click();  //call parent click to select it in case it was unselected	
    	}
    });
  };
  
  
	return {
		init                : init,
		onLoadTab	          : onLoadTab,
		drawImage           : drawImage,
		drawPreviewElement  : drawPreviewElement
	};

}) (VISH, jQuery);
