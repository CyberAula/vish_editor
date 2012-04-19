VISH.Editor.Text = (function(V,$,undefined){
	
	var myNicEditor; // to manage the NicEditor WYSIWYG
	
	var init = function(){
		$(document).on('click','.textthumb', launchTextEditor);
	}
	
 /**
  * function called when user clicks on the text thumb
  * Allows users to include text content in the slide using a WYSIWYG editor
  * param area: optional param indicating the area to add the wysiwyg, used for editing excursions
  */
  var launchTextEditor = function(event, area, initial_text ){
  	var current_area;
  	if(area){
  		current_area = area;
  	}
  	else{
  		current_area = $(this).parents(".selectable");
  		initial_text = "Insert text here";
  	}
	
	// only one instance of the NicEditor is created
    if(myNicEditor == null) {
      myNicEditor = new nicEditor();
      myNicEditor.setPanel('slides_panel');
    }
    
    current_area.attr('type','text');
    var wysiwygId = "wysiwyg_" + current_area.attr("id");
    var wysiwygWidth = current_area.width() - 10;
    var wysiwygHeight = current_area.height() - 10;
    current_area.html("<div class='wysiwygInstance' id="+wysiwygId+" style='width:"+wysiwygWidth+"px; height:"+wysiwygHeight+"px;'>"+initial_text+"</div>");
    myNicEditor.addInstance(wysiwygId);

	// add a button to delete the current text area   
    V.Editor.addDeleteButton(current_area);
    
  };
	
	
	
	
	return {
		init              : init,
		launchTextEditor  : launchTextEditor
	};

}) (VISH, jQuery);
