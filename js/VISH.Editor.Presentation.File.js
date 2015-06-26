VISH.Editor.Presentation.File = (function(V,$,undefined){

	var fileDivId = "tab_efile_content";
	var inputFileId = "efile_input";
	var buttonId = "efile_preview_button";
	
	var initialized = false;

	var init = function(){
		if(!initialized){
			var previewButton = $("#"+buttonId);
			var formInputEl = $("#" + inputFileId);

			$(previewButton).click(function(){
				var files = $("#"+inputFileId)[0].files; 
				if(files.length>0){
					_insertFile(files[0]);
				} else {
					_showErrorDialog(V.I18n.getTrans("i.NoFileError"));
				}
			});

			$(formInputEl).change(function(){
				$(previewButton).show();
			});

			initialized=true;
		}
	};
	
	var onLoadTab = function(tab){
		$("#"+buttonId).hide();
		$("#"+inputFileId).attr("value","");
	};

	var _insertFile = function(file){
		// V.Debugging.log(escape(file.name));
		// V.Debugging.log(file);

		//Check file type
		var fileType = undefined;

		if(file.type != ""){
			//File API recognized the file type.
			if(file.type.match("text/xml")){
				fileType = "xml";
			} else if(file.type.match("json")){
				fileType = "json";
			} else if(file.type.match("application/zip")){
				fileType = "zip";
			}
		} else {
			//File API is uncapable of recognizing the file type.
			//Get filetype from name.
			var objectInfo = V.Object.getObjectInfo(file.name);
			if(objectInfo.type==="json" || objectInfo==="xml"){
				fileType = objectInfo.type;
			}
		}

		if(typeof fileType == "undefined"){
			_showErrorDialog(V.I18n.getTrans("i.NoSupportedFileError"));
			return;
		}

		var reader = new FileReader();

		reader.onload = (function(theFile) {
			return function(e){
				switch(fileType){
					case "xml":
						var isIMSQTICompliant = V.Editor.IMSQTI.isCompliantXMLFile(e.target.result);
						var isMoodleXMLCompliant = V.Editor.MoodleXML.isCompliantXMLFile(e.target.result);
						if(isIMSQTICompliant){
							var json = V.Editor.IMSQTI.getJSONFromXMLFile(e.target.result);
							V.Editor.Presentation.previewPresentation(json);
						} else if(isMoodleXMLCompliant) {
							var moodleXMLFileAnalysis = V.Editor.MoodleXML.getJSONFromXMLFile(e.target.result);
							var json = moodleXMLFileAnalysis.json;
							var questionsSupported = moodleXMLFileAnalysis.questionsSupported;
							switch(questionsSupported){
								case "ALL":
									V.Editor.Presentation.previewPresentation(json);
									break;
								case "SEVERAL":
									//Show dialog and then preview presentation
									var options = {};
									options.text = V.I18n.getTrans("i.QuizErrorQuestionsUnsupported");
									var button1 = {};
									button1.text = V.I18n.getTrans("i.Ok");
									button1.callback = function(){
										V.Editor.Presentation.previewPresentation(json);
									}
									options.buttons = [button1];
									V.Utils.showDialog(options);
									break;
								case "NONE":
								default:
									_showErrorDialog(V.I18n.getTrans("i.NoSupportedFileError"));
									break;
							}
						} else {
							_showErrorDialog(V.I18n.getTrans("i.NoSupportedFileError"));
							return;
						}
						break;
					case "json":
						try {
							var json = JSON.parse(e.target.result);
							V.Editor.Presentation.previewPresentation(json);
						} catch (e) {
							_showErrorDialog(V.I18n.getTrans("i.readJSONfileError"));
						}
						break;
					case "zip":
						//parse Zip
						try{
		                    var zip = new JSZip(e.target.result);
		                    var uncompressedfile = zip.file(/.xml/);
		                    }
		                catch(e){
		                	_showErrorDialog(V.I18n.getTrans("i.NoSupportedFileError"));
						return;
		                }

	                	if (uncompressedfile.length == 1){
	                		targetFile = uncompressedfile[0].asText();

		                    var isIMSQTICompliant = V.Editor.IMSQTI.isCompliantXMLFile(targetFile);
							var isMoodleXMLCompliant = V.Editor.MoodleXML.isCompliantXMLFile(targetFile);
							if(isIMSQTICompliant){
								var json = V.Editor.IMSQTI.getJSONFromXMLFile(targetFile);
								V.Editor.Presentation.previewPresentation(json);
							} else if(isMoodleXMLCompliant) {
								var moodleXMLFileAnalysis = V.Editor.MoodleXML.getJSONFromXMLFile(targetFile);
								var json = moodleXMLFileAnalysis.json;
								var questionsSupported = moodleXMLFileAnalysis.questionsSupported;
								switch(questionsSupported){
									case "ALL":
										V.Editor.Presentation.previewPresentation(json);
										break;
									case "SEVERAL":
										//Show dialog and then preview presentation
										var options = {};
										options.text = V.I18n.getTrans("i.QuizErrorQuestionsUnsupported");
										var button1 = {};
										button1.text = V.I18n.getTrans("i.Ok");
										button1.callback = function(){
											V.Editor.Presentation.previewPresentation(json);
										}
										options.buttons = [button1];
										V.Utils.showDialog(options);
										break;
									case "NONE":
									default:
										_showErrorDialog(V.I18n.getTrans("i.NoSupportedFileError"));
										break;
								}
							} else {
								_showErrorDialog(V.I18n.getTrans("i.NoSupportedFileError"));
								return;
							}
						}
						else if (uncompressedfile.length > 1 ){
							var quizesArray = [];

							for (var i = 0; i < uncompressedfile.length; i++) {
								if(uncompressedfile[i].name != "imsmanifest.xml"){
							    	var iterationFile = uncompressedfile[i].asText();
							    	var isIMSQTICompliant = V.Editor.IMSQTI.isCompliantXMLFile(iterationFile);
							    	if (isIMSQTICompliant){
							    		var json = V.Editor.IMSQTI.getJSONFromXMLFile(iterationFile);
							    		quizesArray.push(json.slides[0]);
							    	} 
							    }
							}

							if (quizesArray.length > 0){
								var finalJson = {"VEVersion": "0.9.1", "type": "presentation", "theme": "theme1", "slides": quizesArray };
								V.Editor.Presentation.previewPresentation(finalJson);

							}else{
								_showErrorDialog(V.I18n.getTrans("i.NoSupportedFileError"));
							}

						} else {
							_showErrorDialog(V.I18n.getTrans("i.NoSupportedFileError"));
						}
						break;
					default:
						_showErrorDialog(V.I18n.getTrans("i.NoSupportedFileError"));
						return;
				}
			};
		})(file);
		if(fileType != "zip"){
		reader.readAsText(file);
		}else{
			reader.readAsArrayBuffer(file);
		}
	};

	var _showErrorDialog = function(msg){
		var options = {};
		options.width = 650;
		options.height = 190;
		options.text = msg;
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

