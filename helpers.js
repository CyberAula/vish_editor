var configuration = require('./configuration/configuration').getConfiguration();

exports.helpers = {
	appFullName: function(name, version) {
		return configuration["appName"] + " " + configuration["appVersion"];
	},
	appName: configuration["appName"],
	email: configuration["feedbackEmail"],
	version: configuration["appVersion"]
};



exports.dynamicHelpers = {
	flash: function(req,res){
		return req.flash();
	}
};