VISH.Editor.Text = (function(V,$,undefined){
	
	var myNicEditor; // to manage the NicEditor WYSIWYG
	var initialized = false;

	var init = function(){
		if(!initialized){
			$(document).on('click','.textthumb', launchTextEditor);
			nicEditorInit();
			initialized=true;
		}	
  	}

  	//Singleton: Only one instance of nicEditor
  	var getNicEditor = function(){
		if(!myNicEditor) {
			myNicEditor = new nicEditor();
			myNicEditor.setPanel('slides_panel');
		}
		return myNicEditor;
  	}
	
 /**
  * function called when user clicks on the text thumb
  * Allows users to include text content in the slide using a WYSIWYG editor
  * param area: optional param indicating the area to add the wysiwyg, used for editing presentations
  */
  var launchTextEditor = function(event, area, initial_text ){
  	init();

  	var current_area;
  	if(area){
  		current_area = area;
  	} else {
  		current_area = $(this).parents(".selectable");

  		var fontSize;
  		switch($(current_area).attr("size")){
  			case VISH.Constant.SMALL:
  				fontSize = 4;
  				break;
  			case VISH.Constant.MEDIUM:
  				fontSize = 5;
  				break;
  			case VISH.Constant.LARGE:
  				fontSize = 7;
  				break;
  			default:
  				break;
  		}
  		initial_text = "<div class='initTextDiv'><font size='" + fontSize + "''>" + VISH.Editor.I18n.getTrans("i.WysiwygInit") + "</font></div>";
  	}

 	getNicEditor();
    
    current_area.attr('type','text');
    var wysiwygId = "wysiwyg_" + current_area.attr("id");
    var wysiwygWidth = current_area.width() - 10;
    var wysiwygHeight = current_area.height() - 10;
    current_area.html("<div class='wysiwygInstance' id="+wysiwygId+" style='width:"+wysiwygWidth+"px; height:"+wysiwygHeight+"px;'>"+initial_text+"</div>");
    myNicEditor.addInstance(wysiwygId);

	// add a button to delete the current text area   
    V.Editor.addDeleteButton(current_area); 

    //Remove initial text onClick
    $(".initTextDiv").click(function(event){
    	if(event.target.tagName=="FONT"){
    		var font = $(event.target);
    		var div =  $(event.target).parent();
    	} else if(event.target.tagName=="DIV"){
    		var div = $(event.target);
    		var font = $(event.target).find("font");
    	}
    	if($(font).text()===VISH.Editor.I18n.getTrans("i.WysiwygInit")){
    			//Remove text
    			$(font).text("");
    			$(div).removeClass("initTextDiv");
    			$("#" + wysiwygId).trigger("click");
    	}
    });

  };
	
	/**
	 * function to change from font tag attributes to span
	 */
	var changeFontPropertiesToSpan = function(zone){
		//replace all font tags by span tags with a proper class
		_replaceFontTag(zone);			
		
		//in webkit when copy and paste from the same editable area change <font size=7> to <span style="font-size: -webkit-xxx-large;" > and loses line-height
		$(zone).find("span[style*='font-size']").each(function(index,elem){
			var style = $(elem).attr("style");
			$(elem).attr("style", style + ";line-height: 110%;");
			
		});
		//if everthing is italic or everything is bold or everything is underlined, firefox adds it to the parent
		if($(zone).css("font-style")!=="normal"){
			$(zone).children(':first-child').css("font-style", $(zone).css("font-style"));
		}
		if($(zone).css("font-weight")!==400){
			$(zone).children(':first-child').css("font-weight", $(zone).css("font-weight"));
		}
		if($(zone).css("text-decoration")!=="none"){
			$(zone).children(':first-child').css("text-decoration", $(zone).css("text-decoration"));
		}
		return $(zone).html();
	};
	
	/**
	 * function to replace the font tag with a span, it is called recursively because in firefox it nests font tags
	 */
	var _replaceFontTag = function(zone){
		//hack for firefox that nest zones ones inside others
		_unnestFontTagsInZone(zone);
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
				var finalstyle = "";
				var tmpstyle = $(elem).attr("style");
				//if style contains font-size we remove it and update size variable
				var tmpindex = tmpstyle.indexOf("font-size"); 
				if(tmpindex !== -1){
					var tmpsemicolon = tmpstyle.indexOf(";", tmpindex);
					finalstyle = tmpstyle.substring(0,tmpindex) + tmpstyle.substring(tmpsemicolon+1); //remove the font-size
					var tmpfont = tmpstyle.substring(tmpindex+10,tmpsemicolon );  //+10 because we want to capture the end of font-size
					switch(tmpfont.trim()) {
					case "xxx-large":
						size = 7;
						break;
					case "xx-large":
						size = 6;
						break;
					case "x-large":
						size = 5;
						break;
					case "large":
						size = 4;
						break;
					case "medium":
						size = 3;
						break;
					case "small":
						size = 2;
						break;
					case "x-small":
						size = 1;
						break;
					}
				} else {
					finalstyle = tmpstyle;
				}
					
			 	style += finalstyle + ";";
			}
						
			$(elem).closest("div").addClass("vish-parent-font" + size);
			$(elem).replaceWith("<span class='vish-font" + size + " vish-font"+face+"' style='"+style+"'>" + $(elem).html() + "</span>");
		});
	};
		
	
	/**
	 * hack for firefox that nest font tags
	 */
	var _unnestFontTagsInZone = function(zone) {
		$(zone).find("font").each(function(index, elem) {
			if($(elem).find("font").length >= 0) {
				//nested fonts inside this one
				_unnestFontTags(elem);
			}
		});
	};
	
	/**
	 * hack for firefox that nest font tags
	 * element is a font tag with more font tags inside
	 */
	var _unnestFontTags = function(element) {
		var myelem = element;
		$(myelem).contents().each(function(index, elem) {  //contents gives children tags + text nodes
			if($(elem).find("font").length > 0) {
				//nested fonts inside this one
				_unnestFontTags(elem);
			} else if(!$(elem).is('font')) {
				//if tipe font-> do nothing
				$(elem).wrap("<font size='" + $(myelem).attr("size") + "' style='" + $(myelem).attr("style") + "' color='" + $(myelem).attr("color") + "' face='" + $(myelem).attr("face") + "'>");
			}
		});
		$(myelem).children().unwrap();
	};
	
	return {
		init              			: init,
		launchTextEditor  			: launchTextEditor,
		changeFontPropertiesToSpan  : changeFontPropertiesToSpan, 
		getNicEditor 				: getNicEditor
	};

}) (VISH, jQuery);
