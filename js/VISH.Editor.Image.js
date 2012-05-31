VISH.Editor.Image = (function(V,$,undefined){
	
	var contentToAdd = null;
	var uploadDiv = "tab_pic_upload_content";
	
	var init = function(){
		VISH.Editor.Image.Flikr.init();
		VISH.Editor.Image.Repository.init();
		
		//Load from URL
		$("#tab_pic_from_url_content .previewButton").click(function(event) {
      if(VISH.Police.validateObject($("#picture_url").val())[0]){
        VISH.Editor.Object.drawPreview("tab_pic_from_url_content", $("#picture_url").val())
				contentToAdd = $("#picture_url").val()
      }
    });
		
		//Upload content
		var options = VISH.Editor.getOptions();
		var tagList = $("#" + uploadDiv + " .tagList")
		var tagit_input = $(tagList).find(".tagit-input")
		var bar = $('.upload_progress_bar');
    var percent = $('.upload_progress_bar_percent');
		
		$("#" + uploadDiv + " input[name='document[file]']").change(function () {
      $("input[name='document[title]']").val($("input:file").val());
    });
      
    $("#" + uploadDiv + " #upload_document_submit").click(function(event) {
			if(!VISH.Police.validateFileUpload($("#" + uploadDiv + " input[name='document[file]']").val())[0]){
        event.preventDefault();
      } else {
        if (options) {
          var description = "Uploaded by " + options["ownerName"] + " via Vish Editor"
          $("#" + uploadDiv + " input[name='document[description]']").val(description);
          $("#" + uploadDiv + " input[name='document[owner_id]']").val(options["ownerId"]);
          $("#" + uploadDiv + " input[name='authenticity_token']").val(options["token"]);
          $("#" + uploadDiv + " .documentsForm").attr("action", options["documentsPath"]);
					$("#" + uploadDiv + " input[name='tags']").val(_convertToTagsArray($(tagList).tagit("tags")));
        }
      }
    });
  
    $("#" + uploadDiv + ' form').ajaxForm({
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
	
	var _convertToTagsArray= function(tags){
		var tagsArray = [];
		
		if((!tags)||(tags.length==0)){
			return tagsArray;
		}
		
    $.each(tags, function(index, tag) {
      tagsArray.push(tag.value)
    });
		
		return tagsArray;
	}
	
	var onLoadTab = function(tab){	
		if(tab=="upload"){
			_onLoadUploadTab();
		}
		if(tab=="url"){
			_onLoadURLTab();
		}
	};
	
	
	var _onLoadURLTab = function(){
		VISH.Editor.Object.resetPreview("tab_pic_from_url_content");
		$("#picture_url").val("");
		contentToAdd = null;
  }
	
	var _onLoadUploadTab = function(){
    var bar = $('.upload_progress_bar');
    var percent = $('.upload_progress_bar_percent');
    
    //Reset fields
    bar.width('0%');
    percent.html('0%');
		VISH.Editor.Object.resetPreview(uploadDiv)
    $("input[name='document[file]']").val("");
		contentToAdd = null;
		
    //Reset tags
		var tagList = $("#" + uploadDiv + " .tagList")
		$(tagList).tagit("reset")
    VISH.Editor.API.requestTags(_onTagsReceived)
	}
	
	 
  var _onTagsReceived = function(data){
		 var tagList = $("#" + uploadDiv + " .tagList");
		 
		 //Insert the three first tags.
		 if ($(tagList).children().length == 0){
		 	  $.each(data, function(index, tag) {
	        if(index==3){
	          return false; //break the bucle
	        }
	        $(tagList).append("<li>" + tag + "</li>")
        });
				
				$(tagList).tagit({tagSource:data, sortable:true, maxLength:15, maxTags:8 , tagsChanged:function (tag, action) {
          //tag==tagName
          //action==["moved","added","popped" (remove)]
          } 
        });
		 }
  }
	
	
	var processResponse = function(response){
		try  {
	    var jsonResponse = JSON.parse(response)
	    if(jsonResponse.src){
				if (VISH.Police.validateObject(jsonResponse.src)[0]) {
				  VISH.Editor.Object.drawPreview(uploadDiv,jsonResponse.src)
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
