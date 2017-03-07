var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var UserSchema=new Schema({
    username:String,
    sex:String,
    local:String,
    job:String,
    personalDetail:String,
    subTopics:String

});