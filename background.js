'use strict'
const manifest = chrome.runtime.getManifest();
const {
    version
} = manifest;
var count = 0
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        //url:当前的url；initiator：浏览器状态栏里的domain
        let {
            url,
            initiator
        } = details;

        //如果发起者为空，直接赋值url
        if (typeof (initiator) == "undefined") {
            initiator = url;
        }
        const protocal = url.split("://")[0];

        //根据url返回域名和对应的path
        function GetHostAndPath(url) {
            var arrUrl = url.split("//"); //  http://www.baidu.com/aaaa.php?aaa
            var start = arrUrl[1].indexOf("/");
            var host = arrUrl[1].substring(0, start);
            var path = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符

            var result = new Array(host, path);
            return result
        }
        //根据url获取主域名
        function get_domain(url){
            var domain;
            var re_domain=/([a-zA-Z0-9-]+)(.com\b|.net\b|.edu\b|.miz\b|.biz\b|.cn\b|.cc\b|.org\b){1,}/g;
            domain=url.match(re_domain);
            return domain[0];
        }
        //判断host是否在黑名单内
        function inBlackList(host) {
            //黑名单host来自长亭D-sensor的溯源api，共47个
            const BlackList = ["account.itpub.net", "accounts.ctrip.com", "ajax.58pic.com", "api.csdn.net", "api.ip.sb", "api.passport.pptv.com", "bbs.zhibo8.cc", "bit.ly", "blog.csdn.net", "blog.itpub.net", "c.v.qq.com", "chinaunix.net", "cmstool.youku.com", "comment.api.163.com", "databack.dangdang.com", "dimg01.c-ctrip.com", "down2.uc.cn", "github.com", "hd.huya.com", "home.51cto.com", "home.ctfile.com", "home.zhibo8.cc", "hudong.vip.youku.com", "i.jrj.com.cn", "iask.sina.com.cn", "itunes.apple.com", "m.ctrip.com", "m.game.weibo.cn", "mapp.jrj.com.cn", "my.zol.com.cn","passport.ctrip.com", "passport.game.renren.com", "passport.iqiyi.com", "playbill.api.mgtv.com", "renren.com", "skylink.io", "u.faloo.com", "ucenter.51cto.com", "v.huya.com", "v2.sohu.com", "vote2.pptv.com", "wap.sogou.com", "webapi.ctfile.com", "weibo.com", "www.58pic.com", "www.iqiyi.com", "www.iteye.com", "www.zbj.com", "www.cndns.com", "mozilla.github.io", "www.sitestar.cn", "api.fastadmin.net", "m.site.baidu.com", "restapi.amap.com", "login.sina.com.cn", "now.qq.com", "message.dangdang.com", "musicapi.taihe.com", "api-live.iqiyi.com", "api.m.jd.com", "tie.163.com", "pcw-api.iqiyi.com", "so.v.ifeng.com", "passport.baidu.com", "wz.cnblogs.com", "passport.cnblogs.com", "hzs14.cnzz.com", "mths.be", "validity.thatscaptaintoyou.com", "stc.iqiyipic.com", "s14.cnzz.com", "sb.scorecardresearch.com", "js.cndns.com", "datax.baidu.com", "assets.growingio.com"];
            for (const BlackSite of BlackList) {
                if (host == BlackSite) {
                    return true
                }
            }
            return false
        }

        var mainDomain = get_domain(initiator); //发起者的主域名
        var targetHost = GetHostAndPath(url)[0]; //跨域或本域访问的目标主机
        var targetPath = GetHostAndPath(url)[1]; //跨域或本域访问的目标路径
        var targetDomain = get_domain(url) //目标主域名

        const WhiteList = ['baidu.com', 'qq.com', 'csdn.net', 'weibo.com', 'cnblogs.com','aliyun.com','ctrip.com','weibo.cn','iqiyi.com','163.com','126.com','51cto.com','taobao.com','sogou.com','iteye.com','58.com','google.com','fofa.so','jd.com','tmall.com','github.io','github.com','sina.com.cn','mi.com'] //白名单
        for (var WhiteSite of WhiteList) {
            if (mainDomain == WhiteSite) {
                console.log('命中白名单'+mainDomain);
                return;
            }
        }

        let redirectUrl;
        let cancel;

        if (mainDomain == targetDomain) { //如果相等表示正常域内访问
            console.log(targetDomain);
            return;
        } else { //如果不相等，可能是跨域访问，需要继续判断
            const blockQueryStringList = ['callback', 'jsonp', 'javascript'];
            for (const q of blockQueryStringList) {
                if (protocal == 'http' || protocal == 'https') {
                    if (q && targetPath.includes(q)) {
                        redirectUrl = 'data:text/javascript;charset=UTF-8;base64,' + btoa(`;`);
                        if (inBlackList(targetHost)) {
                            // 黑名单拦截
                            count += 1;
                            new Notification('拦截黑名单' + count + '次：' + targetHost);
                        } else {
                            // 普通拦截
                            new Notification('拦截可疑溯源请求：' + targetHost);
                        }
                    }
                }
            }
        }
        if (cancel) return {
            cancel
        };
        else if (redirectUrl) return {
            redirectUrl
        }
        else return {};
    }, {
        urls: ["<all_urls>"]
    },
    ["blocking"]
);