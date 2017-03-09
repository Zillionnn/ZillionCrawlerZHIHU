const  superagent= require("superagent");
const cheerio = require('cheerio');
const fs=require('fs');

const url = {
    url: "https://www.zhihu.com/#signin",
    login_url: "https://www.zhihu.com/login/phone_num",
    target_url: "https://www.zhihu.com/collections"
};

//浏览器请求报文头部  部分信息
const browserMsg = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};

var cookie;

var loginMsg = {
    password: "4501122",
    captcha_type: 'cn',
    phone_num: '15077839058'
};

//获_xrsf值
function getXrsf() {
    superagent.get(url.url).end(function (err, res) {
        if (err) {
            console.error(err);
        } else {
            var $ = cheerio.load(res.text);
            loginMsg._xsrf = $('[name=_xsrf]').attr('value');
             console.log(loginMsg);
            console.log("==========");
        }
    });


}

//发送登录请求，获取cookie信息
function getLoginCookie() {
    superagent.post(url.login_url).set(browserMsg).send(loginMsg).redirects(0).end(function (err, res) {
        if(!err){
            cookie = res.headers["set-cookie"];
            console.dir(cookie);
        }else{
            console.dir(err);
        }
    });
}

function getFollower() {
    superagent.get(url.target_url).set("Cookie",cookie).set(browserMsg).end(function(err,res){
    if(err){
        console.log(err);
    }else{
        var $=cheerio.load(res.text);
        $('.author-link').each(function () {
            var authorLink = this.attribs.href;
        var     authorLinkPage = "http://www.zhihu.com" + authorLink;
         var    authorFollowUrl = "http://www.zhihu.com" + authorLink + '/following/topics';
console.log(authorLink);
        });
    }
});
}

getXrsf();
getLoginCookie();
getFollower();