var db;

exports.connect = function() {
  if (!db) {
  	var Mongoose = require('mongoose');
  	var configuration = require('../configuration/configuration').getConfiguration();
  	db = Mongoose.connect('mongodb://localhost/' + configuration["db"]);
  }
  return db;
}
