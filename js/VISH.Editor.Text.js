VISH.Editor.Text = (function(V,$,undefined){
	
	var myNicEditor; // to manage the NicEditor WYSIWYG
	
	var init = function(){
		$(document).on('click','.textthumb', VISH.Editor.Text.launchTextEditor);
	}
	
 /**
  * function called when user clicks on the text thumb
  * Allows users to include text content in the slide using a WYSIWYG editor
  */
  var launchTextEditor = function(){
		var current_area = VISH.Editor.getCurrentArea();
    if(myNicEditor == null) {
      myNicEditor = new nicEditor();
          myNicEditor.setPanel('slides_panel');
    }
    current_area.attr('type','text');
    var wysiwygId = "wysiwyg_" + current_area[0].id;
    var wysiwygWidth = current_area.width() - 10;
    var wysiwygHeight = current_area.height() - 10;
    current_area.html("<div class='wysiwygInstance' id="+wysiwygId+" style='width:"+wysiwygWidth+"px; height:"+wysiwygHeight+"px;'>Insert text here</div>");
    myNicEditor.addInstance(wysiwygId);
    /*$("#"+wysiwygId).keydown(function(e) {
      if(e.keyCode == 39) {
          
      }
    });*/
  }
	
	
	return {
		init              : init,
		launchTextEditor  : launchTextEditor
	};

}) (VISH, jQuery);
