VISH.Editor.Image = (function(V,$,undefined){
	
	var init = function(){
		VISH.Editor.Image.Flikr.init();
		VISH.Editor.Image.Repository.init();
	};
	
	var onLoadTab = function(){
		var bar = $('.upload_progress_bar');
    var percent = $('.upload_progress_bar_percent');
    var status = $('#status');
	
	  $("input[name='document[file]']").change(function () {
      $("input[name='document[title]']").val($("input:file").val());
      var description = "Uploaded by " + initOptions["ownerName"] + " via Vish Editor"
      $("input[name='document[description]']").val(description);
			$("input[name='document[owner_id]']").val(initOptions["ownerId"]);
			$("input[name='authenticity_token']").val(initOptions["token"]);
			$(".documentsForm").attr("action",initOptions["documentsPath"])
    });
	
	  $('form').ajaxForm({
      beforeSend: function() {
          status.empty();
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
          status.html(xhr.responseText);
          var percentVal = '100%';
          bar.width(percentVal)
          percent.html(percentVal);
      }
    });
	};
	
  /**
   * Function to draw an image in a zone of the template
   * the zone to draw is the one in current_area (params['current_el'])
   * this function also adds the slider and makes the image draggable
   * param area: optional param indicating the area to add the image, used for editing excursions
   */
  var drawImage = function(image_url, area){    
	var current_area;
  	if(area){
  		current_area = area;
  	}
  	else{
  		current_area = VISH.Editor.getCurrentArea();
  	}
  	var template = VISH.Editor.getTemplate(); 
    var nextImageId = VISH.Editor.getId();
    var idToDragAndResize = "draggable" + nextImageId;
    current_area.attr('type','image');
    current_area.html("<img class='"+template+"_image' id='"+idToDragAndResize+"' title='Click to drag' src='"+image_url+"' />");
    
    V.Editor.addDeleteButton(current_area);
    
    $("#menubar").before("<div id='sliderId"+nextImageId+"' class='theslider'><input id='imageSlider"+nextImageId+"' type='slider' name='size' value='1' style='display: none; '></div>");      
    
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
		init        : init,
		onLoadTab	: onLoadTab,
		drawImage   : drawImage
	};

}) (VISH, jQuery);
