/*
 * Configure Standalone Vish Editor
 */

var options;

if(typeof module != 'undefined'){
	module.exports.getOptions = function(env) {
		return getOptions();
	}
}

var getOptions = function(){
	if(!options){

		options = {};
		var configuration = {};

		//Specified VISH Editor Configuration
		
		//Paths
		configuration["ImagesPath"] = "/vishEditor/images/";
		configuration["StylesheetsPath"] = "/vishEditor/stylesheets/";
		configuration["uploadImagePath"] = "/image";
		configuration["uploadObjectPath"] = "/object";
		configuration["uploadPresentationPath"] = "/presentation/";

		configuration["presentationSettings"] = true;
		configuration["presentationTags"] = true;
		configuration["presentationThumbnails"] = true;

		configuration["VishLives"] = true;
		configuration["VishRepo"] = true;

		configuration["Flickr"] = true;
		configuration["Youtube"] = true;
		configuration["Vimeo"] = false;

		configuration["Upload"] = true;

		//Posible values: noserver, node, vish
		configuration["mode"] = "noserver";

		options["configuration"] = configuration;

		if(typeof env != 'undefined'){
			if(env=="development"){
				options["developping"] = true;
			} else if(env=="production"){
				options["developping"] = false;
			}
		} else {
			options["developping"] = true;
		}

		if(options["developping"]==true){
			//Setting developping options
			var developmentSettings = new Object();

			//Possible action: "nothing" or "loadSamples".
			developmentSettings.actionInit = "nothing";
			//Select your samples
			developmentSettings.samples = VISH.Samples.quizes_samples;

			//Possible actions: "view", "edit", or "nothing".
			developmentSettings.actionSave = "view";

			options["developmentSettings"] = developmentSettings;


			//Also you can define a username and token for testing purposes
			options["username"] = "ebarra";
			options["userId"] = "3456";
			options["token"] = "12xfDgR345x6";

			//And a default landguage
			options["lang"] = "en";
		}
		
		if((window.console) && (window.console.log)){
			console.log("Vish Editor Configured Options")
			console.log(options)
		}
	}

	return options;
}