var everyauth = require('everyauth');
var _ = require('underscore');
var db = require("../db").connect();

//Get models
var User = db.model('User');
var Presentation = db.model('Presentation');

exports.index = function(req, res) {
  if(req.user){
  	loadHome(req,res);
  } else {
  	res.render('index')
  }
};

exports.home = function(req, res) {
  loadHome(req,res);
};


function loadHome(req,res){
    //Get user presentations
    //Coming soon...
    res.render('home');
}