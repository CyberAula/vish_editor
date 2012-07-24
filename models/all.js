var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;


////////////////
//Presentations
////////////////

var PresentationSchema = new Schema({
  title : {type: String},
  description : {type: String},
  avatar : {type: String},
  tags : {type: [String]},
  author : {type: String },
  content : {type: String },
  created  : { type: Date, default: Date.now },
  updated : { type: Date, default: Date.now },
  state : {type: String, enum: ['public','private','draft'], default: 'public', index: true}
});

Mongoose.model('Presentation',PresentationSchema);


////////////////
//Users
////////////////

var UserSchema = new Schema({
  login : {type: String, index:true},
  password : {type: String, index:true},
  role : {type: String , enum: ['user','admin'], default: 'user'},
  authBy : {type: String, enum: ['password','twitter','facebook'], default: 'password', index: true},
  name : {type: String},
  presentations: [PresentationSchema]
});

Mongoose.model('User',UserSchema);