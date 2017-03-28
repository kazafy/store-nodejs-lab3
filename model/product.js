var mongoose=require("mongoose")
var Schema=mongoose.Schema;

var products=new Schema({
  name:String,
  price:Number,
  userid:Schema.Types.ObjectId,
  desc:String,
  category:String,
  img:String
});
products.index({'$**': 'text'});
// function getProduct(id ,callback){
// }

// function getProducts(callback){
//     mongoose.model("products").find({},{},callback );
// }

// function getUserProducts(userId ,callback){
// }


// Register ORM Layer..
mongoose.model("products",products);
