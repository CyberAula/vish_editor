VISH.Editor.Presentation.File = (function(V,$,undefined){

	var fileDivId = "tab_json_file_content";
	var inputFilesId = "json_file_input";
	var buttonId = "json_preview_button";
	
	var initialized = false;

	var init = function(){
		if(!initialized){
			$("#"+buttonId).click(function(){
				var files = $("#"+inputFilesId)[0].files; 
				if(files.length>0){
					_insertFile(files[0]);
				}
			});
			initialized=true;
		}
	};
	
	var onLoadTab = function(tab){
		$("#json_file_input").attr("value","");
	};

	var _insertFile = function(file){
		// V.Debugging.log(escape(file.name));

		// Only process json files.
		// if (!f.type.match('json.*')) {
		// 	return;
		// }

		var reader = new FileReader();

		reader.onload = (function(theFile) {
			return function(e) {
				try {
					var json = JSON.parse(e.target.result);
					V.Editor.Presentation.previewPresentation(json);
				} catch (e) {
					V.Debugging.log("Error reading JSON file");		
				}
			};
		})(file);

		reader.readAsText(file);
	}

	var exportToJSON = function(){
		var presentation = V.Editor.savePresentation();
		V.Editor.API.downloadJSON(presentation);
	}

	return {
		init 				: init,
		onLoadTab 			: onLoadTab,
		exportToJSON		: exportToJSON
	};

}) (VISH, jQuery);

