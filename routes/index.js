var initialized = false;
exports.init = function(app) {
	/**
	 * Routing with authentication middleware
	 */

	 var controllers = require('../controllers');

	/**
	* Middleware authentication
	*/
	function requiresLogin(req,res,next){
	  if(req.user){
	    return next();
	  } else {
	    return controllers.index(req,res,req.url);
	  }
	}
app.get('/presentation/:id/edit', requiresLogin, controllers.presentation.edit);
	app.get('/', controllers.index);
	app.get('/login', controllers.index);
	app.get('/register', controllers.index);
	app.get('/home', requiresLogin, controllers.home);

	//Routes for presentation resource
	app.get('/presentation', requiresLogin, controllers.presentation.index);
	app.get('/presentation/new', requiresLogin, controllers.presentation.new);
	app.post('/presentation', requiresLogin, controllers.presentation.create);
	app.get('/presentation/:id', controllers.presentation.show); // this one does not require login
	
	app.put('/presentation/:id', requiresLogin,controllers.presentation.update);
	app.delete('/presentation/:id', requiresLogin,controllers.presentation.destroy);
	app.get('/presentation/:id/download', requiresLogin,controllers.presentation.download);

	//Embed presentation
	app.get('/presentation/:id/full', controllers.presentation.full); // this one does not require login

	//Post image route
	app.post('/image', requiresLogin, controllers.image.create);

	//Post objects route
	app.post('/object', requiresLogin, controllers.object.create);

	//Not founded url
	app.all('*', controllers.error);
}


