var express = require('express');
var fs=require("fs");
var bodyParser = require('body-parser')
var postMiddleware = bodyParser.urlencoded({extended:false});
var flash=require("connect-flash");

var productRouter=require("./controller/product");
var authRouter=require("./controller/auth");
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/store");

//cookie-parser
var session=require("express-session");
var app = express();

// Add Session Middleware
var sessionMiddleware=session({
  secret:"#@$@#%$^&",
  //cookie:{maxAge:60*60*24*7}
})
app.use(sessionMiddleware);
// flash Middleware
app.use(flash());

app.use(function(request,response,next){
  var user=request.session.user;
//  console.log(user.name);
  response.locals={user:user}
  next();
})


app.use(express.static("public"));
fs.readdirSync(__dirname+"/model").forEach(function(file){
  require("./model/"+file);
})


app.use("/user",authRouter);
app.use("/product",productRouter);

app.get("/",function(request,respones){
    respones.send("home");    
});

app.get("*",function(request,respones){
    respones.send("page not found");
});

app.set("view engine","ejs");
app.set("views","./view");

app.listen(8000);