var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;


////////////////
//Presentations
////////////////

var PresentationSchema = new Schema({
  title : {type: String, index: true},
  description : {type: String},
  avatar : {type: String},
  tags : {type: [String]},
  author : {type: String },
  content : {type: String },
  state : {type: String, enum: ['public','private','draft'], default: 'public', index: true},
  created  : { type: Date, default: Date.now },
  updated : { type: Date, default: Date.now }
});

Mongoose.model('Presentation',PresentationSchema);


////////////////
//Users
////////////////

var UserSchema = new Schema({
  login : {type: String, index:true},
  authBy : {type: String, enum: ['password','twitter','facebook'], default: 'password', index: true},
  password : {type: String},
  name : {type: String},
  role : {type: String , enum: ['user','admin'], default: 'user'},
  presentations: [{type: String}],
  created  : { type: Date, default: Date.now },
  updated : { type: Date, default: Date.now }
});

Mongoose.model('User',UserSchema);