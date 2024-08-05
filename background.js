'use strict';
// 初始化插件状态和计数器
let isEnabled = true;

const currentVersion = chrome.runtime.getManifest().version;
// 更新检查地址
const updateUrl = 'http://chatcs.megavector.cn/antihonypot.txt';

// 当插件安装或更新时，或者Chrome启动时，检查更新
chrome.runtime.onInstalled.addListener(() => {
    checkForUpdate();
});

chrome.runtime.onStartup.addListener(() => {
    checkForUpdate();
});

// 检查更新的函数
function checkForUpdate() {
    fetch(updateUrl)
        .then(response => response.text())
        .then(text => {
            // 假设txt文件内容是形如 "1.0.0" 的版本号字符串
            const latestVersion = text.trim();
            const v2 = parseInt(latestVersion.replace(/\./g, ''));
            const v1 = parseInt(currentVersion.replace(/\./g, ''));
            // 比较版本号，这里使用了简单的字符串比较，实际应用中可能需要更复杂的版本比较逻辑
            if (v2 > v1) {
                notifyUserToUpdate(latestVersion);
            }
        })
        .catch(error => {
            console.log('Error checking for update:', error);
        });
}

// 通知用户更新的函数
function notifyUserToUpdate(latestVersion) {
    const options = {
        type: 'basic',
        iconUrl: 'img/logo.png', // 插件的图标
        title: '插件更新可用',
        message: `发现新版本 ${latestVersion}，请访问插件页面下载更新。`
    };

    chrome.notifications.create('updateNotification', options, () => {});
}

// 监听通知点击事件，当用户点击通知时，可以打开插件的页面
chrome.notifications.onClicked.addListener(notificationId => {
    if (notificationId === 'updateNotification') {
        chrome.tabs.create({ url: 'chrome://extensions/' });
    }
});


// 假设这是你用于处理网络请求的监听函数
function handleWebRequest(details) {
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
            const urlObj = new URL(url);
            return [urlObj.hostname, urlObj.pathname + urlObj.search];
        }
        
        //根据url获取主域名
        function get_domain(url){
            if (!url) return null;
            var re_domain = /([a-zA-Z0-9-]+)(?:.com\b|.net\b|.edu\b|.miz\b|.biz\b|.cn\b|.cc\b|.org\b)/;
            var domain = url.match(re_domain);
            return domain ? domain[0] : null;
        }
        //判断host是否在黑名单内
        function inBlackList(host) {
            //黑名单host来自长亭D-sensor的溯源api，共47个
            const BlackList = ["account.itpub.net", "accounts.ctrip.com", "ajax.58pic.com", "api.csdn.net", "api.ip.sb", "api.passport.pptv.com", "bbs.zhibo8.cc", "bit.ly", "blog.csdn.net", "blog.itpub.net", "c.v.qq.com", "chinaunix.net", "cmstool.youku.com", "comment.api.163.com", "databack.dangdang.com", "dimg01.c-ctrip.com", "down2.uc.cn", "github.com", "hd.huya.com", "home.51cto.com", "home.ctfile.com", "home.zhibo8.cc", "hudong.vip.youku.com", "i.jrj.com.cn", "iask.sina.com.cn", "itunes.apple.com", "m.ctrip.com", "m.game.weibo.cn", "mapp.jrj.com.cn", "my.zol.com.cn","passport.ctrip.com", "passport.game.renren.com", "passport.iqiyi.com", "playbill.api.mgtv.com", "renren.com", "skylink.io", "u.faloo.com", "ucenter.51cto.com", "v.huya.com", "v2.sohu.com", "vote2.pptv.com", "wap.sogou.com", "webapi.ctfile.com", "weibo.com", "www.58pic.com", "www.iqiyi.com", "www.iteye.com", "www.zbj.com", "www.cndns.com", "mozilla.github.io", "www.sitestar.cn", "api.fastadmin.net", "m.site.baidu.com", "restapi.amap.com", "login.sina.com.cn", "now.qq.com", "message.dangdang.com", "musicapi.taihe.com", "api-live.iqiyi.com", "api.m.jd.com", "tie.163.com", "pcw-api.iqiyi.com", "so.v.ifeng.com", "passport.baidu.com", "wz.cnblogs.com", "passport.cnblogs.com", "hzs14.cnzz.com", "mths.be", "validity.thatscaptaintoyou.com", "stc.iqiyipic.com", "s14.cnzz.com", "sb.scorecardresearch.com", "js.cndns.com", "datax.baidu.com", "assets.growingio.com", "www.gnu.org", "wappassalltest.baidu.com", "baike.baidu.com", "ka.sina.com.cn", "p.qiao.baidu.com", "map.baidu.com", "www.dangdang.com", "g.alicdn.com", "s.faloo.com", "msg.qy.net", "morn.cndns.com", "i.qr.weibo.cn", "github.comgithub.com", "uis.i.sohu.com", "www.tianya.cn", "passport.mop.com", "commapi.dangdang.com", "comment.money.163.com", "chaxun.1616.net", "tieba.baidu.com", "remind.hupu.com", "service.bilibili.com", "node.video.qq.com", "api.weibo.com", "www.jiyoujia.com"];
            for (const BlackSite of BlackList) {
                if (host == BlackSite) {
                    return true;
                }
            }
            return false;
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

        if (mainDomain == targetDomain) { //如果相等表示正常域内访问
            console.log(targetDomain);
        } else { //如果不相等，可能是跨域访问，需要继续判断
            const blockQueryStringList = ['callback', 'jsonp', 'javascript'];
            for (const q of blockQueryStringList) {
                if (protocal == 'http' || protocal == 'https') {
                    if (q && targetPath.includes(q)) {
                        redirectUrl = 'data:text/javascript;charset=UTF-8;base64,' + btoa(`;`);
                        if (inBlackList(targetHost)) {
                            // 黑名单拦截
                            new Notification('拦截黑名单' + targetHost);
                        } else {
                            // 普通拦截
                            new Notification('拦截可疑溯源请求：' + targetHost);
                        }
                    }
                }
            }

        }
    if (redirectUrl) return {
            redirectUrl
        }
        else return {};
}


// 设置监听器
chrome.webRequest.onBeforeRequest.addListener(
    handleWebRequest,
    {
        urls: ["<all_urls>"]
    },
    ["blocking"]
);


// 接收来自 popup.html 的消息
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "toggleExtension") {
        isEnabled = message.enabled;
        if (isEnabled) {
            // 如果插件之前被禁用，重新添加监听器
            chrome.webRequest.onBeforeRequest.addListener(
                handleWebRequest,
                {
                    urls: ["<all_urls>"]
                },
                ["blocking"]
            );
        } else {
            // 如果插件被禁用，移除监听器
            chrome.webRequest.onBeforeRequest.removeListener(handleWebRequest);
        }
    }
});

// 其他 background.js 代码逻辑...
