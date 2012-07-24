/*
 * Configure Standalone Vish Editor
 */

var options;

module.exports.getOptions = function(env) {
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

		if(env=="development"){
			options["developping"] = true;
		} else if(env=="production"){
			options["developping"] = false;
		}

		options["lang"] = null;

		console.log("Vish Editor Configured Options")
		console.log(options)
	}

	return options;
}