var db = require("../db/api");


exports.index = function(req, res, redirectUrl) {
  if(req.user){
  	res.redirect('/home')
  } else {
    if(redirectUrl){
      res.render('index', { locals: {redirectUrl: redirectUrl } });
    } else {
      res.render('index');
    }
  }
};

exports.home = function(req, res) {
  console.log("User Home");
  db.findAllPresentationsOfUser(req.user._id.toHexString(), function(err,presentations){
    if(err){
      res.render('home');
    } else {
      res.render('home', {locals: { presentations: presentations}});
    }
  });
  
};

exports.error = function(req, res) {
  req.flash('warn','Resource not found');
  res.render('genericError', { locals: {returnUrl: "/home" } });
};

exports.authError = function(req,res){
	req.flash('warn','Authorization error');
  res.render('genericError', { locals: {returnUrl: "/home" } });
}

exports.presentation = require('./presentation');
exports.image = require('./image');
exports.object = require('./object');
