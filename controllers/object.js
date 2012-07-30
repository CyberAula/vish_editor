var fs = require('fs');

// POST    /object                     ->  create

exports.create = function(req,res){
	var originPath = req.files.document.file.path;
	var fileName = req.user.id + "_" + new Date().getTime() + "_" + req.files.document.file.name;
	var destPath = __dirname+'/../public/uploads/objects/'+ fileName;
	var imgUrl = "/uploads/objects/" + fileName;

	fs.rename(originPath , destPath, function (data,error) {
		if(error) {
			var response = new Object();
			response.error = "Error processing object upload";
			res.json(response);
		} else {
			console.log("File upload success");
			var response = new Object();
			response.src = imgUrl;
			res.json(response);
		}
	});
}