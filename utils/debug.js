var orange, green, reset;
orange   = '\033[33m';
green = '\033[32m';
red = '\033[31m';
reset = '\033[0m';

module.exports.initTrace = function(port,enviroment){
	console.log(green + "Express server listening on port " + orange + "%d" + green + " in " + orange + "%s" + green + " mode." + reset, port, enviroment);
}

module.exports.logTrace = function(message) {
	console.log(message);
}

module.exports.errorTrace = function(message) {
	console.error(red + message + reset);
}

