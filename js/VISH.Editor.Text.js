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
    current_area.html("<div class='wysiwygInstance' id="+wysiwygId+" style='width:"+wysiwygWidth+"px; height:"+wysiwygHeight+"px;'><div><font size='3'>"+initial_text+"</font></div></div>");
    myNicEditor.addInstance(wysiwygId);

	// add a button to delete the current text area   
    V.Editor.addDeleteButton(current_area);
    
  };
	
	/**
	 * function to change
	 */
	var changeFontSizeToRelative = function(zone){
		//replace all font tags by span tags with a proper class
		$(zone).find("font").each(function(index,elem){
			var size = $(elem).attr("size");
			var sel = {'arial' : 'arial','comic sans ms' : 'comic','courier new' : 'courier','georgia' : 'georgia', 'helvetica' : 'helvetica', 'impact' : 'impact', 'times new roman' : 'times', 'trebuchet ms' : 'trebuchet', 'verdana' : 'verdana'};
			var face = sel[$(elem).attr("face")] ? sel[$(elem).attr("face")]:"arial";
			
			$(elem).closest("div").addClass("vish-parent-font" + size);
			$(elem).replaceWith("<span class='vish-font" + size + " vish-font"+face+"'>" + $(elem).html() + "</span>");
		});
		
		return $(zone).html();
	};
	
	
	return {
		init              			: init,
		launchTextEditor  			: launchTextEditor,
		changeFontSizeToRelative  	: changeFontSizeToRelative
	};

}) (VISH, jQuery);
