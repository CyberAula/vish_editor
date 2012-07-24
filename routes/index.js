var initialized = false;
exports.init = function(app) {
	console.log("App vale " + typeof app)
	
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
	    return controllers.index(req,res);
	  }
	}

	app.get('/', controllers.index);
	app.get('/home', requiresLogin, controllers.home);

	//Routes for presentation resource
	app.get('/presentation', requiresLogin, controllers.presentation.index);
	app.get('/presentation/new', requiresLogin, controllers.presentation.new);
	app.post('/presentation', requiresLogin, controllers.presentation.create);
	app.get('/presentation/:id', controllers.presentation.show);
	app.get('/presentation/:id/edit', requiresLogin, controllers.presentation.edit);
	app.put('/presentation/:id', requiresLogin,controllers.presentation.update);
	app.delete('/presentation/:id', requiresLogin,controllers.presentation.destroy);

	//Not founded url
	app.all('*', controllers.error);
}


