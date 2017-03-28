var express=require('express');
var bodyParser=require('body-parser');
var postMiddleware=bodyParser.urlencoded({extended:false})
var fs = require('fs');
var product = require(__dirname+"/../model/product")
var mongoose=require("mongoose");
var multer=require("multer");

// Get Express Router
var router=express.Router();


var uploadFileMiddleware=multer({dest:__dirname+"/../public/upload",
fileFilter:function(request,file,cb){
  if(file.mimetype=="image/jpeg"){
    request.fileStatus="file uploaded";
    cb(null,true);
  }else{
    request.fileStatus="file not uploaded";
    cb(null,false);
  }
}});

router.get("/",function(request,response){
  mongoose.model("products").find({},{},
      function (err , data){
        if(!err){
          console.log(data);  
          response.locals.products=data;            
          response.render("product/list");

        }
      }
   );
  
});

router.get("/new",function(request,response){
    var user = request.session.user;
    if(user){
        condition = {userid:user._id};
      response.render("product/add");
     }else{
      response.redirect("/user/login");
     }   
});



router.post("/search",postMiddleware,function(request,response){

    mongoose.set('debug', true);    

    mongoose.model("products").find({$text: {$search: request.body.search}})
//       .skip(20)
//       .limit(10)
       .exec(function(err, products) {
            
        response.locals.products = products;
        response.render("product/list");

       });

});


router.use(function(request,response,next){
    if(request.session.user)
    {
            next();
    }    
    else
    {
        response.redirect("/user/login");
    }   
});



router.post("/new",uploadFileMiddleware.single("img"),function(request,response){

    var ProductModel=mongoose.model("products");
    request.body.userid = request.session.user._id;
    request.body.img = request.file.filename;
    var product = new ProductModel(request.body);
    product.save(function (err){
            if(!err){
                response.redirect("/product");
            }else{
                response.send("Error");
            }        
        });
        }
);

router.get("/edit/:id",function(request,response){
    var proId = request.params.id;
    mongoose.model("products").findOne({_id:proId},{},
      function (err , data){
        if(!err){
          console.log(data);  
          response.locals.product=data;            
          response.render("product/edit");
        }
      }
   );
});

router.post("/edit/:id",postMiddleware,function(request,response){
    var proId = request.params.id;
    var user = request.session.user;
    mongoose.model("products").findOne({_id:proId,
                                        userid:user._id},function (err,product){
            if(!err && product){
                product.userid= user._id;
                product.name = request.body.name;
                product.desc = request.body.desc;
                product.price = request.body.price;
                product.category = request.body.category;
                product.img = request.body.img;
                product.save(function (err){
                    if(!err){
                            response.redirect("/product");
                        }else{
                            response.send("Error ");
                        }                                       
                });
            }else{
                response.send("Error ");
            }        
        }); 
});


router.get("/myproducts",function(request,response){

  mongoose.model("products").find({userid:request.session.user._id},{},
      function (err , data){
        if(!err){
          console.log(data);  
          response.locals.products=data;            
          response.render("product/list");

        }
      }
   );
  
});

router.get("/delete/:id",function(request,response){
    var proId = request.params.id;    
    mongoose.model("products")
            .remove({_id:proId,userid:request.session.user._id},function (err){
                if(!err){
                response.redirect("/product");
                }else {
                    response.send("error");
                }
            });
});

module.exports=router;
