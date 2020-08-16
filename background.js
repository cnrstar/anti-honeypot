'use strict'
const manifest = chrome.runtime.getManifest();
const { version } = manifest;
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const {url} = details;
        const [protocal, u1] = url.split('://');
        const [host] = u1.split('/');
        const hostSplit = host.split('.');

        const currentUrl = hostSplit[hostSplit.length - 2] + '.' + hostSplit[hostSplit.length - 1];

        const WhiteList = ['baidu.com','qq.com','csdn.net','weibo.com','cnblogs.com']   //白名单
        for (const WhiteSite of WhiteList) {
            if (currentUrl.indexOf(WhiteSite)>0){ 
                return;
            }
        }
        const path = u1.replace(currentUrl, '');
        let redirectUrl;
        let cancel;
        console.log(path)
        {
            const data = JSON.parse(localStorage.data || '{}');
            const blockQueryStringList = (data.blockQueryStringList || '').split(/\s+/g);
            for (const q of blockQueryStringList) {
                if (protocal == 'http' || protocal == 'https') {
                    if (q && path.includes(q)) {
                        redirectUrl = 'data:text/javascript;charset=UTF-8;base64,' + btoa(`;`);
                        alert('1111111');
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
