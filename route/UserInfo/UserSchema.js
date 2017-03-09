var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var UserSchema=new Schema({
    userID:String,
    userName:String,
    sex:String,
  /*  local:String,
    job:String,
    personalDetail:String,*/
    subTopics:Array  //当前url    +/topics  进入关注话题

});

module.exports=mongoose.model('UserShema',UserSchema);