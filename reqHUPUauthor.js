var cheerio = require('cheerio');
var request = require('request');
const async = require('async');

var fs = require('fs');


/**
 * 进入帖子列表,获取所有主题帖子
 * @param url
 * @param callback
 */
var topicUrlList = [];
var authorUrlList = [];
function getVote(url, callback) {
    var pattern = /^\/[A-Za-z]/;
    request(url, function (err, res) {
        console.log(url);
        $ = cheerio.load(res.body.toString());
        $(".p_title a").each(function () {
            var topicLink = this.attribs.href;
            //     console.log(topicLink);
            // console.log(pattern.test(topicLink));
            if (pattern.test(topicLink) == false && topicLink != undefined) {
                var topicUrl = 'https://bbs.hupu.com' + topicLink;
                //     console.log(topicUrl);
                //     getAuthorPage(topicUrl);
                topicUrlList.push(topicUrl);
            }

        });

        //下一页
        var nextPage = $(".next").attr('href');
        if (nextPage) {
            nextPage = 'https://bbs.hupu.com' + nextPage;
            getVote(nextPage, function (err, data) {

            });
        }
    });


    callback(null, topicUrlList);

}


/**
 * 进入主题帖，获取每个回复作者的url
 * @param url
 * @param callback
 */
function getAuthorPage(url, callback) {

    request(url, function (err, res) {
        if (err) {
            console.log(url);
            console.log("get AUTHOR PAGE err>>" + err);
        }
        var $ = cheerio.load(res.body);
        var authorLink;
        authorLink = $('.author .left a').attr('href');
        var authorLinkPattern = /^h/;
        /*作者页面存在就执行*/
        if (authorLinkPattern.test(authorLink) == true) {
            authorLink = authorLink.replace("/topic", "");
            authorUrlList.push(authorLink);
        }
        callback(err, authorUrlList);
    });
}

/**
 * 获取作者名字
 * @param url
 * @param callback
 */
function getAuthorInfo(url, callback) {
    request(url, function (err, res) {
        if (err) {
            console.log("get AUTHOR INFO >>" + err);
        }
        var $ = cheerio.load(res.body);
        //   console.log(url);
        var authorName = $('.mpersonal div').text();
        console.log("AUTHOR NAME>>" + authorName);
        //var authorSex=$('span [itemprop]');
        // console.log(authorSex);
        callback(authorName);
    });
    // callback(err,$);
}

async.series([
    function (callback) {
        getVote('https://bbs.hupu.com/freestyle', function (err, data) {
            if (err) {
                console.log("MAIN PROGRAM ERROR >>" + err);
            } else {
                topicUrlList = data;
                console.log(topicUrlList);
            }
        });
        callback(topicUrlList);
    },
    function (callback) {
        async.eachSeries(topicUrlList, function (topicUrl) {
            getAuthorPage(topicUrl, function (err, data) {
                if (err) {
                    console.log("get author page ERRRRROR>>" + err);
                } else {
                    authorUrlList = data;
                }
            });
        });
        callback(null);

    },
    function (callback) {
        async.eachSeries(authorUrlList,function (authorUrl) {
            getAuthorInfo(authorUrl,function (err,data) {
                if(err){
                    console.log(err);
                }else{
                    console.log(data);
                }
            });

        });
        callback(null);
    }

],function (err, result) {
console.log(result);
});
