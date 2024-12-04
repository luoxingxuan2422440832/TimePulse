// renderer.js (渲染进程)

const NOTIFICATION_TITLE = 'timePulse';
const NOTIFICATION_BODY = '小结这半小时状态吧';
const CLICK_MESSAGE = 'Notification clicked';
const CLOSE_MESSAGE = 'Notification closed';

// 检查通知权限
if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
} else {
    requestNotificationPermission();
}

function requestNotificationPermission() {
    if (Notification.permission === 'granted') {
        // 如果已经授予权限，立即发送第一次通知
        sendNotification();
        // 每半小时发送一次通知
        setInterval(sendNotification, 1800000); // 30 分钟 = 1800000 毫秒
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                // 如果用户授予权限，立即发送第一次通知
                sendNotification();

            } else {
                console.log('User has denied notification permissions');
            }
        });
    } else {
        console.log('User has denied notification permissions');
    }
}

function sendNotification() {
    const notification = new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY });

    // 处理通知点击事件
    notification.onclick = () => {
        console.log(CLICK_MESSAGE);
        // 你可以在这里执行其他操作，例如打开某个页面或弹出对话框
    };

    // 处理通知关闭事件
    notification.onclose = () => {
        console.log(CLOSE_MESSAGE);
    };
}