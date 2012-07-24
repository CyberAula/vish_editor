//RESOURCE MAPPING (REST)

// GET     /presentation                       ->  index
// GET     /presentation/new                   ->  new
// POST    /presentation                       ->  create
// GET     /presentation/:presentationId       ->  show
// GET     /presentation/:presentationId/edit  ->  edit
// PUT     /presentation/:presentationId       ->  update
// DELETE  /presentation/:presentationId       ->  destroy

 var db = require("../db").connect();
 var Presentation = db.model('Presentation');

exports.index = function(req,res){
  console.log("Presentation index");
  res.render('index');
}

exports.get = function(req,res){
  console.log("Presentation get");
  res.render('index');
}

exports.show = function(req,res){
  var id = req.params.presentation;
  var presentation = Presentation.findById(id, function(err,presentation){
    if(err){
      res.render('home')
    } else {
      res.render('presentation/show', {locals: {presentation: presentation}});
    }
  });
}

exports.new = function(req,res){
  var options = JSON.stringify(require('../configuration/configuration_vishEditor').getOptions());
  res.render('presentation/new', { locals: { options: options }});
}

exports.create = function(req,res){

  console.log("New presentation called")

  if(req.user){
    console.log("Auth success")
    var presentation = new Presentation();
    var presentationJson = JSON.parse(req.body.presentation.json);
    presentation.title = presentationJson.title;
    presentation.description = presentationJson.description;
    presentation.avatar = presentationJson.avatar;
    // presentation.tags = presentationJson.tags;
    presentation.author = req.user.name;
    presentation.content = req.body.presentation.json;

    presentation.save( function(err){
      if(err){
         req.flash('warn',err.message);
         res.render('home');
      } else {
        res.redirect('/presentation/' + presentation._id.toHexString());
      }  
    });
  } else {
    res.render('index')
  }
}

exports.edit = function(req,res){
  console.log("Presentation edit");
  if(req.user){
      res.render('home');
  } else {
    res.render('index')
  }
}

exports.update = function(req,res){
  console.log("Presentation update");
  if(req.user){
      res.render('home');
  } else {
    res.render('index')
  }
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