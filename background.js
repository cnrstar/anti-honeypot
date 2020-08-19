'use strict'
const manifest = chrome.runtime.getManifest();
const { version } = manifest;
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {

        //url:当前的url；initiator：浏览器状态栏里的domain
        let {url,initiator} = details;

        //如果发起者为空，直接赋值url
        if (typeof(initiator) == "undefined") {
            initiator = url;
        }
        const protocal = url.split("://")[0];

        //根据url返回域名和对应的path
        function GetHostAndPath(url)
        {
          var arrUrl = url.split("//"); //  http://www.baidu.com/aaaa.php?aaa
          var start = arrUrl[1].indexOf("/");
          var host = arrUrl[1].substring(0,start);
          var path = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

          var result =new Array(host,path);
          return result
        }
        //获取主域名
        function GetMainDomain(host)
        {
          var arrHost = host.split("."); //  a.b.c.baidu.com
          var mainDomain = arrHost[arrHost.length - 2] + '.' + arrHost[arrHost.length - 1];
          return mainDomain;
        }
        

        const mainDomain = GetMainDomain(initiator);//浏览器状态栏的主域名
        const targetHost = GetHostAndPath(url)[0]; //跨域或本域访问的目标主机
        const targetPath = GetHostAndPath(url)[1];//跨域或本域访问的目标路径
        const targetDomain = GetMainDomain(targetHost)  //目标主域名

        const WhiteList = ['baidu.com','qq.com','csdn.net','weibo.com','cnblogs.com']   //白名单
        for (const WhiteSite of WhiteList) {
            if (mainDomain.includes(WhiteSite)){ 
                return;
            }
        }


        let redirectUrl;
        let cancel;
        
        if (mainDomain == targetDomain) //如果相等表示正常域内访问
        {
            console.log(targetDomain);
            return;
        }
        else                                    //如果不相等，可能是跨域访问，需要继续判断
        {
            const blockQueryStringList = ['callback','jsonp','javascript']
            for (const q of blockQueryStringList) {
                if (protocal == 'http' || protocal == 'https') {
                    if (q && targetPath.includes(q)) {
                        console.log(url);
                        redirectUrl = 'data:text/javascript;charset=UTF-8;base64,' + btoa(`;`);
                        new Notification('发现蜜罐！');
                    }
                }
            }
        }
        if (cancel) return { cancel };
        else if (redirectUrl) return { redirectUrl }
        else return {};
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);
