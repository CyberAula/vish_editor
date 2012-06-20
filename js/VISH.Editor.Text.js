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
  		initial_text = "<div><font size='3'>Insert text here</font></div>";
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
	
	/**
	 * function to change from font tag attributes to span
	 */
	var changeFontPropertiesToSpan = function(zone){
		//replace all font tags by span tags with a proper class
		$(zone).find("font").each(function(index,elem){
			var size = $(elem).attr("size");
			var sel = {'arial' : 'arial','comic sans ms' : 'comic','courier new' : 'courier','georgia' : 'georgia', 'helvetica' : 'helvetica', 'impact' : 'impact', 'times new roman' : 'times', 'trebuchet ms' : 'trebuchet', 'verdana' : 'verdana'};
			var face = sel[$(elem).attr("face")] ? sel[$(elem).attr("face")]:"Helvetica";
			//now the color and the background color that is stored in the style			
			var style = "";
			if($(elem).attr("color") !== undefined){
				style += "color:" + $(elem).attr("color") + ";";
			}
			if($(elem).attr("style") !== undefined){
				style += $(elem).attr("style") + ";";
			}
						
			$(elem).closest("div").addClass("vish-parent-font" + size);
			$(elem).replaceWith("<span class='vish-font" + size + " vish-font"+face+"' style='"+style+"'>" + $(elem).html() + "</span>");
		});
		
		//in webkit when copy and paste from the same editable area change <font size=7> to <span style="font-size: -webkit-xxx-large;" > and loses line-height
		$(zone).find("span[style*='font-size']").each(function(index,elem){
			var style = $(elem).attr("style");
			$(elem).attr("style", style + ";line-height: 110%;");
			
		});
		
		return $(zone).html();
	};
	
		
	return {
		init              			: init,
		launchTextEditor  			: launchTextEditor,
		changeFontPropertiesToSpan  : changeFontPropertiesToSpan
	};

}) (VISH, jQuery);
