VISH.Editor.Object.Snapshot = (function(V,$,undefined){
		
	var contentToAdd = null;	
	var urlDivId = "tab_object_snapshot_content";
	var urlInputId = "object_snapshot_code";
		
	var init = function(){
		var urlInput = $("#"+urlDivId).find("input");
		// $(urlInput).vewatermark(V.I18n.getTrans("i.pasteWeb"));

		//Load from URL
		$("#" + urlDivId + " .previewButton").click(function(event) {
		  if(V.Police.validateObject($("#" + urlInputId).val())[0]){
			contentToAdd = V.Editor.Utils.autocompleteUrls($("#" + urlInputId).val());
			V.Editor.Object.drawPreview(urlDivId, contentToAdd);
		  }
		});
	};

  
	var onLoadTab = function(tab){
		contentToAdd = null;
		V.Editor.Object.resetPreview(urlDivId);
		$("#" + urlInputId).val("");
	};
	
	
	var drawPreviewElement = function(){
		if(_validateSnapShot(contentToAdd)){
			drawSnapShot(_wrapperSnapShot(contentToAdd));
			$.fancybox.close();
		}
	};
	
	
	var _validateSnapShot = function(object){
		var objectInfo = V.Object.getObjectInfo(object);

		switch (objectInfo.wrapper){
			case null:
				//Verify Web Url
				return _validateUrl(object);
				break;
			case "IFRAME":
				return _validateUrl(objectInfo.source);
				break;
			default:
				return false;
				break;
		}
	};
	
	var _validateUrl = function(url){
		var http_urls_pattern=/(http(s)?:\/\/)([aA-zZ0-9%=_&+?])+([./-][aA-zZ0-9%=_&+?]+)*[/]?/g

		if(url.match(http_urls_pattern)!=null){
			return true;
		} else {
			return false;
		}
	};
	
	var _wrapperSnapShot = function(content){
		var objectInfo = V.Object.getObjectInfo(content);
		content = V.Utils.addParamToUrl(content,"wmode","opaque");
		if(objectInfo.wrapper===null){
			return "<iframe src='" + content + "' wmode='opaque'></iframe>";
		} else {
			return content;
		}
	};
	
	/**
	* Param style: optional param with the style, used in editing presentation
	*/
	var drawSnapShot = function(wrapper,area,style,scrollTop,scrollLeft){
		var current_area;
		var object_style = "";
		if(area){
			current_area = area;
		} else {
			current_area = V.Editor.getCurrentArea();
		}
		if(style){
			object_style = style;
		}

		var template = V.Editor.getTemplate(current_area);
		var nextWrapperId = V.Utils.getId();
		var idToDrag = "draggable" + nextWrapperId;
		var idToResize = "resizable" + nextWrapperId;
		current_area.attr('type', 'snapshot');

		var wrapperDiv = document.createElement('div');
		wrapperDiv.setAttribute('id', idToDrag);
		if(style){
			wrapperDiv.setAttribute('style', style);
		}
		$(wrapperDiv).addClass('snapshot_wrapper');

		var iframeTag = $(wrapper);
		$(iframeTag).attr('id', idToResize);
		$(iframeTag).attr('class', 'snapshot_content');
		$(iframeTag).attr('scrolling', 'no');
		$(iframeTag).attr('wmode', "opaque");
		$(iframeTag).css('pointer-events', "none");

		$(current_area).html("");
		$(current_area).append(wrapperDiv);

		V.Editor.addDeleteButton($(current_area));

		$(wrapperDiv).append(iframeTag);

		//Move scrolls
		if(scrollTop){
			$('#' + idToDrag).scrollTop(scrollTop);
		}
		if(scrollLeft){
			$('#' + idToDrag).scrollLeft(scrollLeft);
		}
		//Also write scroll params (used by Editor Loader)
		$(wrapperDiv).attr('scrollTop',scrollTop);
		$(wrapperDiv).attr('scrollLeft',scrollLeft);

		$('#' + idToDrag).bind('mousedown',function(event){
			event.preventDefault();
		});

		$("#" + idToDrag).draggable({
			cursor : "move",
			disabled: false,
			start: function(event, ui){
				if (!_isBorderClick(event, idToDrag)) {
					return false;
				}
			}
		});

		V.Editor.Tools.loadToolsForZone(current_area);
	};
	
	var _isBorderClick = function(event,idToDrag){
		var accuracy = 6;
		var scrollAccuracy = -10;
		var width = $('#' + idToDrag).width();
		var height = $('#' + idToDrag).height();
		var offset = $('#' + idToDrag).offset();
		var dif1 = event.pageX - offset.left;

		if(dif1<accuracy){
			//Left side"
			return true;
		}
		var dif2 = event.pageY - offset.top;
		if(dif2<accuracy){
			//Top side"
			return true;
		}
		var dif3 = (offset.left + width)-event.pageX;  
		if(dif3<scrollAccuracy){
			//Right side"
			return true;
		}
		var dif4 = (offset.top + height)-event.pageY;
		if(dif4<scrollAccuracy){
			//Bottom side
			return true;
		}

		return false;
	};
	
	/*
	* Resize object and its wrapper automatically
	*/
	var _resizeWebIframe = function(id,width){
		var proportion = $("#" + id).height()/$("#" + id).width();
		$("#" + id).width(width);
		$("#" + id).height(width*proportion);
	};


	return {
		init				: init,
		onLoadTab 			: onLoadTab,
		drawPreviewElement 	: drawPreviewElement,
		drawSnapShot 		: drawSnapShot
	};

}) (VISH, jQuery);
