var UserShema=require('./UserSchema');
var mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/ZhihuCrawler');

function UserSaveRoute() {
    this.sayHello=function () {
       console.log("hello  user save route");
    };
    this.saveUserInfo=function (username,sex,subTopic) {
        var userShema=new UserShema();
        userShema.userName=username;
        userShema.sex=sex;
        userShema.subTopics=subTopic;
    
        userShema.save(function (err) {
            if(err){
                console.error(err);
            }else{
                console.log("SAVE USER INFO SUCCESS");
            }
        });
    }

}

module.exports=UserSaveRoute;