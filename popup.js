// popup.js

// 初始化插件状态为已启动
let isEnabled = true;

// 从 storage 中读取插件状态
chrome.storage.sync.get('isEnabled', function(data) {
    // 如果之前存储了状态，则使用该状态，否则默认为已启动
    isEnabled = data.isEnabled !== undefined ? data.isEnabled : true;
    updateButtonAndStatus();
});

// 更新按钮文本和状态显示
function updateButtonAndStatus() {
    const toggleButton = document.getElementById('toggleButton');
    const statusElement = document.getElementById('status');
    if (isEnabled) {
        toggleButton.textContent = '暂停插件';
        statusElement.textContent = '当前状态: 运行中';
    } else {
        toggleButton.textContent = '启动插件';
        statusElement.textContent = '当前状态: 已暂停';
    }
}

// 切换插件状态
function toggleExtension() {
    isEnabled = !isEnabled;
    updateButtonAndStatus();
    // 存储新的插件状态
    chrome.storage.sync.set({isEnabled: isEnabled}, function() {
        // 发送消息给 background.js 更新插件状态
        chrome.runtime.sendMessage({action: "toggleExtension", enabled: isEnabled});
    });
}

// 为按钮添加点击事件监听器
document.getElementById('toggleButton').addEventListener('click', toggleExtension);
