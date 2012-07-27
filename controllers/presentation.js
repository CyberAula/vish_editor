//RESOURCE MAPPING (REST)

// GET     /presentation                       ->  index
// GET     /presentation/new                   ->  new
// POST    /presentation                       ->  create
// GET     /presentation/:presentationId       ->  show
// GET     /presentation/:presentationId/edit  ->  edit
// PUT     /presentation/:presentationId       ->  update
// DELETE  /presentation/:presentationId       ->  destroy

var database = require("../db/api");
var options = JSON.stringify(require('../public/vishEditor/configuration/configuration.js').getOptions());

exports.index = function(req,res){
  console.log("Presentation index");
  res.render('index');
}

exports.get = function(req,res){
  console.log("Presentation get");
  res.render('index');
}

exports.show = function(req,res){
  console.log("Presentation show");
  var id = req.params.id;
  database.findPresentationById(id,function(err,presentation){
    if(err){
      res.render('home');
    } else {
      database.findUserById(presentation.author,function(err,user){
        if((err)||(user===null)){
          res.render('home');
        } else {
          res.render('presentation/show', {locals: {presentation: presentation, author: user.name, options: options}});
        }
      });
    }
  });
}

exports.new = function(req,res){
  res.render('presentation/new', { locals: { options: options }});
}

exports.create = function(req,res){
  database.createPresentation(req.user,req.body.presentation.json,function(err,presentationId){
    if(err){
      res.render('home')
    } else {
      var data = new Object();
      data.url = '/presentation/' + presentationId;
      res.contentType('application/json');
      res.send(data);
    }
  });
}

exports.edit = function(req,res){
  console.log("Presentation edit");
  var id = req.params.id;
  database.findPresentationById(id,function(err,presentation){
    if(err){
      res.render('home');
    } else {
      database.findUserById(presentation.author,function(err,user){
        if((err)||(user===null)){
          res.render('home');
        } else {
          res.render('presentation/edit', {locals: {presentation: presentation, author: user.name, options: options}});
        }
      });
    }
  });
  res.render('home');
}

exports.update = function(req,res){
  console.log("Presentation update");
  res.render('home');
}




// var util = require('util');


// //DB settings
// var Mongoose = require('mongoose');
// var db = Mongoose.connect('mongodb://localhost/db')

// require('../products');
// var Product = db.model('Product');
// var photos = require('../photos');


// exports.index = function(req,res){
//   console.log("Products index");
//   Product.find({},function(err,products){
//     if(err){
//       console.log(err)
//     }
//     res.render('products/index', { locals: { products: products }});
//   });
// }

// exports.get = function(req,res){
//   console.log("Products get");
// }

// exports.show = function(req,res){
//   console.log("Products show");
//   var id = req.params.product;
//   var product = Product.findById(id, function(err,product){
//     console.log("err: " + err);
//     console.log("product: " + product);
//     if(err){
//       res.send("Error on show product: " + err);
//     } else {
//       res.render('products/show', {locals: { product: product}})
//     }
//   });
// }

// exports.new = function(req,res){
//     console.log("Products new");
//     var product = req.body && req.body.product || new Product();

//     photos.list(function(err,photo_list){
//     if(err){
//       throw err;
//     }
//     res.render('products/new', {locals: { 
//       product: product,
//       photos: photo_list
//     }})
//   })
// }

// exports.create = function(req,res){
//   console.log("Products create");
//   var product = new Product(req.body.product);
//   product.save( function(err){
//     if(err){
//        req.flash('warn',err.message);
//        res.render('sessions/new');
//     } else {
//       res.redirect('/products/' + product._id.toHexString());
//     }  
//   });
// }

// exports.edit = function(req,res){
//   console.log("Products edit");
//   var id = req.params.product;
//   var product = Product.findById(id, function(err,product){
//     photos.list(function(err,photo_list){
//       if(err){
//         throw err;
//       }
//       res.render('products/edit', {locals: { 
//         product: product,
//         photos: photo_list
//       }})
//     })
//   });
// }

// exports.update = function(req,res){
//   console.log("Products update");
//   var id = req.params.product;

//   Product.findById(id,function(err,product){
//     product.name = req.body.product.name;
//     product.description = req.body.product.description;
//     product.price  = req.body.product.price;
//     product.photo  = req.body.product.photo;
//     product.save( function(){
//       res.redirect('/products/'+product._id.toHexString());
//     });
//   });
// }

// exports.load = function(id,callback){
//   console.log("Load");
//   callback(null, {id: id, name: "Product #" + id});
// }