VISH.Editor.Text = (function(V,$,undefined){
	
	var myNicEditor; // to manage the NicEditor WYSIWYG
	
	var init = function(){
		$(document).on('click','.textthumb', _launchTextEditor);
	}
	
 /**
  * function called when user clicks on the text thumb
  * Allows users to include text content in the slide using a WYSIWYG editor
  */
  var _launchTextEditor = function(){
	var current_area = $(this).parents(".selectable");
	
	// only one instance of the NicEditor is created
    if(myNicEditor == null) {
      myNicEditor = new nicEditor();
      myNicEditor.setPanel('slides_panel');
    }
    
    current_area.attr('type','text');
    var wysiwygId = "wysiwyg_" + current_area.attr("id");
    var wysiwygWidth = current_area.width() - 10;
    var wysiwygHeight = current_area.height() - 10;
    current_area.html("<div class='wysiwygInstance' id="+wysiwygId+" style='width:"+wysiwygWidth+"px; height:"+wysiwygHeight+"px;'>Insert text here</div>");
    myNicEditor.addInstance(wysiwygId);

	// add a button to delete the current text area   
    V.Editor.addDeleteButton(current_area);
    
    //add focus event to customize css of parent (because parent does not get focus in this case)
    $(document).on('focusin', '#'+wysiwygId, _onWysiwygLoseFocus);
  }
	
	var _onWysiwygLoseFocus = function(){
		console.log("salida");
	};
	
	
	return {
		init              : init
	};

}) (VISH, jQuery);
