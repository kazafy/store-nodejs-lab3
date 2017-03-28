var express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");

// To hash your password ..

var bcrypt=require("bcrypt");
var multer=require("multer");

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



var postRequestMiddleware=bodyParser.urlencoded({extended:false});
var router=express.Router();

router.get("/login",function(request,response){
  // only to display view ..  ,{message:request.flash("message")}
  response.render("auth/login",{message:request.flash("message")})
});

router.post("/login",postRequestMiddleware,function(request,response){
     mongoose.model("users")
                    .findOne({email:request.body.email},
                      {},
                        function(err,user){
                          // To Using bcrypt ...
                          if(user && bcrypt.compareSync(request.body.password,user.password)){
                                  request.session.user=user;
                                  console.log(user._id);
                                  console.log(user.id);
                                  response.redirect("/product");
                          }else {
                              request.flash("message","Invalid username Or password");
                              response.redirect("/user/login")
                          }

                      });
});

router.get("/register",function(request,response){
  response.render("auth/register");
});

router.post("/register",uploadFileMiddleware.single("avatar"),function(request,response){
  // Save New employees
  var UserModel=mongoose.model("users");
  var salt=bcrypt.genSaltSync();
  var hashedPassword=bcrypt.hashSync(request.body.password,salt);
  request.body.password =  hashedPassword;
  request.body.avatar = request.file.filename;
  var user=new UserModel(request.body);
  user.save(function(err){
    if(!err){
      response.redirect("/product");
    }else{
      response.send("Error");
    }
  })
});

router.get("/logout",function(request,response){
  // destroy session..
  request.session.destroy();
  response.redirect("/product")
})

module.exports=router;