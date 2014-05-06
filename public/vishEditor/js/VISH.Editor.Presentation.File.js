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
				} else {
					_showNoFileDialog();
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
					_showErrorDialog();	
				}
			};
		})(file);

		reader.readAsText(file);
	};

	var _showErrorDialog = function(){
		var options = {};
		options.width = 650;
		options.height = 190;
		options.text = V.I18n.getTrans("i.readJSONfileError");
		var button1 = {};
		button1.text = V.I18n.getTrans("i.Ok");
		button1.callback = function(){
			$.fancybox.close();
		}
		options.buttons = [button1];
		V.Utils.showDialog(options);
	};

	var _showNoFileDialog = function(){
		var options = {};
		options.width = 650;
		options.height = 190;
		options.text = V.I18n.getTrans("i.NoJSONFileError");
		var button1 = {};
		button1.text = V.I18n.getTrans("i.Ok");
		button1.callback = function(){
			V.Editor.Tools.Menu.insertEFile();
		}
		options.buttons = [button1];
		V.Utils.showDialog(options);
	};

	var exportTo = function(format,successCallback,failCallback){
		var presentation = V.Editor.savePresentation();
		V.Editor.API.uploadTmpJSON(presentation,format,successCallback,failCallback);
	};

	return {
		init 			: init,
		onLoadTab 		: onLoadTab,
		exportTo		: exportTo
	};

}) (VISH, jQuery);

