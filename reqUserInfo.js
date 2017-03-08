var cheerio = require('cheerio');
var request = require('request');
var UserInfoSave = require('./route/UserInfo/UserInfoSave');
var fs = require('fs');
var userInfoSave = new UserInfoSave();

var authorLinkPage;
var authorFollowUrl;
/**
 * GET USER LINK
 * 获取用户连接
 * @param url
 * @param callback
 */
function reqUserLink(url, callback) {
    request(url, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            $ = cheerio.load(body);

            var authorLink;
            //定位内容
            $('.author-link').each(function () {
                authorLink = this.attribs.href;
                authorLinkPage = "http://www.zhihu.com" + authorLink;
                authorFollowUrl = "http://www.zhihu.com" + authorLink + '/following/topics';

                reqUserInfo(authorFollowUrl, function (err, data) {
                    console.log("   request user info >>>>");
                    console.log(data);
                    console.log("=======");
                    userInfoSave.saveUserInfo(data.username, data.sex, data.subTopics);
                });

                userInfoSave.sayHello();
            });
            callback(null, authorLink);
        }
    });
}

/**
 * GET USER INFO & INSERT INTO DATABASE
 * 获取用户页面，并写进数据库
 * @param url
 * @param callback
 */
function reqUserInfo(url, callback) {
    request(url, function (err, res, body) {
        console.log(url);
        $ = cheerio.load(body.toString());
        var username = $(".ProfileHeader-name").text();
        var sex ;
        var female=$('.Icon--female').html();
        var male=$('.Icon--male').html();
        if (female != null&&male==null) {
            sex = 'female';
        }else if(female==null&&male!=null){
            sex='male';
        }else {
            sex='none';
        }

        //关注话题
        var personalTopicList = [];
        var topic='';
        $('.List-item .TopicLink .Popover').each(function () {
             topic = this.children[0].children[0].data;
           personalTopicList.push(topic);
        });
        var userInfo = {username: username, sex: sex, subTopics:personalTopicList };
        callback(null, userInfo);
    });

}


function reqUserQuestion(url,callback) {
    request(url,function (err, res) {
     var   $=cheerio.load(res.body.toString());

        fs.writeFile('userQuestion.html',res.body.toString(),function (err,data) {

        });

       $('.ContentItem-title a').each(function () {
           var questionUrl=this.attribs.href;
           var questionTitle=this.children[0].data;
           console.log(questionUrl+">>>+"+questionTitle);
       });


    });
}
/*
reqUserLink("https://www.zhihu.com/question/56536646/", function (err, data) {
    //   console.log(data);
});*/
reqUserQuestion('http://nba.hupu.com/',function (err, data) {

})
