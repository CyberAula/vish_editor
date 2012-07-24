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

		configuration["presentationSettings"] = true;
		configuration["presentationTags"] = true;
		configuration["presentationThumbnails"] = true;

		configuration["Vish"] = false;
		configuration["VishLives"] = true;
		configuration["VishUpload"] = true;
		configuration["VishRepo"] = true;

		configuration["Flickr"] = true;
		configuration["Youtube"] = true;
		configuration["Vimeo"] = false;

		configuration["VishIntegration"] = false;

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

		options["lang"] = "en";

		console.log("Vish Editor Configured Options")
		console.log(options)
	}

	return options;
}