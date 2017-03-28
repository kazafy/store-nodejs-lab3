var mongoose=require("mongoose")
var Schema=mongoose.Schema;

var users=new Schema({
  name:String,
  email:String,
  password:String,
  address:String,
  avatar:String
})
// Register ORM Layer..
mongoose.model("users",users);
